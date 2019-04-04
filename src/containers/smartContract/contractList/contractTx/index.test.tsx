import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'

import i18n from '@/i18n/i18n'
import mockRootBuilder from '@/tests/mocks/store'
import getMockRouterProps from '@/tests/mocks/router'
import { mockStyleClasses } from '@/tests/utils'

import { ContractTx } from './index'
import styles from './styles'

describe('ContractTx', () => {
  const root = mockRootBuilder(true)
  const mockContract = root.contract
  const labels = i18n['zh-CN'].contract.transferTx
  const classes = mockStyleClasses(styles)
  const mockAddress: string = '0x'

  const mockRouterProps = getMockRouterProps({ address: mockAddress })
  const mockProps = {
    labels,
    classes,
    address: mockAddress,
    contract: mockContract,
    ...mockRouterProps
  }

  let component: ShallowWrapper
  let instance: ContractTx

  beforeEach(() => {
    component = shallow(<ContractTx {...mockProps} />).dive()
    instance = component.instance() as ContractTx
  })

  it('render', () => {
    expect(component.exists()).toBe(true)
  })

  it('get  minIndex/maxIndex', () => {
    expect(instance.minIndex).toBe(0)
    expect(instance.maxIndex).toBe(9)
  })

  it('change page', () => {
    instance.pageChange(2)
    expect(instance.page).toBe(2)
  })

  it('close ContractTx', () => {
    const mockHistoryPush = jest.fn()
    mockRouterProps.history.push = mockHistoryPush
    instance.onClose()
    expect(mockHistoryPush).toHaveBeenCalled()
  })
})
