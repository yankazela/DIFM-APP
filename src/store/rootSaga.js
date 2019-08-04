import { all } from 'redux-saga/effects'
import { watchNewUser } from '../reducers/signup'
import { watchLoginUser } from '../reducers/login'
import { watchGetPro } from '../reducers/home'
import { watchGetVendor } from '../reducers/vendorProfile'
export default function * rootSaga () {
  yield all([
    watchNewUser(),
    watchLoginUser(),
    watchGetPro(),
    watchGetVendor()
  ])
}
