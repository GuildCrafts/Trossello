import React, { Component } from 'react'
import { connect } from 'react-redux'
import Layout from './Layout'

const HomePage = ({auth}) => {
  return <Layout className="HomePage">
    <h1>Homepage</h1>
    <h3>We have no idea if you're logged in or not</h3>
    <pre>{JSON.stringify(auth, null, 4)}</pre>
  </Layout>
}



const mapStateToProps = (state) => ({
  auth: state.auth
})

export default connect(mapStateToProps)(HomePage)
