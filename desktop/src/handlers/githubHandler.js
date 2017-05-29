import { dialog, BrowserWindow } from 'electron'
import request from 'superagent'
import fs from 'fs'
import _ from 'lodash'
import GithubConsts from 'shared/constants/ipc/GithubConstants'
import MetaComponentConsts from 'shared/constants/ipc/MetaComponentConstants'
import { fork } from 'child_process'
import path from 'path'
import cmd from 'node-cmd'
import bridge from '../bridge'
import Logger from '../log/logger'
import npm from '../process/npmController'
import { startProgressBar, updateProgressBar, endProgressBar } from '../actions/uiActions'
import { githubAuthSuccess, githubAuthFailure } from '../actions/githubActions'
import { componentListSuccess, componentListFailure } from '../actions/metaComponentActions'
import Store from '../Utils/Store'

const { 
  GITHUB_AUTH_REQUESTED,
} = GithubConsts

const {
  MC_LIST_REQUEST,
  MC_INSTALL_COMPONENT
} = MetaComponentConsts

import { TEMP_PROJECT_FOLDER } from '../constants/DecoPaths'
import { writeFile } from '../fs/safeWriter'

// TODO: Move the secrets out
const options = {
  root: 'https://api.github.com',
  client_id: '6d5bcbdda5b24161cfae',
  client_secret: 'bf39ebedd45660e137de57d40ed1280c87d1aad9',
  scopes: ["user", "repo"]
};

class GithubHandler {

  constructor(){
    this.authWindow = null

    this.store = new Store({
      configName: 'github',
      defaults: {
        token: null
      }
    });

    this.token = this.store.get('token')

  }

  // Register actions coming from the render process
  register(){
    bridge.on(GITHUB_AUTH_REQUESTED, this.githubAuthCheck.bind(this))
    bridge.on(MC_LIST_REQUEST, this.fetchComponentList.bind(this))
    bridge.on(MC_INSTALL_COMPONENT, this.installMetaComponent.bind(this))
  }

  // Check if token exists, if it works, test it or else go through the login process
  githubAuthCheck(){
    try{
      let githubToken = this.store.get('token')
      if(githubToken){
        this.testToken(githubToken)
      }else{
        this.perfromLogin()
      }
    }catch(err){
      bridge.send(githubAuthFailure(err))
    }
  }

  perfromLogin(){
    try{
      
      // Set up the auth window
      this.authWindow = new BrowserWindow({ 
        width: 800, 
        height: 600, 
        show: false, 
        'node-integration': false 
      });
      
      // Set up authorization uri uri 
      const githubUrl = 'https://github.com/login/oauth/authorize?';
      const authUrl = githubUrl + 'client_id=' + options.client_id + '&scope=' + options.scopes;

      // Show the window
      this.authWindow.loadURL(authUrl);
      this.authWindow.show();

      // Event listeners for after authorization
      this.authWindow.webContents.on('will-navigate', (event, url) => {
        this.handleCallback(event.url);
      });

      this.authWindow.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
        this.handleCallback(newUrl);
      });

