import React, { Component } from 'react'
import Link from './components/Link'
import NotFound from './components/NotFound'
import Homepage from './components/Homepage'

class App extends Component {
  render() {
    // this.props
    return <div>
      <h1>App</h1>
      <ol>
        <li>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </li>
      </ol>
      {this.props.children}
    </div>
  }
}
const Dashboard = (props) => {
  return <div>
    <h1>Dashboard</h1>
    {props.children}
  </div>
}
const About = (props) => {
  return <div>
    <h1>About</h1>
    {props.children}
  </div>
}
const Inbox = (props) => {
  return <div>
    <h1>Inbox</h1>
    {props.children}
  </div>
}
const Message = (props) => {
  return <div>
    <h1>Message</h1>
    {props.children}
  </div>
}


export default {
  path: '/',
  component: App,
  indexRoute: {
    component: Homepage
  },
  childRoutes: [
    {
      path: 'about',
      component: About
    },
    {
      path: 'inbox',
      component: Inbox,
      childRoutes: [{
        path: 'messages/:id',
        onEnter: ({ params }, replace) => replace(`/messages/${params.id}`)
      }]
    },
    {
      component: Inbox,
      childRoutes: [{
        path: 'messages/:id', component: Message
      }]
    },
    {
      path: '**',
      component: NotFound,
    }
  ]
}
