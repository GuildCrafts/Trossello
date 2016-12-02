import React, { Component } from 'react'
import './Spinner.sass'

export default class Spinner extends Component {
  render(){
    return <div className="Spinner">
      <div className="Spinner-bounce Spinner-bounce1"> </div>
      <div className="Spinner-bounce Spinner-bounce2"> </div>
      <div className="Spinner-bounce Spinner-bounce3"> </div>
    </div>
  }
}
