import express from 'express'
import github from './github'
import { queries, commands } from './database'
const router = express.Router()

router.get('/login_via_github', (request, response) => {
  response.redirect(github.authorizeURL(request))
})

router.get('/oauth_callback', (request, response, next) => {
  github.authorize(request)
    .then(githubProfile => {
      console.log('githubProfile', JSON.stringify(githubProfile, null, 4))
      return commands.findOrCreateUserFromGithubProfile(githubProfile)
    })
    .then(currentUser => {
      request.session.userId = currentUser.id
      response.redirect('/')
    })
    .catch(next)
});

router.post('/logout', (request, response, next) => {
  request.session = null
  response.json({})
})


router.get('/session', (request, response) => {
  if (!request.session.userId) return response.json({})
  queries.getUserById(request.session.userId)
    .then(user => {
      response.json({
        user: user
      })
    })
});


export default router
