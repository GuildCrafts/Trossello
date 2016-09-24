const getInitialState = () => {
  return {
    isFetching: false,
    isAuthenticated: false,
    errorMessage: undefined,
    creds: undefined,
  }
}

const auth = (state = getInitialState(), action) => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
        creds: action.creds
      }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        errorMessage: undefined,
        user: action.user
      }
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.errorMessage
      }
    case 'LOGOUT_SUCCESS':
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
      }
    default:
      return state
  }
}

export default auth
