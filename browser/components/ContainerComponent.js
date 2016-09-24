import { connect } from 'react-redux'
import Actions from '../actions'
import getComponentName from 'getComponentName'

// http://redux.js.org/docs/basics/UsageWithReact.html
// https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0
const ContainerComponent = (component) => {
  const ContainerComponent = connect()((props) => {
    const actions = new Actions(props.dispatch)
    props = {...props}
    delete props.dispatch
    return component(actions, props)
  })
  ContainerComponent.displayName = `ContainerComponent(${getComponentName(component)})`
  return ContainerComponent
}
export default ContainerComponent
