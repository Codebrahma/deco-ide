import React, { Component } from 'react'


const styles = {
  item: {
    display: 'flex',
    padding: 10,
    flexDirection: 'column',
    borderBottom: '1px #F6F6F6 solid'
  },
  name: {
    fontSize: 15
  },
  description: {
    fontSize: 13,
    color: '#666',
    margin: 0
  },
  button: {
    backgroundColor: '#f4f4f4',
    border: 'steelblue 1px solid',
    borderRadius: 3,
    width: 100,
    alignSelf: 'flex-end'
  }
}

class ComponentList extends Component {
  render(){
    const { list, isLoading } = this.props.components

    return(
      <div>
        {isLoading ? <p>Loading..</p> : (
          <div>
            {list.map((component, i) => {
              return(
                <div key={i} style={styles.item}>
                  <span style={styles.name}>
                    {component.name}
                  </span>
                  <p style={styles.description}>
                    {component.description}
                  </p>
                  <button 
                    style={styles.button}
                    onClick={() => this.props.onInstallClicked(component)}
                  >
                    Install
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }
}

export default ComponentList