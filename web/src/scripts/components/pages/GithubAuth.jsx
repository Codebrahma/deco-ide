import React from 'react'
import GithubIcon from '../display/GithubIcon'


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

  }

  requestGithubToken(code){

    this.setState({
      status: 'Getting Access Token'
    })

  }


  render(){

    return(
      <div style={{ flex: 1 }}>
        <button onClick={() => this.props.onLoginRequested()}>
          <GithubIcon />
          Login Via Github
        </button>
      </div>
    )
  }
}

export default GithubAuth