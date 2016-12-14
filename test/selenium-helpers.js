import request from 'request-promise'
const fs = require('fs')
import { server } from './setup'
const { spawn, exec } = require('child-process-promise')
const path = require('path')
import webdriver from 'selenium-webdriver'
import chromedriver from 'chromedriver'
const { By, until, Key } = webdriver
const ARTIFACTS_PATH = path.resolve(__dirname, '../../tmp/artifacts')
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

    this.takeScreenshot = () => {
      return this.browser.takeScreenshot()
      .then(function(image, error) {
        const fileName = path.resolve(ARTIFACTS_PATH, `screenshot-${new Date().valueOf()}.png`)
        fs.writeFile(fileName, image, 'base64', function(error){
          if (error) throw error
        })
      })
    }

    this.getLogs =  () => {
      return this.browser.manage().logs().get('browser')
        .then(browserLogs => console.log('Browser Console Logs:', browserLogs))
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
    const body = this.browser.findElement(By.css('body'), 10000)
    return this.browser.wait(
      until.elementTextContains(body, `logged in as ${userId}`),
      10000
    )
  })
}
