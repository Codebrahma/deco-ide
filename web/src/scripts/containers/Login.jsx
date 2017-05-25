import React, { Component } from 'react'
import { connect } from 'react-redux'
import { resizeWindow } from '../actions/uiActions'
import GithubAuth from '../components/pages/GithubAuth'


class Login extends Component {

  componentWillMount() {
    this.props.dispatch(resizeWindow({
      width: 640,
      height: 500,
      center: true,
    }))
  }

  render(){
    return(
      <div>
        <h2 style={{ textAlign: 'center' }}>Welcome to Edge Native IDE</h2>
        <GithubAuth />
      </div>
    ) 
  }
}

export default connect()(Login)