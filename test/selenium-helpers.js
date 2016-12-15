import request from 'request-promise'
import { server } from './setup'
const { spawn, exec } = require('child-process-promise')
import webdriver from 'selenium-webdriver'
import chromedriver from 'chromedriver'
const { By, until, Key } = webdriver

export { By, until, Key }

export const usingSelenium = (callback) => {
  context('when running Selenium tests', () => {
    beforeEach(setupSelenium)
    afterEach(teardownSelenium)
    callback()
  })
}

export const setupSelenium = function(done){
  this.serverInstance = server.start(3781, () => {
    this.browser = new webdriver.Builder()
      .forBrowser('chrome')
      .build()

    this.browser.visit = (path) => {
      return this.browser.get('http://localhost:3781'+path);
    }
    this.loginAs = loginAs
    done()
  })
}

export const teardownSelenium = function(done){
  if (this.browser) this.browser.quit()
  if (this.serverInstance) this.serverInstance.close(done)
}

const loginAs = function(userId){
  return this.browser.visit(`/__login/${userId}`)
  .then(_ => {
    const body = this.browser.findElement(By.css('body'))
    return this.browser.wait(
      until.elementTextContains(body, `logged in as ${userId}`),
      1000
    )
  })
}
