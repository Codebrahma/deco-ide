import React, { Component, } from 'react'

export default class CBLogo extends Component {
  render() {
    return (
      <div style={Object.assign({
          backgroundImage: "url('images/cb-logo.png')",
          backgroundSize: '100%',
          width: '60px',
          height: '60px',
          overflow: 'hidden',
          borderRadius: '10px',
          margin: 5
        }, this.props.style)}/>
    )
  }
}