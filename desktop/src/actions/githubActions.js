const Logger = require('../log/logger')

import GithubConstants from 'shared/constants/ipc/GithubConstants'
const {
  GITHUB_AUTH_REQUESTED,
  GITHUB_AUTH_SUCCESS,
  GITHUB_AUTH_FAILED
} = GithubConstants


export const githubAuthSuccess = (accessToken) => {
  return {
    type: GITHUB_AUTH_SUCCESS,
    payload: {
      accessToken
    }
  }
}
