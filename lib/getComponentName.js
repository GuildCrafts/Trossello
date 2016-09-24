export default function getComponentName(component) {
  return component.displayName || component.name || 'Component'
}
