import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../reducers/rootReducers'
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware, { END } from 'redux-saga'

export const sagaMiddleware = createSagaMiddleware({
  // To enable Saga Monitoring, uncomment the following
  // sagaMonitor: createSagaMonitor(config)
})

const configureStore = preloadedState => {
  const store = createStore(
    rootReducer,
    preloadedState,
    composeWithDevTools(applyMiddleware(thunk, sagaMiddleware))
  )

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept(rootReducer, () => {
      const nextRootReducer = require(rootReducer).default
      store.replaceReducer(nextRootReducer)
    })
  }

  store.runSaga = sagaMiddleware.run

  store.close = () => store.dispatch(END)

  return store
}

export default configureStore
