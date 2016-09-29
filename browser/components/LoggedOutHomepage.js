import React, { Component } from 'react'
import Layout from './Layout'
import './LoggedOutHomepage.sass'


class LoggedOutHomepage extends Component {
  constructor(props){
    super(props)
    this.state = {
      opaque: false,
    }
    this.onScroll = this.onScroll.bind(this)
  }

  componentDidMount(){
    this.refs.container.addEventListener("scroll", this.onScroll);
  }

  componentWillUnmount(){
    this.refs.container.removeEventListener("scroll", this.onScroll);
  }

  onScroll(event){
    const scrollCutoff = 120;
    const scrollTop = this.refs.container.scrollTop
    this.setState({
      opaque: scrollTop >= scrollCutoff
    })
  }

  render(){
    return <div ref="container" className="Page LoggedOutHomepage">
      <LoggedOutHomepageNavbar opaque={this.state.opaque} />
      <SectionOne />
      <SectionTwo />
    </div>
  }
}


const LoggedOutHomepageNavbar = (props) => {
  let className = "LoggedOutHomepage-Navbar"
  if (props.opaque) className += ' LoggedOutHomepage-Navbar-opaque'
  return <div className={className}>
    <div className="LoggedOutHomepage-Navbar-logo">Trossello</div>
    <div className="LoggedOutHomepage-Navbar-links">
      <LoginButton>Login</LoginButton>
      <SignUpButton>Sign Up</SignUpButton>
    </div>
  </div>
}

const SectionOne = (props) => {
  return <div className="LoggedOutHomepage-SectionOne">
    <div className="LoggedOutHomepage-header">Trossello lets you work more collaboratively and get more done.</div>
    <div className="LoggedOutHomepage-subheader">Trossello's boards, lists, and cards enable you to organize and prioritize your projects in a fun, flexible, and rewarding way.</div>
    <div className="SignUpButtonContainer"><SignUpButton>Sign Up - It's Free</SignUpButton></div>
    <div className="LoggedOutHomepage-login-link">Already use Tressello? <a href="/login">Log in.</a></div>
  </div>
}

var trelloBackgroundImg = require("../images/trello_background.png")

const SectionTwo = (props) => {
  return <div className="LoggedOutHomepage-SectionTwo">
    <h2>The Design Team shares updates on current projects so everyone in the company knows what's going on.</h2>
    <div className="LoggedOutHomepage-sample"><img src={trelloBackgroundImg}></img></div>
  </div>
}
 
const SignUpButton = (props) => {
  return <a href="/signup" className="SignUpButton">
    {props.children}
  </a>
}

const LoginButton = (props) => {
  return <a href="/login" className="LoginButton">
    {props.children}
  </a>
}


export default LoggedOutHomepage

