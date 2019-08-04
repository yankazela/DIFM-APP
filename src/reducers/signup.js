import { put, call, takeLatest } from 'redux-saga/effects'
import axios from 'axios'
// import qs from 'qs'

export const REINITIALIZE = 'api/REINITIALIZE'
export const SUBMIT = 'api/SUBMIT'
export const SUBMIT_SUCCESS = 'api/SUBMIT_SUCCESS'
export const SUBMIT_ERROR = 'api/SUBMIT_ERROR'
export const UPDATE_DATA = 'api/UPDATE_DATA'

const SERVER_URL = typeof window !== 'undefined' ? '' : 'http://localhost:' + process.env.PORT

const sendUserData = (data) => {
  console.log('data', data)
  return axios.post(SERVER_URL + '/data/user/submit', data)
    .then(response => {
      console.log('result', response.data)
      return response.data.result
    })
    .catch(err => {
      console.error(err)
      throw err
    })
}

function * setNewUserSaga ({ data }) {
  try {
    let result = yield call(sendUserData, data)
    if (result.status === 'success') {
      yield put({ type: SUBMIT_SUCCESS, payload: result })
    } else if (result.message === 'duplicate user') {
      yield put({ type: SUBMIT_ERROR, payload: { message: 'The provided login is already selected by another user.', field: 'login' } })
    } else {
      yield put({ type: SUBMIT_ERROR, payload: { message: 'Error while saving your details, please try again.' } })
    }
  } catch (e) {
    console.error('ERROR while submitting', e.message)
    yield put({ type: SUBMIT_ERROR, payload: { message: e.message } })
  }
}

export function * watchNewUser () {
  yield takeLatest(SUBMIT, setNewUserSaga)
}
export const updateForm = (data) => ({ 'type': UPDATE_DATA, payload: data })
export const submitData = (data) => ({ 'type': SUBMIT, data })
export const reinitialise = (data) => ({ 'type': REINITIALIZE, data })
const defaultState = {
  login: '',
  password: '',
  firstname: '',
  surname: '',
  email: '',
  telephone: '',
  dateOfBirth: ''
}

export const Reducer = (state = defaultState, { type, payload }) => {
  switch (type) {
    case UPDATE_DATA:
      return Object.assign({}, state, payload)
    case REINITIALIZE:
      return Object.assign({}, state, {
        character: '0.00'
      })
    case SUBMIT:
      return Object.assign({}, state, {
        isSubmitting: true,
        hasSubmitted: false,
        hasError: false
      })
    case SUBMIT_SUCCESS:
      return Object.assign({}, state, {
        isSubmitting: false,
        hasSubmitted: true,
        hasError: false,
        content: payload
      })
    case SUBMIT_ERROR:
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
