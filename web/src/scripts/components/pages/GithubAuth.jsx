import React from 'react'
import GithubIcon from '../display/GithubIcon'

const githubOptions = {
  url: "https://github.com/login/oauth/authorize?client_id=6d5bcbdda5b24161cfae&scope=repo&allow_signup=false",
  client_id: '6d5bcbdda5b24161cfae',
  client_secret: 'bf39ebedd45660e137de57d40ed1280c87d1aad9'
};


class GithubAuth extends React.Component {
  constructor(props){
    super(props)
    this.authView = null

    this.state = {
      gettingToken: false
    }

  }

  componentDidMount(){
    this.authView.addEventListener('did-navigate', (e) => {
      this.handleCallback(e.url);
    })
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
        client_id: githubOptions.client_id,
        client_secret: githubOptions.client_secret,
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
        {this.state.gettingToken ? (
          <p style={{ textAlign: 'center' }}>Fetching auth token...</p>
        ) : (
          <webview 
            src={githubOptions.url}
            style={{ height: 300 }}
            ref={(elem) => this.authView = elem}
          />
        )}
      </div>
    )
  }
}

export default GithubAuth