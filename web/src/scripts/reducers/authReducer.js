const initialState = {
  isAuth: false,
  authenticating: false,
  user: null,
  token: null,
  accessToken: null
}


const authReducer = (state = initialState, action) => {
  switch(action.type){
    default:
      return state
    break
  }
}

export default authReducer