import React, { Component } from 'react'
import { connect } from 'react-redux'
import Layout from './Layout'
import LoginForm from './LoginForm'

const LoginPage = () => {
  return <Layout className="LoginPage">
    <h1>Login</h1>
    <LoginForm />
  </Layout>
}

export default (LoginPage)
