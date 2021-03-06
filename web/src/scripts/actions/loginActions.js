import { 
  GITHUB_AUTH_REQUESTED, 
  GITHUB_AUTH_SUCCESS, 
  GITHUB_AUTH_FAILURE 
} from 'shared/constants/ipc/GithubConstants'
import request from '../ipc/Request'


function _githubLoginRequest(){
  return {
    type: GITHUB_AUTH_REQUESTED, 
  }
}

export function githubLoginRequest() {
  return function(dispatch) {
    request(_githubLoginRequest())
  }
}

export function githubLoginSuccess(accessToken, user){
  return {
    type: GITHUB_AUTH_SUCCESS,
    accessToken,
    user
  }
}

export function githubLoginFailure(error){
  return {
    type: GITHUB_AUTH_FAILURE,
    error
  }
}