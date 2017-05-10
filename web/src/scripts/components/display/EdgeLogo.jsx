import React, { Component, } from 'react'

export default class EdgeLogo extends Component {
  render() {
    return (
      <div style={{
          backgroundImage: 'url(images/edge-logo.png)',
          backgroundSize: 'cover',
          width: '214px',
          height: '54px',
        }}/>
    )
  }
}
