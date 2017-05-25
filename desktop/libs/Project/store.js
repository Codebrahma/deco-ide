import { combineReducers } from 'redux'
import home from './modules/Home/reducer'

const reducers = {
  home
}

export default combineReducers(reducers)