      // Reset the authWindow on close
      this.authWindow.on('close', () => {
        this.authWindow = null;
      }, false);


    }catch(err){
      Logger.error(err)
    }
    
  }

  // see what the authorization process has sent
  handleCallback (url) {    
    try{
      
      // see if code parameter exists in the url
      const raw_code = /code=([^&]*)/.exec(url) || null;
      const code = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
      const error = /\?error=(.+)$/.exec(url);

      // Close the window if code found or error
      if (code || error) {
        this.authWindow.destroy();
      }

      // If there is a code, proceed to get token from github
      if (code) {
        this.requestGithubToken(code);
      } else if (error) {
        alert('Oops! Something went wrong and we couldn\'t' +
          'log you in using Github. Please try again.');
      }

    }catch(err) {
      Logger.error(err)
    }
    
  }


  requestGithubToken(code){
    try{

      // Access token request
      request
        .post('https://github.com/login/oauth/access_token')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          client_id: options.client_id,
          client_secret: options.client_secret,
          code
        })
        .then((res) => {
          let token = res.body.access_token

          // Save for future use
          this.store.set('token', token)

          // Test the token
          this.testToken(token)
        })
        .catch(err => {
          Logger.error(err)
        })
    }catch(err) {
      Logger.error(err)
    }
  }

  testToken(token){
    try{
      // Get the auth user
      // TODO Check if organization is codebrahma
      request
        .get('https://api.github.com/user')
        .set('Authorization', `token ${token}`)
        .end((err, res) => {
          // Send event back to the render process
          if(err){
            bridge.send(githubAuthFailure('Token not valid'))
            // Cause the token is of no use
            this.store.remove('token')
          }else{
            bridge.send(githubAuthSuccess(token, res.body))
            // Set it to the class so we have access for later requests
            this.token = token
          }
        })
    }catch(err){
      bridge.send(githubAuthFailure(err))
    }
  }


  // Get the list of components available in the repo on github
  fetchComponentList(){
    try{
      request
        // TODO change branch when merged with master      
        .get(`https://raw.githubusercontent.com/Codebrahma/edge-meta/new-structure/index.json`) 
        .set('Authorization', `token ${this.token}`)
        .end((err, res) => {
          if(err){
            bridge.send(componentListFailure(err))
            console.log('request error: ', err)
          }else{
            const json = JSON.parse(res.text)
            bridge.send(componentListSuccess(json.components))
          }
        })
    }catch(err){
      bridge.send(componentListFailure(err))      
      console.log('request error: ', err)
    }

  }

  // start the install process of a meta-component
  installMetaComponent(payload, respond){
    try{
      // Copy modules
      this.copyModules(payload.component, payload.path)
    }catch (err) {
      console.error(err)
    }
  }


  copyModules(component, path){
    try{
      // Component can have many modules
      component.modules.forEach(module => {
        const modulePath = `${path}/modules/${module}` 
        // if path exists, user has already installed this component before
        if(!fs.existsSync(modulePath)){
          // Create a folder for the module
          fs.mkdirSync(modulePath)
          // Find what the module folder contains and copy it to the local folder
          request
            .get(`https://api.github.com/repos/Codebrahma/edge-meta/contents/modules/${module}`)
            .set('Authorization', `token ${this.token}`)
            .query({ref: 'new-structure'})
            .end((err, res) => {
              if(err){
                console.error(err)
              }else{
                const contents = res.body
                // Assuming a flat structure, no dir inside module dir
                contents.forEach(item => {
                  if(item.type === 'file'){
                    request
                      .get(item.git_url)
                      .set('Authorization', `token ${this.token}`)
                      .end((err, res) => {
                        if(err){
                          console.log(err)
                        }else{
                          try{
                            const b64content = res.body.content
                            const content = new Buffer(b64content, 'base64')
                            
                            if(item.name === '.meta.json'){
                              const data = JSON.parse(content.toString())
                              if(data.dependencies && data.dependencies.length > 0){
                                // Install npm modules
                                this.installNodeModules(data.dependencies, path, (dep, path) => {
                                  if(data.native && data.native.includes(dep)){
                                    // Link native modules
                                    this.linkNativeModules(dep, path)
                                  }
                                })
                                
                              }
                            }else{
                              // Create the file
                              fs.writeFileSync(`${modulePath}/${item.name}`, content)
                            }
                          }catch(e){
                            console.log(e)
                          }
                        }
                      })
                  }
                })
              }
            })
        }
        
      })
    }catch(err){
      console.log(err)
    }
  }

  installNodeModules(dependencies, path, onFinish){
    dependencies.forEach(dep => {
      const progressCallback = _.throttle((percent) => {
        bridge.send(updateProgressBar(dep, percent * 100))
      }, 250)

      bridge.send(startProgressBar(dep, 0))

      try {
        const command = [ 'install', '-S', `${dep}`]

        Logger.info(`npm ${command.join(' ')}`)

        npm.run(command, {cwd: path}, (err) => {

          // Ensure a trailing throttled call doesn't fire
          progressCallback.cancel()

          bridge.send(endProgressBar(dep, 100))

          // Call on finish when the progress is 100%
          onFinish(dep, path)

          if (err) {
            Logger.info(`npm: dependency ${dep} failed to install`)
          } else {
            Logger.info(`npm: dependency ${dep} installed successfully`)
          }
        }, progressCallback)
      } catch(e) {
        Logger.error(e)
      }

    })
  }

  linkNativeModules(nativeDep, path){    
    try{
      cmd.get(`cd ${path} && react-native link ${nativeDep}`, (err, data, stderr) => {
        if(err){
          console.log('rn link err: ', err)
        }else{
          console.log('rn link:', data)
        }
      })
    }catch(e){
      console.error(e)
    }
  }
}
const handler = new GithubHandler()

export default handler