// ensure fetch pollyfill is loaded

export default (method, path, options={}) => {
  options.method = method

  // enables cookies by default
  if ('credentials' in options); else {
    options.credentials = 'same-origin'
  }

  return fetch(path, options)
    .then(response => response.json())
}
