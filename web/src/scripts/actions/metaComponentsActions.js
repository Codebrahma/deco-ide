import { 
  MC_LIST_REQUEST, 
  MC_LIST_SUCCESS, 
  MC_LIST_FAILURE,
  MC_INSTALL_COMPONENT
} from 'shared/constants/ipc/MetaComponentConstants'
import request from '../ipc/Request'


function _fetchListRequest(){
  return {
    type:  MC_LIST_REQUEST 
  }
}

export function fetchMetaComponentList() {
  return function(dispatch) {
    request(_fetchListRequest())
  }
}

export function componentListSuccess(components){
  return {
    type: MC_LIST_SUCCESS,
    components
  }
}

export function componentListFailed(error){
  return {
    type: MC_LIST_FAILURE,
    error
  }
}

export function installComponent(component){
  return function(dispatch){
    request({
      type: MC_INSTALL_COMPONENT,
      component
    })
  }
}