import { put, call, takeLatest } from 'redux-saga/effects'
import axios from 'axios'
// import qs from 'qs'

export const REINITIALIZE = 'api/REINITIALIZE'
export const FETCH_VENDOR = 'api/FETCH_VENDOR'
export const FETCH_VENDOR_SUCCESS = 'api/FETCH_VENDOR_SUCCESS'
export const FETCH_VENDOR_ERROR = 'api/FETCH_VENDOR_ERROR'
export const UPDATE_DATA = 'api/UPDATE_DATA'

const SERVER_URL = typeof window !== 'undefined' ? '' : 'http://localhost:' + process.env.PORT

const collectVendorData = (login) => {
  const newData = { login }
  console.log('data', newData)
  return axios.post(SERVER_URL + '/data/fetch-full-vendor', newData)
    .then(response => {
      return response.data
    })
    .catch(err => {
      console.error(err)
      throw err
    })
}

function * getVendorDataSaga (login) {
  try {
    let result = yield call(collectVendorData, login)
    yield put({ type: FETCH_VENDOR_SUCCESS, payload: result })
  } catch (e) {
    console.error('ERROR while fetching:', e.message)
    yield put({ type: FETCH_VENDOR_ERROR, payload: { message: e.message } })
  }
}


export function * watchGetVendor () {
  yield takeLatest(FETCH_VENDOR, getVendorDataSaga)
}
export const updateForm = (data) => ({ 'type': UPDATE_DATA, payload: data })
export const getVendorData = (login) => ({ 'type': FETCH_VENDOR, login })
const defaultState = {}

export const Reducer = (state = defaultState, { type, payload }) => {
  switch (type) {
    case UPDATE_DATA:
      return Object.assign({}, state, payload)
    case FETCH_VENDOR:
      return Object.assign({}, state, {
        isFetching: true,
        hasFetched: false,
        hasError: false
      })
    case FETCH_VENDOR_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        hasFetched: true,
        hasError: false,
        content: payload
      })
    case FETCH_VENDOR_ERROR:
      return Object.assign({}, state, {
        isFetching: false,
        hasFetched: false,
        hasError: true,
        errorMessage: payload.message,
      })
    default:
      return state
  }
}
