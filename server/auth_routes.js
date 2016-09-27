import express from 'express'
import github from './github'
const router = express.Router()

router.get('/login_via_github', (request, response) => {
  response.redirect(github.authorizeURL(request))
})

router.get('/oauth_callback', (request, response, next) => {
  github.authorize(request)
    .then(githubProfile => {
      // TODO find or create user
      // response.json(user)
      // request.session.user_id = user.id
      request.session.user = {
        name: githubProfile.login,
        avatar_url: githubProfile.avatar_url,
      }
      response.redirect('/')
    })
    .catch(next)
});

router.post('/logout', (request, response, next) => {
  request.session = null
  response.json({})
})


export default router
