export default `
LOADING_SESSION
SESSION_LOADED
LOGOUT_SUCCESS
LOGOUT_FAIL
`.split(/[^A-Z_]+/)
.slice(1,-1)
