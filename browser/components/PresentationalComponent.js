import { connect } from 'react-redux'
import Actions from '../actions'
import getComponentName from 'getComponentName'

// http://redux.js.org/docs/basics/UsageWithReact.html
// https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0
const PresentationalComponent = (component) => {
  const Connect = connect(
    mapStateToProps,
    mapDispatchToProps
  )
  const wrapper = Connect(component)
  wrapper.displayName = `PresentationalComponent(${getComponentName(component)})`
  return wrapper
}
export default PresentationalComponent
const mapStateToProps = (state) => ({state})
const mapDispatchToProps = (dispatch) => {
  const actions = (new Actions(dispatch))
  return {...actions}
}
