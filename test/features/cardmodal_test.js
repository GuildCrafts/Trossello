import React from 'react'
const { expect } = require('../setup')
import { By, until, Key, usingSelenium } from '../selenium-helpers'
import { withBoardsListsAndCardsInTheDatabase } from '../helpers'

describe('Card modal tests', () => {
  withBoardsListsAndCardsInTheDatabase( () => {
    usingSelenium(() => {
      beforeEach(function(){
        this.timeout(10000)
        return this.loginAs(1455)
      })

      describe('Edit card tests', () => {
        it('Should update the card title', function(done){
          this.timeout(30000)
          this.browser.visit('/boards/101/cards/90')
          this.browser.wait(until.elementLocated(By.css('.BoardShowPage-CardModal-CardHeader-title-text > input')), 2000).getAttribute('value')
          .then(cardName => {
            this.browser.findElement(By.css('.BoardShowPage-CardModal-CardHeader-title-text > input'), 2000).sendKeys(' updated')
            this.browser.findElement(By.css('.BoardShowPage-CardModal-CardHeader-title-text > input'), 2000).getAttribute('value')
            .then(editedCardName => expect(editedCardName).to.eql(cardName + ' updated'))
          })
          this.browser.then(_ => done())
        })
        it('Should update the card description', function(done){
          this.timeout(30000)
          this.browser.visit('/boards/101/cards/90')
          this.browser.wait(until.elementLocated(By.className('BoardShowPage-CardModal-CardDescription')), 2000).click()
          this.browser.wait(until.elementLocated(By.css('.BoardShowPage-CardModal-CardDescription > textarea')), 2000).sendKeys('updated')
          this.browser.findElement(By.css('.BoardShowPage-CardModal-CardDescription .Button-primary'), 2000).click()
          this.browser.wait(until.elementLocated(By.className('BoardShowPage-CardModal-CardDescription-content')), 2000).getText()
          .then(description => expect(description).to.eql('updated'))
          this.browser.then(_ => done())
        })
      })

      describe('Archive card test', () => {
        it('Should archive the card', function(done){
          this.timeout(30000)
          this.browser.visit('/boards/101/cards/90')
          this.browser.wait(until.elementLocated(By.className('BoardShowPage-CardModal-ArchiveCardButton')), 2000).click()
          this.browser.wait(until.elementLocated(By.className('ConfirmationClickable-ConfirmationDialog-controls-confirm')), 2000).click()
          this.browser.wait(until.elementLocated(By.className('BoardShowPage-CardModal-archivedBanner')), 2000)
          this.browser.then(_ => done())
        })
      })

      describe('Comment tests', () => {
        describe('Should add a new comment to the card', () => {
          it('Should edit the comment', function(done){
            this.timeout(30000)
            this.browser.visit('/boards/101/cards/90')
            this.browser.wait(until.elementLocated(By.css('.BoardShowPage-CardModal-CommentForm .BoardShowPage-ContentForm-textarea')), 2000).sendKeys('New Comment')
            this.browser.findElement(By.css('.BoardShowPage-CardModal-CommentForm .BoardShowPage-ContentForm-controls > .Button-primary'), 2000).click()
            this.browser.wait(until.elementLocated(By.className('BoardShowPage-CardModal-CardComment-comment-controls-edit')), 2000).click()
            this.browser.wait(until.elementLocated(By.css('.BoardShowPage-CardModal-CardComment-comment > .BoardShowPage-CardModal-CommentForm > textarea')), 2000).sendKeys(' Edited')
            this.browser.findElement(By.css('.BoardShowPage-CardModal-CardComment-comment button')).click()
            this.browser.wait(until.elementLocated(By.css('.BoardShowPage-CardModal-CardComment-comment-box')), 2000)
            .then(element => this.browser.wait(until.elementTextContains(element, ' Edited')), 2000)
            this.browser.then(_ => done())
          })
          it('Should delete the comment', function(done){
            this.timeout(30000)
            this.browser.visit('/boards/101/cards/90')
            this.browser.wait(until.elementLocated(By.css('.BoardShowPage-CardModal-CommentForm .BoardShowPage-ContentForm-textarea')), 2000).sendKeys('New Comment')
            this.browser.findElement(By.css('.BoardShowPage-CardModal-CommentForm .BoardShowPage-ContentForm-controls > .Button-primary'), 2000).click()
            this.browser.wait(until.elementLocated(By.className('BoardShowPage-CardModal-CardComment-comment-box')), 2000)
            .then(comment => {
              this.browser.findElement(By.css('.BoardShowPage-CardModal-CardComment-comment-controls-delete'), 2000).click()
              this.browser.wait(until.stalenessOf(comment), 2000)
              this.browser.then(_ => done())
            })
          })
        })
      })

      describe('Label tests', () => {
        describe('Clicking the label button in controls should open the Label Menu', () => {
          it('Should open the CreateLabelMenu and create a label', function(done){
            this.timeout(30000)
            this.browser.visit('/boards/101/cards/90')
            this.browser.wait(until.elementLocated(By.css('.BoardShowPage-CardModal-Controls-label > button'), 2000)).click()
            this.browser.wait(until.elementLocated(By.className('BoardShowPage-CardModal-LabelMenu-button')), 2000).click()
            this.browser.wait(until.elementLocated(By.className('BoardShowPage-CardModal-LabelMenu-CreateLabelPanel'), 2000))
            this.browser.findElement(By.css('.BoardShowPage-CardModal-LabelMenu-CreateLabelPanel-Form > input')).sendKeys('New Label')
            this.browser.findElement(By.className('ColorBox-mint')).click()
            this.browser.findElement(By.css('.BoardShowPage-CardModal-LabelMenu-CreateLabelPanel-button')).click()
            this.browser.wait(until.elementLocated(By.xpath("//div[@class='Card-ColorLabel-text' and text()='New Label']")), 2000)
            this.browser.then(_ => done())
          })
          it('Should delete a label from the board', function(done){
            this.timeout(30000)
            this.browser.visit('/boards/101/cards/90')
            this.browser.wait(until.elementLocated(By.css('.BoardShowPage-CardModal-Controls-label > button')), 2000).click()
            this.browser.findElement(By.className('BoardShowPage-CardModal-LabelMenu-LabelRow-box'), 2000)
              .then(cardLabel => {
                this.browser.wait(until.elementLocated(By.className('BoardShowPage-CardModal-LabelMenu-LabelRow-edit')), 2000).click()
                this.browser.wait(until.elementLocated(By.className('BoardShowPage-CardModal-LabelMenu-CreateLabelPanel-delete')), 2000).click()
                this.browser.wait(until.elementLocated(By.className('ConfirmationClickable-ConfirmationDialog-controls-confirm')), 2000).click()
                this.browser.wait(until.stalenessOf(cardLabel), 2000)
                this.browser.then(_ => done())
              })
          })

        })

        describe('Clicking on a card label should open the Label Menu', () => {
          it('Should remove a label from the card when the label is clicked from the Menu', function(done){
            this.timeout(30000);
            this.browser.visit('/boards/101/cards/90')
            this.browser.wait(until.elementLocated(By.className('Card-ColorLabel-purple'), 2000))
              .then(cardLabel => {
                this.browser.findElement(By.className('BoardShowPage-CardModal-labels-labelButton'), 2000).click()
                this.browser.wait(until.elementLocated(By.className('BoardShowPage-CardModal-LabelMenu-LabelRow-box')), 2000).click()
                this.browser.wait(until.stalenessOf(cardLabel), 2000)
                this.browser.then(_ => done())
              })
          })
          it('Should update the text and color of a label', function(done){
            this.timeout(30000)
            this.browser.visit('/boards/101/cards/90')
            this.browser.wait(until.elementLocated(By.className('BoardShowPage-CardModal-labels-labelButton')), 2000).click()
            this.browser.wait(until.elementLocated(By.className('BoardShowPage-CardModal-LabelMenu-LabelRow-edit')), 2000).click()
            this.browser.findElement(By.className('Card-ColorLabel-purple'), 2000)
              .then(oldElement => {
                this.browser.findElement(By.css('.BoardShowPage-CardModal-LabelMenu-CreateLabelPanel-Form > input'), 2000).sendKeys(' edited')
                this.browser.findElement(By.className('ColorBox-mint'), 2000).click()
                this.browser.findElement(By.className('BoardShowPage-CardModal-LabelMenu-CreateLabelPanel-button')).click()
                this.browser.wait(until.elementTextContains(oldElement, ' edited'), 2000)
                this.browser.findElement(By.className('Card-ColorLabel-mint'), 2000)
                this.browser.then(_ => done())
              })
            })
          })
        })

      describe('Copy Card test', () => {
        it('Should make a copy of the card with the correct text and order', function(done){
          this.timeout(30000)
          this.browser.visit('/boards/101/cards/90')
          this.browser.wait(until.elementLocated(By.css('.BoardShowPage-CardModal-Controls-copy > button')), 2000).click()
          this.browser.wait(until.elementLocated(By.className('DialogBox-dialogForm-dialogTextarea')), 2000).sendKeys(' copy')
          this.browser.findElement(By.css('.BoardShowPage-CardModal-CopyCardDialog-positionSelector > select'), 2000).click()
          this.browser.wait(until.elementLocated(By.css('.BoardShowPage-CardModal-CopyCardDialog-positionSelector > select > option[value="1"]')), 2000).click()
          this.browser.findElement(By.css('.BoardShowPage-CardModal-CopyCardDialog > form > button'), 2000).click()
          this.browser.visit('/boards/101')
          this.browser.wait(until.elementLocated(By.xpath('//div[@class="Card-box" and @data-order="1" and ./pre[contains(.,"Card 90 copy")]]')), 2000)
          this.browser.then(_ => done())
        })
      })

      describe('Hide Details test', () => {
        it('Should hide activity from the card activity feed', function(done){
          this.timeout(30000)
          this.browser.visit('/boards/101/cards/90')
          this.browser.wait(until.elementLocated(By.className('BoardShowPage-CardModal-Activity')), 2000)
          .then(activity => {
            this.browser.findElement(By.className('BoardShowPage-CardModal-CardActivity-header-toggle'), 2000).click()
            this.browser.wait(until.stalenessOf(activity), 2000)
            this.browser.then(_ => done())
          })
        })
      })

    })
  })
})
