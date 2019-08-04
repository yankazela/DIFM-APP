import { put, call, takeLatest } from 'redux-saga/effects'
import axios from 'axios'
// import qs from 'qs'

export const REINITIALIZE = 'api/REINITIALIZE'
export const LOGIN = 'api/LOGIN'
export const LOGIN_SUCCESS = 'api/LOGIN_SUCCESS'
export const LOGIN_ERROR = 'api/LOGIN_ERROR'
export const UPDATE_DATA = 'api/UPDATE_DATA'

const SERVER_URL = typeof window !== 'undefined' ? '' : 'http://localhost:' + process.env.PORT

const loginUserData = (data) => {
  console.log('data', data)
  return axios.post(SERVER_URL + '/data/login', data)
    .then(response => {
      return response.data
    })
    .catch(err => {
      console.error(err)
      throw err
    })
}

function * setLoginSaga ({ data }) {
  try {
    let result = yield call(loginUserData, data)
    if (result.token) {
      yield put({ type: LOGIN_SUCCESS, payload: result })
    } else {
      yield put({ type: LOGIN_ERROR, payload: { message: 'Incorrect username/password provided.' } })
    }
  } catch (e) {
    console.error('ERROR while submitting', e.message)
    yield put({ type: LOGIN_ERROR, payload: { message: e.message } })
  }
}

export function * watchLoginUser () {
  yield takeLatest(LOGIN, setLoginSaga)
}
export const updateForm = (data) => ({ 'type': UPDATE_DATA, payload: data })
export const submitData = (data) => ({ 'type': LOGIN, data })
const defaultState = {
  login: '',
  password: '',
  userType: ''
}

export const Reducer = (state = defaultState, { type, payload }) => {
  switch (type) {
    case UPDATE_DATA:
      return Object.assign({}, state, payload)
    case LOGIN:
      return Object.assign({}, state, {
        isSubmitting: true,
        hasSubmitted: false,
        hasError: false
      })
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isSubmitting: false,
        hasSubmitted: true,
        hasError: false,
        content: payload
      })
    case LOGIN_ERROR:
      return Object.assign({}, state, {
        isSubmitting: false,
        hasSubmitted: false,
        hasError: true,
        errorMessage: payload.message,
        field: payload.field
      })
    default:
      return state
  }
}
