import GithubConsts from 'shared/constants/ipc/GithubConstants'


const {
  GITHUB_AUTH_REQUESTED,
  GITHUB_AUTH_SUCCESS,
  GITHUB_AUTH_FAILURE
} = GithubConsts

const initialState = {
  isAuth: false,
  isLoading: false,
  accessToken: null,
  error: null,
  user: null
}


const authReducer = (state = initialState, action) => {
  switch(action.type){
    case GITHUB_AUTH_REQUESTED: {
      return Object.assign({}, state, {
        isLoading: true,
        error: null
      })
    }
      
    case GITHUB_AUTH_SUCCESS: {
      return Object.assign({}, state, {
        isAuth: true,
        accessToken: action.accessToken,
        user: action.user,
        error: null,
        isLoading: false
      })
    }
    
    case GITHUB_AUTH_FAILURE: {
      return Object.assign({}, state, {
        isAuth: false,
        error: action.error,
        isLoading: false 
      })
    }
    default:
      return state
    break
  }
}

export default authReducer