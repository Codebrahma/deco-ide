import GithubConstants from 'shared/constants/ipc/GithubConstants'
const {
  GITHUB_AUTH_REQUESTED,
  GITHUB_AUTH_SUCCESS,
  GITHUB_AUTH_FAILURE
} = GithubConstants


export const githubAuthSuccess = (accessToken, user) => {
  return {
    type: GITHUB_AUTH_SUCCESS,
    accessToken,
    user
  }
}

export const githubAuthFailure = (error) => {
  return {
    type: GITHUB_AUTH_FAILURE,
    error
  }
}