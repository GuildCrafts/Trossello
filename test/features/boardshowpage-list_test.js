import React from 'react'
import Key from 'selenium-webdriver'
const { expect } = require('../setup')
import { By, until, usingSelenium } from '../selenium-helpers'
import { withBoardsListsAndCardsInTheDatabase } from '../helpers'


describe('Board Show Page Tests for Lists', () => {
  withBoardsListsAndCardsInTheDatabase( () => {
    usingSelenium(()=> {
      beforeEach(function(){
        this.timeout(10000)
        return this.loginAs(1455)
      })

      describe('when a user is logged in', ()=> {
        it('can click on a previously existing list header and edit the header name', function(done){
          this.timeout(30000)
          this.browser.visit('/boards/101')
          this.browser.wait(until.elementLocated(By.className('BoardShowPage-List-header')), 4000).click()
          this.browser.findElement(By.css('.BoardShowPage-List-header > input'), 2000).sendKeys('New List1')
          this.browser.findElement(By.css('body'), 2000).click()
          this.browser.wait(until.elementLocated(By.xpath('//div[@class="BoardShowPage-List-header" and ./div[contains(.,"New List1")]]')), 2000)
          this.browser.then(_ => done())
        })

        it('can create a new list', function(done){
          this.timeout(30000)
          this.browser.visit('/boards/101')
          this.browser.wait(until.elementLocated(By.className('BoardShowPage-NewListForm-Link'), 2000)).click()
          this.browser.findElement(By.css('.BoardShowPage-NewListForm-Form > form > input'), 2000).sendKeys('List3')
          this.browser.findElement(By.className('Button-primary'), 2000).click()
          this.browser.findElement(By.className('Icon fa fa-times'), 2000).click()
          this.browser.wait(until.elementLocated(By.xpath('//div[@class="BoardShowPage-List-header" and ./div[contains(.,"List3")]]')), 2000)
          this.browser.then(_ => done())
        })

        it('can copy a list using the list popover menu', function(done){
          this.timeout(30000)
          this.browser.visit('/boards/101')
          this.browser.wait(until.elementLocated(By.css('.BoardShowPage-List[data-list-id="40"] .BoardShowPage-List-options > button')), 2000).click()
          this.browser.wait(until.elementLocated(By.className('BoardShowPage-List-ListActionsMenu-ListActionsPane-CopyList')), 2000).click()
          this.browser.wait(until.elementLocated(By.css('.BoardShowPage-List-ListActionsMenu-CopyListPane textarea')), 2000).sendKeys('Copy List 1')
          this.browser.findElement(By.css('.BoardShowPage-List-ListActionsMenu-CopyListPane button'), 2000).click()
          this.browser.wait(until.elementLocated(By.xpath('//div[@class="BoardShowPage-List-header" and ./div[contains(.,"Copy List 1")]]')), 2000)
          this.browser.then(_ => done())
        })
      })
    })
  })
})
