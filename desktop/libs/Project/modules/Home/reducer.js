import { 
  CHANGE_BACKGROUND
} from './actions'

const initialState = {
  backgroundColor: '#f1f1f1'
}

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case CHANGE_BACKGROUND: {
      return Object.assign({}, state, {
        backgroundColor: action.color
      })
    }
    default: {
      return state      
    }
  }
}

export default reducer