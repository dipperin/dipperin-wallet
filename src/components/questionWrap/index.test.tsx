import { shallow } from 'enzyme'
import React from 'react'

import StyleQuestionWrap, { QuestionWrap } from './index'

describe('FormTitle', () => {
  const props = {
    title: 'test'
  }
  const component = shallow(<StyleQuestionWrap {...props} />)
  const questionWrap = component.dive().instance() as QuestionWrap
  it('render', () => {
    expect(component.exists()).toBe(true)
  })

  it('handleConfirm', () => {
    questionWrap.handleToggleOpen()
    expect(questionWrap.isOpen).toBe(true)
  })
})
