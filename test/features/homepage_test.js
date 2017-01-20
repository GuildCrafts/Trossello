import React from 'react'
const { expect } = require('../setup')
import { By, until, usingSelenium } from '../selenium-helpers'
import { withBoardsListsAndCardsInTheDatabase } from '../helpers'

describe('Homepage tests', () => {
  withBoardsListsAndCardsInTheDatabase( () => {
    usingSelenium(() => {
      describe('when a user is logged out', () => {
        it('Should go to the github login', function(done){
          this.timeout(30000);
          this.browser.visit('/');
          this.browser.wait(until.titleIs('Trossello'), 4000);
          this.browser.findElement(By.linkText('Login Via Github'), 4000).click();
          this.browser.wait(until.titleIs("Sign in to GitHub · GitHub"), 4000);
          this.browser.then(_ => done())
        })
      })

      describe('when a user without boards is logged in', () => {
        beforeEach(function(){
          this.timeout(10000)
          return this.loginAs(10000)
        })

        it('Should go to the list of boards', function(done){
          this.timeout(30000)
          this.browser.visit('/')
          this.browser.wait(until.elementLocated(By.className('LoggedInHomepage-BoardListHeading')), 2000)
          this.browser.findElement(By.className('LoggedInHomepage-BoardListHeading')).getText()
          .then(result => expect(result).to.eql('All Boards'))
          this.browser.then(_ => done())
        })

        it('Should create a new board and select that board when you use the boards dropdown', function(done){
          this.timeout(30000)
          this.browser.visit('/')
          this.browser.findElement(By.className('BoardButton')).click()
          this.browser.wait(until.elementLocated(By.className('Navbar-BoardsDropdown-Button')), 2000).click()
          this.browser.findElement(By.className('CreateBoardPopover-boardName-input')).sendKeys('Test Board')
          this.browser.findElement(By.className('ColorBox-mint')).click()
          this.browser.findElement(By.className('CreateBoardPopover-submit-button')).click()
          this.browser.wait(until.elementLocated(By.xpath('//div[@class="BoardShowPage-PageHeader" and ./div/button/h1[contains(.,"Test Board")]]')), 3000)
          this.browser.then(_ => done())
        })

        it('Should logout', function(done){
          this.timeout(30000)
          this.browser.visit('/')
          this.browser.findElement(By.className('LogoutButton'), 2000).click()
          this.browser.findElement(By.className('Button-danger'), 2000).click()
          this.browser.findElement(By.className('LoggedOutHomepage'), 2000)
          this.browser.then(_ => done())
        })
      })

      describe('when a user with boards is logged in', () => {
        beforeEach(function(){
          this.timeout(10000)
          return this.loginAs(1455)
        })

        it('Should star and then unstar a board', function(done){
          this.timeout(30000)
          this.browser.visit('/')
          this.browser.wait(until.elementLocated(By.xpath('//div[@class="LoggedInHomepage-AllBoards"]//div[@class="LoggedInHomepage-Boards"]/a[contains(.,"Board1")]/button')), 2000).click()
          this.browser.wait(until.elementLocated(By.xpath('//div[@class="LoggedInHomepage-StarredBoards"]//div[@class="LoggedInHomepage-Boards"]/a[contains(.,"Board1")]')), 2000)
            .then(board =>{
              this.browser.findElement(By.xpath('//div[@class="LoggedInHomepage-StarredBoards"]//div[@class="LoggedInHomepage-Boards"]/a[contains(.,"Board1")]/button'), 2000).click()
              this.browser.wait(until.stalenessOf(board), 2000)
              this.browser.then(_ => done())
            })
        })
      })
    })
  })
})
