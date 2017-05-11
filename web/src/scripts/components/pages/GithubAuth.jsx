import React from 'react'
import GithubIcon from '../display/GithubIcon'
var querystring = require('querystring');
var https = require("https");
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
      status: 'Checking auth'
    }

    this.authWindow = null

  }

  componentDidMount(){

    this.authWindow = new BrowserWindow({ 
      width: 500, 
      height: 500, 
      show: false,
      modal: true,
      'node-integration': false 
    });
    const githubUrl = 'https://github.com/login/oauth/authorize?';
    var authUrl = githubUrl + 'client_id=' + options.client_id + '&scope=' + options.scopes;
    this.authWindow.loadURL(authUrl);
    this.authWindow.show();
    
    this.setState({
      status: 'Waiting for Authorization'
    })


    this.authWindow.webContents.on('will-navigate', (e) => {
      this.handleCallback(e.url);
    });

    this.authWindow.webContents.on('did-get-redirect-request', (e, oldUrl, newURL) => {
      this.handleCallback(newURL);
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

    this.setState({
      status: 'Getting Access Token'
    })

    var postData = querystring.stringify({
      "client_id" : options.client_id,
      "client_secret" : options.client_secret,
      "code" : code
    });
      
    var post = {
      host: "github.com",
      path: "/login/oauth/access_token",
      method: "POST",
      headers: 
        { 
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': postData.length,
            "Accept": "application/json"
        }
    };


    var req = https.request(post, function(response){
      var result = '';
      response.on('data', function(data) {
        result = result + data;
      });
      response.on('end', function () {
            var json = JSON.parse(result.toString());
            console.log("access token recieved: " + json.access_token);
            if (response && response.ok) {
                // Success - Received Token.
                // Store it in localStorage maybe?
                console.log(response.body.access_token);
            }
        });
      response.on('error', function (err) {
            console.log("GITHUB OAUTH REQUEST ERROR: " + err.message);
        });
    });
    
    req.write(postData);
    req.end();


  }


  render(){
    return(
      <div style={{ flex: 1 }}>
        <p style={{ textAlign: 'center' }}>{this.state.status}</p>
      </div>
    )
  }
}

export default GithubAuth