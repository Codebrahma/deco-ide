import React, { Component } from 'react'


const styles = {
  item: {
    display: 'flex',
    padding: 5,
    flexDirection: 'row',
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
    alignSelf: 'center'
  }
}

class ComponentList extends Component {
  render(){
    const { list, isLoading } = this.props.components

    return(
      <div>
        {isLoading ? <p>Loading..</p> : (
          <div className="vbox">
            {list.map((component, i) => {
              return(
                <div key={i} style={styles.item}>
                  <div style={{ flex: 1 }}>
                    <span style={styles.name}>
                      {component.name}
                    </span>
                    <p style={styles.description}>
                      {component.description}
                    </p>
                  </div>
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