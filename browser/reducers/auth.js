const getInitialState = () => {
  return {
    isFetching: true,
    isAuthenticated: false,
    errorMessage: undefined,
    user: undefined,
  }
}

const auth = (state = getInitialState(), action) => {
  switch (action.type) {
    case 'SESSION_LOADED':
      return {
        isFetching: false,
        isAuthenticated: !!action.user,
        errorMessage: action.error,
        user: action.user,
      }
    case 'LOGOUT_SUCCESS':
      return {
        isFetching: false,
        isAuthenticated: false,
        errorMessage: undefined,
        user: undefined,
      }
    default:
      return state
  }
}

export default auth
