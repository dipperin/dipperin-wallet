import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'

import getMockRouterProps from '@/tests/mocks/router'

import { Setting } from './index'

describe('Containers: setting', () => {
  const routerProps = getMockRouterProps<{ address: string }>({ address: 'test' })

  const mockProps = {
    ...routerProps
  }

  let component: ShallowWrapper
  beforeEach(() => {
    component = shallow(<Setting {...mockProps} />)
  })

  it('render', () => {
    expect(component.exists).toBeTruthy()
  })
})
