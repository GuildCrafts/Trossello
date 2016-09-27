import randomstring from 'randomstring'
import express from 'express'
import URL from 'url'
import Request from 'request-promise'
import querystring from 'querystring'


const github = {
  CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,

  oauthRedirectURI(request){
    return URL.format({
      protocol: request.protocol,
      host: request.get('host'),
      pathname: '/oauth_callback',
    })
  },

  authorizeURL(request, response){
    const state = randomstring.generate()
    request.session.oauth_state = state

    const url = URL.parse('https://github.com/login/oauth/authorize')
    url.query = {
      client_id: process.env.GITHUB_CLIENT_ID,
      redirect_uri: github.oauthRedirectURI(request),
      scope: 'user:email',
      state: state,
      allow_signup: 'true',
    }
    return URL.format(url)
  },

  authorize(request){
    if (request.query.state !== request.session.oauth_state){
      const error = new Error('LOGIN FAILED')
      error.status = 400
      return Promise.reject(error)
    }

    return github.requestAccessToken(request)
      .then(results => {
        results = querystring.parse(results)
        request.session.github_access_token = results.access_token
        request.session.github_scope = results.scope
        request.session.github_token_type = results.token_type
        return github.requestUserProfile(request)
      })
      .catch(error => {
        error.status = 500
        throw error;
      })
  },

  githubAccessTokenURL(request){
    const url = URL.parse('https://github.com/login/oauth/access_token')
    url.query = {
      client_id: github.CLIENT_ID,
      client_secret: github.CLIENT_SECRET,
      code: request.query.code,
      redirect_uri: github.oauthRedirectURI(request),
      state: request.session.oauth_state,
    }
    return URL.format(url)
  },

  requestAccessToken(request){
    return Request.post(github.githubAccessTokenURL(request))
  },

  requestUserProfile(request){
    return Request({
      json: true,
      method: 'GET',
      url: 'https://api.github.com/user',
      headers: {
        'Authorization': `token ${request.session.github_access_token}`,
        'User-Agent': 'node',
      },
    })
  }

}

export default github
