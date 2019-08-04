import { combineReducers } from 'redux'
import { Reducer as signup } from './signup'
import { Reducer as login } from './login'
import { Reducer as home } from './home'
import { Reducer as vendorProfile } from './vendorProfile'

const rootReducer = combineReducers({
  signup,
  login,
  home,
  vendorProfile
})

export default rootReducer
