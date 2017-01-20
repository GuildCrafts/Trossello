import React from 'react'
import Key from 'selenium-webdriver'
const { expect } = require('../setup')
import { By, until, usingSelenium } from '../selenium-helpers'
import { withBoardsListsAndCardsInTheDatabase } from '../helpers'


describe('Side Menu Tests', () => {
  withBoardsListsAndCardsInTheDatabase( () => {
    usingSelenium(()=> {
      beforeEach(function(){
        this.timeout(10000)
        return this.loginAs(1455)
      })

      describe('when a user is logged in', ()=> {
        it('can invite a member to the current board', function(done){
          this.timeout(30000)
          this.browser.visit('/boards/101')
          this.browser.wait(until.elementLocated(By.className('BoardShowPage-PageHeader-menuButton')), 2000).click()
          this.browser.wait(until.elementLocated(By.className('BoardShowPage-MenuSideBar-InviteByEmailButton')), 2000).click()
          this.browser.findElement(By.className('emailInput'), 2000).sendKeys('test@email.com')
          this.browser.findElement(By.className('Button-primary'), 2000).click()
          this.browser.wait(until.elementLocated(By.className('BoardShowPage-PageHeader-menuButton')), 2000)
          this.browser.then(_ => done())
        })

        it('can change the background of the current board', function(done){
          this.timeout(30000)
          this.browser.visit('/boards/101')
          this.browser.sleep(200)
          this.browser.wait(until.elementLocated(By.className('BoardShowPage')), 2000).getCssValue("background-color")
            .then( oldColor => {
              this.browser.wait(until.elementLocated(By.className('BoardShowPage-PageHeader-menuButton')), 2000).click()
              this.browser.sleep(200)
              this.browser.wait(until.elementLocated(By.linkText('Change Background')), 2000).click()
              this.browser.sleep(200)
              this.browser.wait(until.elementLocated(By.className('ColorBox-mint')), 2000).click()
              this.browser.sleep(200)
              this.browser.findElement(By.className('BoardShowPage-mint'), 2000)
              this.browser.then(_ => done())
            })
        })

        it('can go to the filter cards, powerups, and stickers panes of the current board', function(done){
          this.timeout(30000)
          this.browser.visit('/boards/101')
          this.browser.wait(until.elementLocated(By.className('BoardShowPage-PageHeader-menuButton')), 2000).click()
          this.browser.wait(until.elementLocated(By.linkText('Filter Cards')), 2000).click()
          this.browser.wait(until.elementLocated(By.className('BoardShowPage-MenuSideBar-FilterCardsPane')), 2000)
          this.browser.findElement(By.className('Icon fa fa-arrow-left'), 2000).click()
          this.browser.sleep(200)
          this.browser.wait(until.elementLocated(By.linkText('Power-Ups')), 2000).click()
          this.browser.wait(until.elementLocated(By.className('BoardShowPage-MenuSideBar-PowerUpsPane')), 2000)
          this.browser.findElement(By.className('Icon fa fa-arrow-left'), 2000).click()
          this.browser.sleep(200)
          this.browser.wait(until.elementLocated(By.linkText('Stickers')), 2000).click()
          this.browser.wait(until.elementLocated(By.className('BoardShowPage-MenuSideBar-StickersPane')), 2000)
          this.browser.findElement(By.className('Icon fa fa-arrow-left'), 2000).click()
          this.browser.findElement(By.className('BoardShowPage-MenuSideBar-MainPane'), 2000)
          this.browser.then(_ => done())
        })

        it('can go to the activity pane using the icon and the "View all activity..." link', function(done){
          this.timeout(30000)
          this.browser.visit('/boards/101')
          this.browser.wait(until.elementLocated(By.className('BoardShowPage-PageHeader-menuButton')), 2000).click()
          this.browser.wait(until.elementLocated(By.linkText('Activity')), 2000).click()
          this.browser.wait(until.elementLocated(By.className('BoardShowPage-MenuSideBar-BoardActivity')), 2000)
          this.browser.findElement(By.className('Icon fa fa-arrow-left'), 2000).click()
          this.browser.sleep(200)
          this.browser.wait(until.elementLocated(By.linkText('View all activity...')), 2000).click()
          this.browser.wait(until.elementLocated(By.className('BoardShowPage-MenuSideBar-BoardActivity')), 2000)
          this.browser.then(_ => done())
        })

        it('makes a card, shows that activity on the panel, clicks a link to the card modal', function(done){
          this.timeout(30000)
          this.browser.visit('/boards/101')
          this.browser.wait(until.elementLocated(By.css('.BoardShowPage-List[data-list-id="40"] .BoardShowPage-List-createCardLink')), 2000).click()
          this.browser.wait(until.elementLocated(By.css('.BoardShowPage-List[data-list-id="40"] textarea')), 2000).sendKeys('New Card')
          this.browser.findElement(By.css('.BoardShowPage-List[data-list-id="40"] .Button-primary'), 2000).click()
          this.browser.wait(until.elementLocated(By.className('BoardShowPage-PageHeader-menuButton')), 2000).click()
          this.browser.sleep(200)
          this.browser.wait(until.elementLocated(By.xpath('//a[@class="Link Link-default BoardShowPage-Activity-string-cardNameLink" and ./span[contains(.,"New Card")]]')), 2000).click()
          this.browser.wait(until.elementLocated(By.css('.BoardShowPage-CardModal-CardHeader input')), 2000).getAttribute('value')
            .then( cardName => expect(cardName).to.eql("New Card"))
          this.browser.then(_ => done())
        })
      })
    })
  })
})
