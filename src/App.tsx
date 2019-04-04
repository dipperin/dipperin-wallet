import './App.css'

import { createBrowserHistory, createMemoryHistory, History, MemoryHistory } from 'history'
import { Provider } from 'mobx-react'
import { configure } from 'mobx'
import DevTools, { configureDevtool } from 'mobx-react-devtools'
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router'
import React from 'react'
import { I18nextProvider } from 'react-i18next'
import { Route, Router } from 'react-router-dom'

import { CssBaseline } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/styles'

import i18n from './i18n'
import Routes from './routes'
import RootStore from './stores/root'
import theme from './theme'
import { injectConsole } from './utils/ipc'

// Inject Electron Console in Production env
injectConsole()

// Configure mobx
configure({
  enforceActions: 'observed'
})

// Configure Devtool
if (process.env.REACT_APP_ENV === 'development') {
  configureDevtool({
    logEnabled: false,
    updatesEnabled: false,
    logFilter: change => ['reaction', 'action', 'when'].some(type => type === change.type)
  })
}

let history: History<any> | MemoryHistory<any>
if (process.env.REACT_APP_ENV === 'development' && !process.env.IS_RENDERER) {
  // Use browser history in development
  history = createBrowserHistory()
} else {
  history = createMemoryHistory()
}

const routingStore = new RouterStore()

const historyStore = syncHistoryWithStore(history, routingStore)

const rootStore = new RootStore()

class App extends React.Component {
  public render() {
    return (
      <Provider {...rootStore} root={rootStore}>
        <I18nextProvider i18n={i18n}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router history={historyStore}>
              <Route component={Routes} />
            </Router>
            {process.env.REACT_APP_ENV === 'development' && <DevTools />}
          </ThemeProvider>
        </I18nextProvider>
      </Provider>
    )
  }
}

export default App
