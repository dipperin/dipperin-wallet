import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'

import { zhCN } from '@/i18n/i18n'
import getMockRouterProps from '@/tests/mocks/router'
import mockRootBuilder from '@/tests/mocks/store'
import { mockStyleClasses } from '@/tests/utils'

import styles from './createdContractStyle'
import { CreatedContract } from './index'

describe('CreatedContract', () => {
  const mockRouterProps = getMockRouterProps({})
  const root = mockRootBuilder(true)
  const mockWallet = root.wallet
  const mockContract = root.contract
  const classes = mockStyleClasses(styles)

  let component: ShallowWrapper
  let instance: CreatedContract

  beforeEach(() => {
    component = shallow(
      <CreatedContract
        labels={zhCN.contract.contract}
        wallet={mockWallet}
        contract={mockContract}
        classes={classes}
        {...mockRouterProps}
      />
    ).dive()
    // component = shallow(<StyleCreatedContract {...mockProps} />).dive()
    instance = component.instance() as CreatedContract
  })

  it('render', () => {
    expect(component.exists()).toBe(true)
  })

  it('get  minIndex/maxIndex', () => {
    expect(instance.minIndex).toBe(0)
    expect(instance.maxIndex).toBe(9)
  })

  it('pageChange', () => {
    instance.pageChange(2)
    expect(instance.page).toBe(2)
  })

  it('show transfer', () => {
    const mockHistoryPush = jest.fn()
    mockRouterProps.history.push = mockHistoryPush
    instance.handleShowTransfer('0x1')
    expect(mockHistoryPush.mock.calls[0][0]).toBe(`${mockRouterProps.match.path}/transfer/0x1`)
  })

  it('show contract tx', () => {
    const mockHistoryPush = jest.fn()
    mockRouterProps.history.push = mockHistoryPush
    instance.handleShowContractTx('0x1')
    expect(mockHistoryPush.mock.calls[0][0]).toBe(`${mockRouterProps.match.path}/tx/0x1`)
  })
})
