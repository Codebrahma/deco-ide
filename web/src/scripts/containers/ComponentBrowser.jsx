/**
 *    Copyright (C) 2015 Deco Software Inc.
 *
 *    This program is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU Affero General Public License, version 3,
 *    as published by the Free Software Foundation.
 *
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU Affero General Public License for more details.
 *
 *    You should have received a copy of the GNU Affero General Public License
 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import React, { Component, PropTypes, } from 'react'
import { connect } from 'react-redux'
import { getRootPath } from '../utils/PathUtils'
import ComponentList from '../components/menu/ComponentList'
import { 
  fetchMetaComponentList, 
  installComponent 
} from '../actions/metaComponentsActions'

const styles = {
  main: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    overflow: 'hidden',
  }
}

class ComponentBrowser extends Component {

  componentDidMount(){
    this.props.fetchComponentList()
  }

  handleComponentInstallRequest(component){    
    // Getting the project path
    const path = getRootPath(this.props)

    this.props.installComponent(component, path)

  }

  render() {
    return (
      <div style={styles.main}>
        <ComponentList 
          components={this.props.components}
          onInstallClicked={(component) => this.handleComponentInstallRequest(component)}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  components: state.components,
  routing: state.routing
})

const mapDispatchToProps = (dispatch) => ({
  fetchComponentList: () => {dispatch(fetchMetaComponentList())},
  installComponent: (component, path) => {dispatch(installComponent(component, path))}
})

export default connect(mapStateToProps, mapDispatchToProps)(ComponentBrowser)
