import React from 'react'
import GithubIcon from '../display/GithubIcon'

const BrowserWindow = Electron.remote.BrowserWindow

const options = {
  client_id: '6d5bcbdda5b24161cfae',
  client_secret: 'bf39ebedd45660e137de57d40ed1280c87d1aad9',
  scopes: ["user", "repo"]
};


class GithubAuth extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      gettingToken: false
    }

    this.authWindow = null

  }

  componentDidMount(){

    this.authWindow = new BrowserWindow({ width: 800, height: 600, show: false, 'node-integration': false });
    const githubUrl = 'https://github.com/login/oauth/authorize?';
    var authUrl = githubUrl + 'client_id=' + options.client_id + '&scope=' + options.scopes;
    this.authWindow.loadURL(authUrl);
    this.authWindow.show();


    this.authWindow.webContents.on('will-navigate', ({url}) => {
      this.handleCallback(url);
    });

    this.authWindow.webContents.on('did-get-redirect-request', ({url}) => {
      this.handleCallback(url);
    });

    this.authWindow.on('close', () => {
      this.authWindow = null;
    }, false);

  }

  handleCallback(url){
    // Check if 'code' is there in the url
    var raw_code = /code=([^&]*)/.exec(url) || null;
    var code = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
    var error = /\?error=(.+)$/.exec(url);

    if (code || error) {
      // Close the browser if code found or error

      this.setState({
        gettingToken: true
      })
      
      this.authWindow.destroy()

    }

    // If there is a code, proceed to get token from github
    if (code) {
      console.log(code)
      this.requestGithubToken(code);
    } else if (error) {
      alert('Oops! Something went wrong and we couldn\'t' +
        'log you in using Github. Please try again.');
    }
  }

  requestGithubToken(code){

    const options  = {
      headers: {
        'Accept': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({
        client_id: options.client_id,
        client_secret: options.client_secret,
        code
      })
    }

    fetch('https://github.com/login/oauth/access_token', options)
      .then(result => {
        console.log(result)
      })
      .catch(err => {
        console.log('error', err)
      })

  }


  render(){
    return(
      <div style={{ flex: 1 }}>
        <p style={{ textAlign: 'center' }}>Fetching auth token...</p>
      </div>
    )
  }
}

export default GithubAuth