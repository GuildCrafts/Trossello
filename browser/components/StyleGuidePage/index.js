import React, { Component } from 'react'
import BrandColorsSection from './BrandColorsSection'
import ButtonsSection from './ButtonsSection'
import CardsSection from './CardsSection'
import ContentFormSection from './ContentFormSection'
import IconsSection from './IconsSection'
import LinksSection from './LinksSection'
import SpinnerSection from './SpinnerSection'
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
      <CardsSection />
      <ContentFormSection />
    </div>
  }
}
