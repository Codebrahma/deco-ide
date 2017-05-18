'use strict'
import { dialog, BrowserWindow } from 'electron'
import request from 'superagent'
import GithubConsts from 'shared/constants/ipc/GithubConstants'
import bridge from '../bridge'
import Logger from '../log/logger'
import { githubAuthSuccess } from '../actions/githubActions'
import Store from '../Utils/Store'

const { 
  GITHUB_AUTH_REQUESTED,
  GITHUB_AUTH_SUCCESS,
  GITHUB_AUTH_FAILURE 
} = GithubConsts


const options = {
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

  }

  register(){
    bridge.on(GITHUB_AUTH_REQUESTED, this.checkLogin.bind(this))
  }

  checkLogin(){
    try{
      let githubToken = this.store.get('token')
      console.log(githubToken)
      if(githubToken){
        console.log('token found')
        bridge.send(githubAuthSuccess(githubToken))
      }else{
        this.perfromLogin()
      }
    }catch(err){
      console.log(err)
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
      
      const githubUrl = 'https://github.com/login/oauth/authorize?';
      const authUrl = githubUrl + 'client_id=' + options.client_id + '&scope=' + options.scopes;
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


  handleCallback (url) {    
    try{
    
      const raw_code = /code=([^&]*)/.exec(url) || null;
      const code = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
      const error = /\?error=(.+)$/.exec(url);

      if (code || error) {
        // Close the browser if code found or error
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
          this.store.set('token', token)
          bridge.send(githubAuthSuccess(token))
        })
        .catch(err => {
          Logger.error(err)
        })
    }catch(err) {
      Logger.error(err)      
    }
  }


}
const handler = new GithubHandler()

export default handler