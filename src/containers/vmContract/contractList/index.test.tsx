import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'

import i18n from '@/i18n/i18n'
import mockRootBuilder from '@/tests/mocks/store'
import getMockRouterProps from '@/tests/mocks/router'
import { mockStyleClasses } from '@/tests/utils'
import mockSwalFire from '@/tests/mocks/swal'
// import { mockAbi } from '@/tests/testData/vmContract'
//
import { VmContractList } from './index'
import styles from './styles'

describe('contractList', () => {
  const root = mockRootBuilder(true)
  const mockWallet = root.wallet
  const mockVmContract = root.vmContract
  const labels = i18n['zh-CN'].contract.contract
  const classes = mockStyleClasses(styles)

  const mockRouterProps = getMockRouterProps({ address: '0x001488Fb46F1a09274745d6022EF1A176bcD4C5a02Aa' })
  const mockProps = {
    labels,
    classes,
    wallet: mockWallet,
    vmContract: mockVmContract,
    ...mockRouterProps
  }

  let component: ShallowWrapper
  let instance: VmContractList

  beforeEach(() => {
    component = shallow(<VmContractList {...mockProps} />).dive()
    instance = component.instance() as VmContractList
    mockSwalFire.mockClear()
  })

  it('render', () => {
    expect(component.exists()).toBe(true)
  })

  it('redirect', () => {
    const mockHistoryPush = jest.fn()
    mockRouterProps.history.push = mockHistoryPush
    instance.redirect()
    expect(mockHistoryPush).toHaveBeenCalled()
  })

  it('jumpToCall', () => {
    const mockHistoryPush = jest.fn()
    mockRouterProps.history.push = mockHistoryPush
    instance.jumpToCall('0x01', '0x02')
    expect(mockHistoryPush).toHaveBeenCalled()
  })

  it('jumpToCreate', () => {
    const mockHistoryPush = jest.fn()
    mockRouterProps.history.push = mockHistoryPush
    instance.jumpToCreate()
    expect(mockHistoryPush).toHaveBeenCalled()
  })

  it('jumpToDetail', () => {
    const mockHistoryPush = jest.fn()
    mockRouterProps.history.push = mockHistoryPush
    instance.jumpToDetail('0x001')
    expect(mockHistoryPush).toHaveBeenCalled()
  })
})
