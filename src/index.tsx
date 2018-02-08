import * as React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './components/App'
import './styles/index.css'

// const {whyDidYouUpdate} = require('why-did-you-update')
// whyDidYouUpdate(React)

import store from './reducers'

const Root = () => (
  <Provider store={store}>
    <App/>
  </Provider>
)

render(
  <Root/>,
  document.getElementById('root') as HTMLElement
)
