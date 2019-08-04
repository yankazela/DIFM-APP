import App from './components/App'
import BrowserRouter from 'react-router-dom/BrowserRouter'
import React from 'react'
import { Provider } from 'react-redux'
import { hydrate } from 'react-dom'
import configureStore from './store/configureStore'
import rootSaga from './store/rootSaga'

// Grab the state from a global variable injected into the server-generated HTML
const preloadedState = window.__PRELOADED_STATE__

// Allow the passed state to be garbage-collected
delete window.__PRELOADED_STATE__

// Create Redux store with initial state
const store = configureStore(preloadedState)
store.runSaga(rootSaga)

hydrate(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
)

if (module.hot) {
  module.hot.accept()
}
