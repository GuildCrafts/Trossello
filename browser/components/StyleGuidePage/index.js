import React, { Component } from 'react'
import BrandColorsSection from './BrandColorsSection'
import ButtonsSection from './ButtonsSection'
import CardSection from './CardSection'
import ContentFormSection from './ContentFormSection'
import IconsSection from './IconsSection'
import LinksSection from './LinksSection'
import SpinnerSection from './SpinnerSection'
import ConfirmationClickablesSection from './ConfirmationClickablesSection'
import TimeFromNowSection from './TimeFromNowSection'
import PopoverMenuButtonSection from './PopoverMenuButtonSection'
import ActionsMenuSection from './ActionsMenuSection'
import './index.sass'

export default class StyleGuidePage extends Component {
  render(){
    return <div className="StyleGuidePage">
      <h1>Style Guide</h1>
      <SpinnerSection />
      <ButtonsSection />
      <IconsSection />
      <LinksSection />
      <BrandColorsSection />
      <CardSection />
      <ContentFormSection />
      <TimeFromNowSection />
      <ConfirmationClickablesSection />
      <ActionsMenuSection />
      <PopoverMenuButtonSection />
    </div>
  }
}
