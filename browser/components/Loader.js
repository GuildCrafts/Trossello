import React, { Component } from 'react'
import './Loader.sass'

export default class Loader extends Component {
  render(){
    return <div className="Loader-spinner">
      <h4 className="Loader-spinner-text">Searching...</h4>
      <div className="Loader-spinner-bounce Loader-spinner-bounce1"> </div>
      <div className="Loader-spinner-bounce Loader-spinner-bounce2"> </div>
      <div className="Loader-spinner-bounce Loader-spinner-bounce3"> </div>
    </div>
  }
}