import React from 'react'
import GithubIcon from '../display/GithubIcon'

const container = {
  display: 'flex',
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center'
}

const button = {
  display: 'flex',
  flexDirection: 'row',
  padding: 10,
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#f3f3f3',
  border: '1px solid #aaa',
  width: 200
}

class GithubAuth extends React.Component {

  render(){
    return(
      <div style={container}>
        <button 
          style={button}
          onClick={() => this.props.onLoginRequested()}
        >
          <GithubIcon style={{margin: 10}}/>
          Login Via Github
        </button>
      </div>
    )
  }
}

export default GithubAuth