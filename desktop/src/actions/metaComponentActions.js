import MetaComponentConsts from 'shared/constants/ipc/MetaComponentConstants'

const {
  MC_LIST_REQUEST,
  MC_LIST_SUCCESS,
  MC_LIST_FAILURE
} = MetaComponentConsts


export const componentListSuccess = (list) => {
  return {
    type: MC_LIST_SUCCESS,
    list
  }
}

export const componentListFailure = (error) => {
  return {
    type: MC_LIST_FAILURE,
    error
  }
}