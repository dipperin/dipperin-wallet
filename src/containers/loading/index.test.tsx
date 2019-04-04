import React from 'react'
import { shallow } from 'enzyme'

import mockRootBuilder from '@/tests/mocks/store'

import Loading from './index'

describe('Containers: Loading', () => {
  it('render', () => {
    const rootStore = mockRootBuilder(false)
    expect(() => {
      shallow(<Loading loading={rootStore.loading} />)
    }).not.toThrow()
  })
})
