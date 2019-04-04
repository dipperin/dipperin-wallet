import { shallow } from 'enzyme'
import React from 'react'
import SmartContract from './index'
import mockRootBuilder from '@/tests/mocks/store'
import getMockRouterProps from '@/tests/mocks/router'

describe('SmartContract', () => {
  const mockRouterProps = getMockRouterProps({})
  const component = shallow(<SmartContract {...mockRouterProps} />)
  const root = mockRootBuilder(true)
  it('render', async () => {
    expect.assertions(1)
    await root.initWallet()
    expect(component.dive().find('div').length).toBeGreaterThan(0)
  })
})
