import React, { Component } from 'react'
import Router from './Router'
import createStoreProvider from './components/createStoreProvider'
import sessionStore from './stores/sessionStore'

export default createStoreProvider({
  as: 'session',
  store: sessionStore,
  render: Router,
})
