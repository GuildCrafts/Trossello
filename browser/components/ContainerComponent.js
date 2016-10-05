import { connect } from 'react-redux'
import { actions } from '../state'
import getComponentName from 'getComponentName'

// http://redux.js.org/docs/basics/UsageWithReact.html
// https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0
const ContainerComponent = (component) => {
  const ContainerComponent = (props) => {
    return component({...props, actions})
  }
  ContainerComponent.displayName = `ContainerComponent(${getComponentName(component)})`
  return ContainerComponent
}
export default ContainerComponent
