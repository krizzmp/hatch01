import * as React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import Home from 'src/components/HomeComponent'
import { ToolBar } from 'src/components/ToolbarComponent'
import App from 'src/components/DocumentComponent'
import Auth from 'src/components/AuthComponent'
import 'src/styles/index.css'
import { BrowserRouter, Route } from 'react-router-dom'
// const {whyDidYouUpdate} = require('why-did-you-update')
// whyDidYouUpdate(React)

import store from './state/reducers'

const Root = () => (
  <Provider store={store}>
    <BrowserRouter>
      <React.Fragment>
        <ToolBar/>
        <Auth>
          <Route path="/:id" component={App}/>
          <Route exact={true} path="/" component={Home}/>
        </Auth>
      </React.Fragment>
    </BrowserRouter>
  </Provider>
)

render(
  <Root/>,
  document.getElementById('root') as HTMLElement
)
