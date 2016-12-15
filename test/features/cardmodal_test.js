import React from 'react'
const { expect } = require('../setup')
import { By, until, Key, usingSelenium } from '../selenium-helpers'
import { withBoardsListsAndCardsInTheDatabase } from '../helpers'

describe('Card modal tests', () => {
  withBoardsListsAndCardsInTheDatabase( () => {
    usingSelenium(() => {
      beforeEach(function(){
        return this.loginAs(1455)
      })

      describe('Edit card tests', () => {
        it('Should update the card title', function(done){
          this.timeout((1000 * 60))
          this.browser.visit('/boards/101/cards/90')
          this.browser.wait(until.elementLocated(By.css('.CardModal-CardHeader-header-title > input')), 2000).getAttribute('value')
          .then(cardName => {
            this.browser.findElement(By.css('.CardModal-CardHeader-header-title > input'), 2000).sendKeys(' updated')
            this.browser.findElement(By.css('.CardModal-CardHeader-header-title > input'), 2000).getAttribute('value')
            .then(editedCardName => expect(editedCardName).to.eql(cardName + ' updated'))
          })
          this.browser.then(_ => done())
        })
        it('Should update the card description', function(done){
          this.timeout((1000 * 60))
          this.browser.visit('/boards/101/cards/90')
          this.browser.wait(until.elementLocated(By.className('CardModal-CardDescription')), 2000).click()
          this.browser.wait(until.elementLocated(By.css('.CardModal-CardDescription > textarea')), 2000).sendKeys('updated')
          this.browser.findElement(By.css('.CardModal-CardDescription .Button-primary'), 2000).click()
          this.browser.wait(until.elementLocated(By.className('CardModal-CardDescription-content')), 2000).getText()
          .then(description => expect(description).to.eql('updated'))
          this.browser.then(_ => done())
        })
      })

      describe('Archive card test', () => {
        it('Should archive the card', function(done){
          this.timeout((1000 * 60))
          this.browser.visit('/boards/101/cards/90')
          this.browser.wait(until.elementLocated(By.css('.CardModal-Controls > .ConfirmationLink > button')), 2000).click()
          this.browser.wait(until.elementLocated(By.css('.ConfirmationDialog-controls > .Button-danger')), 2000).click()
          this.browser.wait(until.elementLocated(By.className('CardModal-archivedBanner')), 2000)
          this.browser.then(_ => done())
        })
      })

      describe('Comment tests', () => {
        describe('Should add a new comment to the card', () => {
          it('Should edit the comment', function(done){
            this.timeout((1000 * 60))
            this.browser.visit('/boards/101/cards/90')
            this.browser.wait(until.elementLocated(By.css('.CardModal-CardCommentForm .ContentForm-textarea')), 2000).sendKeys('New Comment')
            this.browser.findElement(By.css('.CardModal-CardCommentForm .ContentForm-controls > .Button-primary'), 2000).click()
            this.browser.wait(until.elementLocated(By.className('CardModal-CardComment-comment-box')), 2000).getText()
            .then(commentText => {
              this.browser.findElement(By.className('CardModal-CardComment-comment-controls-edit'), 2000).click()
              this.browser.wait(until.elementLocated(By.css('.CardModal-CardComment-comment > .CardModal-CommentEditForm > textarea')), 2000).sendKeys(' Edited')
              this.browser.findElement(By.css('.CardModal-CardComment-comment button')).click()
              this.browser.sleep(200)
              this.browser.findElement(By.css('.CardModal-CardComment-comment-box'), 2000).getText()
              .then(editedText => expect(commentText).to.not.eql(editedText))
              this.browser.then(_ => done())
            })
          })
          it('Should delete the comment', function(done){
            this.timeout((1000 * 60))
            this.browser.visit('/boards/101/cards/90')
            this.browser.wait(until.elementLocated(By.css('.CardModal-CardCommentForm .ContentForm-textarea')), 2000).sendKeys('New Comment')
            this.browser.findElement(By.css('.CardModal-CardCommentForm .ContentForm-controls > .Button-primary'), 2000).click()
            this.browser.wait(until.elementLocated(By.className('CardModal-CardComment-comment-box')), 2000)
            .then(comment => {
              this.browser.findElement(By.css('.CardModal-CardComment-comment-controls-delete'), 2000).click()
              this.browser.wait(until.stalenessOf(comment), 2000)
              this.browser.then(_ => done())
            })
          })
        })
      })

      describe('Label tests', () => {
        describe('Clicking the label button in controls should open the Label Menu', () => {
          it('Should open the CreateLabelMenu and create a label', function(done){
            this.timeout((1000 * 60))
            this.browser.visit('/boards/101/cards/90')
            this.browser.wait(until.elementLocated(By.css('.CardModal-Controls-label > button'), 2000)).click()
            this.browser.wait(until.elementLocated(By.className('LabelMenu-button')), 2000).click()
            this.browser.wait(until.elementLocated(By.className('LabelMenu-CreateLabelPanel'), 2000))
            this.browser.findElement(By.css('.LabelMenu-CreateLabelPanel-Form > input')).sendKeys('New Label')
            this.browser.findElement(By.xpath("//div[@color='#bc6858']")).click()
            this.browser.findElement(By.css('.LabelMenu-CreateLabelPanel-button')).click()
            this.browser.wait(until.elementLocated(By.xpath("//div[@class='CardLabel-text' and text()='New Label']")), 2000)
            this.browser.then(_ => done())
          })
          it('Should delete a label from the board', function(done){
            this.timeout((1000 * 60))
            this.browser.visit('/boards/101/cards/90')
            this.browser.wait(until.elementLocated(By.css('.CardModal-Controls-label > button')), 2000).click()
            this.browser.findElement(By.className('LabelMenu-LabelRow-box'), 2000)
              .then(cardLabel => {
                this.browser.wait(until.elementLocated(By.className('LabelMenu-LabelRow-edit')), 2000).click()
                this.browser.wait(until.elementLocated(By.css('.ConfirmationLink > .Button-danger')), 2000).click()
                this.browser.wait(until.elementLocated(By.css('.ConfirmationDialog-controls > .Button-danger')), 2000).click()
                this.browser.wait(until.stalenessOf(cardLabel), 2000)
                this.browser.then(_ => done())
              })
          })

        })

        describe('Clicking on a card label should open the Label Menu', () => {
          it('Should remove a label from the card when the label is clicked from the Menu', function(done){
            this.timeout((1000 * 60));
            this.browser.visit('/boards/101/cards/90')
            this.browser.wait(until.elementLocated(By.className('CardModal-CardLabels-labels-Label'), 2000))
            this.browser.findElement(By.className('CardModal-CardLabels-labels-Label'), 2000)
              .then(cardLabel => {
                this.browser.findElement(By.css('.CardModal-CardLabels-labels-Label > button'), 2000).click()
                this.browser.wait(until.elementLocated(By.className('LabelMenu')), 2000)
                this.browser.findElement(By.className('LabelMenu-LabelRow-box'), 2000).click()
                this.browser.wait(until.stalenessOf(cardLabel), 2000)
                this.browser.then(_ => done())
              })
          })
          it('Should update the text and color of a label', function(done){
            this.timeout((1000 * 60))
            this.browser.visit('/boards/101/cards/90')
            this.browser.wait(until.elementLocated(By.css('.CardModal-CardLabels-labels-Label > button')), 2000).click()
            this.browser.wait(until.elementLocated(By.className('LabelMenu-LabelRow-edit')), 2000).click()
            this.browser.findElement(By.xpath('//div[@class="CardLabel-text"]')).getText()
            .then( oldText => {
              this.browser.findElement(By.className('CardLabel'), 2000).getCssValue("background-color")
                .then( oldColor => {
                  this.browser.findElement(By.css('.LabelMenu-CreateLabelPanel-Form > input'), 2000).sendKeys(' edited')
                  this.browser.findElement(By.xpath('//div[@color="#6cc885"]'), 2000).click()
                  this.browser.findElement(By.css('.LabelMenu-CreateLabelPanel-button')).click()
                  this.browser.sleep(500)
                  this.browser.findElement(By.xpath('//div[@class="CardLabel-text"]')).getText()
                    .then( newText => expect( oldText ).to.not.eql( newText ))
                  this.browser.findElement(By.className('CardLabel'), 2000).getCssValue("background-color")
                    .then( newColor => expect( oldColor ).to.not.eql( newColor ))
                  this.browser.then(_ => done())
                })
              })
          })
        })
      })

      describe('Copy Card test', () => {
        it('Should make a copy of the card with the correct text and order', function(done){
          this.timeout((1000 * 60))
          this.browser.visit('/boards/101/cards/90')
          this.browser.wait(until.elementLocated(By.css('.CardModal-Controls-copy > button')), 2000).click()
          this.browser.wait(until.elementLocated(By.css('.CardModal-CopyCardDialog textarea')), 2000).sendKeys(' copy')
          this.browser.findElement(By.css('.CardModal-CopyCardDialog-positionSelector > select'), 2000).click()
          this.browser.wait(until.elementLocated(By.css('.CardModal-CopyCardDialog-positionSelector > select > option[value="1"]')), 2000).click()
          this.browser.findElement(By.css('.CardModal-CopyCardDialog > form > button'), 2000).click()
          this.browser.visit('/boards/101')
          this.browser.wait(until.elementLocated(By.xpath('//div[@class="BoardShowPage-Card" and ./a[@data-order="1"] and ./a/pre[contains(.,"Card 90 copy")]]')))
          this.browser.then(_ => done())
        })
      })

      describe('Hide Details test', () => {
        it('Should hide activity from the card activity feed', function(done){
          this.timeout((1000 * 60))
          this.browser.visit('/boards/101/cards/90')
          this.browser.wait(until.elementLocated(By.className('CardModal-Activity')), 2000)
          .then(activity => {
            this.browser.findElement(By.className('CardModal-CardActivity-header-toggle'), 2000).click()
            this.browser.wait(until.stalenessOf(activity), 2000)
            this.browser.then(_ => done())
          })
        })
      })

    })
  })
})
