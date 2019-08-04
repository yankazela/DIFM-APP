import { put, call, takeLatest } from 'redux-saga/effects'
import axios from 'axios'
// import qs from 'qs'

export const REINITIALIZE = 'api/REINITIALIZE'
export const FETCH_PRO = 'api/FETCH_PRO'
export const FETCH_PRO_SUCCESS = 'api/FETCH_PRO_SUCCESS'
export const FETCH_PRO_ERROR = 'api/FETCH_PRO_ERROR'
export const UPDATE_DATA = 'api/UPDATE_DATA'

const SERVER_URL = typeof window !== 'undefined' ? '' : 'http://localhost:' + process.env.PORT

const collectProData = (data, coordinates) => {
  const newData = {
    proName: data.proName,
    proId: data.proId,
    city: data.city,
    address: data.address,
    description: data.description,
    latitude: coordinates.Latitude,
    longitude: coordinates.Longitude
  }
  console.log('data', newData)
  return axios.post(SERVER_URL + '/data/getpro', newData)
    .then(response => {
      return response.data
    })
    .catch(err => {
      console.error(err)
      throw err
    })
}

const getGeoCodes = (address) => {
  address = address.replace(/\s/g, '+')
  let url = `${process.env.RAZZLE_GOOGLE_GEOCODEURL}?app_id=${process.env.RAZZLE_GOOGLE_APPID}&app_code=${process.env.RAZZLE_GOOGLE_APPCODE}&searchtext=${address}`
  return axios.get(url)
    .then(result => {
      return result.data.Response.View[0].Result[0].Location.DisplayPosition
    })
    .catch(error => {
      console.error('geocodes', error.message)
      return error
    })
}

function * getProDataSaga ({ data }) {
  try {
    const coordinates = yield call(getGeoCodes, data.address) 
    let result = yield call(collectProData, data, coordinates)
    yield put({ type: FETCH_PRO_SUCCESS, payload: result })
  } catch (e) {
    console.error('ERROR while submitting:', e.message)
    yield put({ type: FETCH_PRO_ERROR, payload: { message: e.message } })
  }
}


export function * watchGetPro () {
  yield takeLatest(FETCH_PRO, getProDataSaga)
}
export const updateForm = (data) => ({ 'type': UPDATE_DATA, payload: data })
export const getProData = (data) => ({ 'type': FETCH_PRO, data })
const defaultState = {
  proName: '',
  proId: null,
  address: '',
  description: '',
  city: '',
  coordinates: {}
}

export const Reducer = (state = defaultState, { type, payload }) => {
  switch (type) {
    case UPDATE_DATA:
      return Object.assign({}, state, payload)
    case FETCH_PRO:
      return Object.assign({}, state, {
        isSubmitting: true,
        hasSubmitted: false,
        hasError: false
      })
    case FETCH_PRO_SUCCESS:
      return Object.assign({}, state, {
        isSubmitting: false,
        hasSubmitted: true,
        hasError: false,
        content: payload
      })
    case FETCH_PRO_ERROR:
      return Object.assign({}, state, {
        isSubmitting: false,
        hasSubmitted: false,
        hasError: true,
        errorMessage: payload.message,
      })
    default:
      return state
  }
}
