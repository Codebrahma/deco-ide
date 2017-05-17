import React, { Component, } from 'react'

export default class EdgeLogo extends Component {
  render() {
    return (
      <div style={{
          backgroundImage: 'url(images/edge-logo.png)',
          backgroundSize: 'cover',
          width: '170px',
          height: '42px',
        }}/>
    )
  }
}
