import React from 'react'
const { expect } = require('../setup')
import { By, until, usingSelenium } from '../selenium-helpers'
import { withBoardsListsAndCardsInTheDatabase } from '../helpers'

describe('Card modal tests', () => {
  withBoardsListsAndCardsInTheDatabase( () => {
    usingSelenium(() => {
      beforeEach(function(){
        return this.loginAs(1455)
      })

      describe('Label tests', () => {
        describe('Clicking the label button in controls should open the Label Menu', () => {
          it('Should open the CreateLabelMenu and create a label', function(done){
            this.timeout((1000 * 60));
            this.browser.visit('/boards/101/cards/90');
            this.browser.wait(until.elementLocated(By.css('.CardModal-Controls-label > button'), 2000)).click();
            this.browser.wait(until.elementLocated(By.className('LabelMenu-button')), 2000).click();
            this.browser.wait(until.elementLocated(By.className('LabelMenu-CreateLabelPanel'), 2000));
            this.browser.findElement(By.css('.LabelMenu-CreateLabelPanel-Form > input')).sendKeys('New Label');
            this.browser.findElement(By.xpath("//div[@color='#bc6858']")).click()
            this.browser.findElement(By.css('.LabelMenu-CreateLabelPanel-button')).click()
            this.browser.wait(until.elementLocated(By.xpath("//div[@class='CardLabel-text' and text()='New Label']")), 2000)
            this.browser.then(_ => done());
          })
        })

        describe('Clicking on a card label should open the Label Menu', () => {
          it('Should remove a label from the card when the label is clicked from the Menu', function(done){
            this.timeout((1000 * 60));
            this.browser.visit('/boards/101/cards/90');
            this.browser.wait(until.elementLocated(By.className('CardModal-CardLabels-labels-Label', 5000)));
            let cardLabel = this.browser.findElement(By.className('CardModal-CardLabels-labels-Label'), 5000);
            this.browser.findElement(By.css('.CardModal-CardLabels-labels-Label > button'), 5000).click();
            this.browser.wait(until.elementLocated(By.className('LabelMenu')), 5000);
            this.browser.findElement(By.className('LabelMenu-LabelRow-box'), 5000).click();
            this.browser.wait(until.stalenessOf(cardLabel), 5000)
            this.browser.then(_ => done());
          })
        })
      })

    })
  })
})
