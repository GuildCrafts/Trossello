import React, { Component } from 'react'

export default ({ as, store, render }) => {
  const storeProvider = class StoreProvider extends Component {
    constructor(props){
      super(props)
      this.rerender = this.rerender.bind(this)
      store.subscribe(this.rerender)
      this.state = { as, store, render }
    }
    getChildContext() {
      return {
        [as]: store.value
      }
    }
    componentWillUnmount(){
      store.unsubscribe(this.rerender)
    }
    rerender(){
      this.forceUpdate()
    }
    render(){
      const props = Object.assign({}, this.props, this.getChildContext())
      return React.createElement(render, props)
    }
  }

  storeProvider.childContextTypes = {}
  storeProvider.childContextTypes[as] = React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.array,
  ])

  return storeProvider
}
