import { shallow } from 'enzyme'
import React from 'react'

import FormTitle from './index'

describe('FormTitle', () => {
  const component = shallow(<FormTitle title={'title'} jump={jest.fn()} />)
  it('render', () => {
    expect(component.dive().find('div').length).toBeGreaterThan(0)
  })
})
