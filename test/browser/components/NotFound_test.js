import React from 'react'
const { expect, shallow, mount } = require('../../setup')
import NotFound from '../../../browser/components/NotFound'

describe("<NotFound />", () => {
  it("renders a single div", () => {
    const wrapper = shallow(<NotFound />)
    expect(wrapper.find('div')).to.have.length(1)
  })
  it("renders a `.NotFound`", () => {
    const wrapper = shallow(<NotFound />)
    expect(wrapper.find('.NotFound')).to.have.length(1)
  })
  it('renders children', () => {
    const wrapper = mount(<NotFound />)
    expect(wrapper.find('h1')).to.have.length(true)
    expect(wrapper.text()).to.equal('Page Not Found')
  })
})
