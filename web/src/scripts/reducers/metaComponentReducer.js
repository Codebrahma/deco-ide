import MetaComponentConsts from 'shared/constants/ipc/MetaComponentConstants'


const {
  MC_LIST_REQUEST,
  MC_LIST_SUCCESS,
  MC_LIST_FAILURE
} = MetaComponentConsts

const initialState = {
  isLoading: false,
  list: [],
  error: null
}


const metaComponentReducer = (state = initialState, action) => {
  switch(action.type){
    case MC_LIST_REQUEST: {
      return Object.assign({}, state, {
        isLoading: true,
        error: null
      })
    }
      
    case MC_LIST_SUCCESS: {
      return Object.assign({}, state, {
        isLoading: false,
        list: action.components
      })
    }
    
    case MC_LIST_FAILURE: {
      return Object.assign({}, state, {
        error: action.error,
        isLoading: false 
      })
    }
    default:
      return state
    break
  }
}

export default metaComponentReducer