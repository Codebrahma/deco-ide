import React from 'react'
import GithubIcon from '../display/GithubIcon'


const style = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  backgroundColor: "#ffffff",
  display: 'flex',
  flexDirection: 'column',
  WebkitAppRegion: 'drag',
}

const webview = {
  height: 500
}

const button = {
  display: 'flex',
  width: 200,
  padding: 10,
  cursor: 'pointer',
  backgroundColor: '#f1f1f1',
  alignItems: 'center',
  justifyContent: 'space-around'
}

const githubOptions = {
  githubLoginUrl: "https://github.com/", //login/oauth/authorize?client_id=6d5bcbdda5b24161cfae&scope=repo",
  client_id: '6d5bcbdda5b24161cfae',
  client_secret: 'bf39ebedd45660e137de57d40ed1280c87d1aad9',
  scopes: ["repo"] // Scopes limit access for OAuth tokens.
};


class GithubAuth extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      authenticating: false,
      isAuthenticated: false,
      displayWebview: false
    }
  }

  componentDidMount(){
    this.authView.addEventListener('did-navigate', (e) => {
      console.log(e)
      this.handleCallback(e.url);
    })
  }

  handleCallback(url){
    cosnole.log(url)
    // Check if 'code' is there in the url
    var raw_code = /code=([^&]*)/.exec(url) || null;
    var code = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
    var error = /\?error=(.+)$/.exec(url);

    if (code || error) {
      // Close the browser if code found or error

      this.setState({
        displayWebview: false
      })

    }

    // If there is a code, proceed to get token from github
    if (code) {
      console.log(code)
      // this.requestGithubToken(code);
    } else if (error) {
      alert('Oops! Something went wrong and we couldn\'t' +
        'log you in using Github. Please try again.');
    }
  }

  requestGithubToken(code){

    const option  = {
      headers: {
        'Accept': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({
        client_id: githubOptions.client_id,
        client_secret: githubOptions.client_secret,
        code,
      })
    }


    fetch('https://github.com/login/oauth/access_token', options)
      .then(result => {
        console.log(result.json())
      })

  }

  handleLoginClick(){
    this.setState({ 
      displayWebview: true,
      authenticating: true 
    }, () => {
      this.authView.addEventListener('did-navigate', (e) => {
        this.handleCallback(e.url);
      })
    })
  }


  render(){

    return(
      <div className="vbox helvetica-smooth" style={style}>
        <webview 
          src={githubOptions.url}
          style={webview}
          ref={(elem) => this.authView = elem}
        />
      </div>
    )
  }
}

export default GithubAuth