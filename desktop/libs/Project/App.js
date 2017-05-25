import React from 'react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { StackNavigator } from 'react-navigation';
import Home from './modules/Home'
import appStore from './store'

let store = createStore(appStore)


const Router = StackNavigator({
  Home: { screen: Home },
});

const App = () => {
  return(
    <Provider store={store}>
      <Router />
    </Provider>
  )
}

export default App