import React from 'react'
const { expect } = require('../setup')
import { By, until, usingSelenium } from '../selenium-helpers'
import { withBoardsListsAndCardsInTheDatabase } from '../helpers'

describe('Homepage tests', () => {
  withBoardsListsAndCardsInTheDatabase( () => {
    usingSelenium(() => {
      describe('when a user is logged out', () => {
        it('Should go to the github login', function(done){
          this.timeout((1000 * 60));
          this.browser.visit('/');
          this.browser.wait(until.titleIs('Trossello'), 1000);
          this.browser.findElement(By.linkText('Login Via Github')).click();
          this.browser.wait(until.titleIs("Sign in to GitHub · GitHub"), 1000);
          this.browser.then(_ => done())
        })
      })

      describe('when a user without boards is logged in', () => {
        beforeEach(function(){
          return this.loginAs(10000)
        })
        it('Should go to the list of boards', function(done){
          this.timeout((1000 * 60));
          this.browser.visit('/');
          this.browser.wait(until.elementLocated(By.className('LoggedInHomepage-BoardListHeading')), 1000);
          this.browser.findElement(By.className('LoggedInHomepage-BoardListHeading')).getText()
          .then(result => expect(result).to.eql('All Boards'))
          this.browser.then(_ => done())
        })

        it('Should create a new board and select that board when you use the boards dropdown', function(done){
          this.timeout((1000 * 60))
          this.browser.visit('/')
          this.browser.findElement(By.className('BoardButton')).click()
          this.browser.wait(until.elementLocated(By.className('BoardsDropdown-Button')), 2000).click();
          this.browser.findElement(By.className('CreateBoardPopover-boardName-input')).sendKeys('Test Board')
          this.browser.findElement(By.xpath("//div[@color='#9d7cae']")).click()
          this.browser.findElement(By.className('CreateBoardPopover-submit-button')).click()
          this.browser.wait(until.elementLocated(By.xpath('//div[@class="BoardShowPage-Header" and ./div/button/h1[contains(.,"Test Board")]]')), 5000)
          this.browser.then(_ => done())
        })

        it('Should logout', function(done){
          this.timeout((1000 *  60))
          this.browser.visit('/')
          this.browser.findElement(By.className('LogoutButton')).click()
          this.browser.findElement(By.className('Button-danger')).click()
          this.browser.findElement(By.className('LoginButton'))
          this.browser.then(_ => done())
        })
      })
    })

  })
})
