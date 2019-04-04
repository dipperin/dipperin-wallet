import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'

import i18n from '@/i18n/i18n'
import mockRootBuilder from '@/tests/mocks/store'
import getMockRouterProps from '@/tests/mocks/router'
import { mockStyleClasses } from '@/tests/utils'

import { ContractList } from './index'
import styles from './contractListStyle'

describe('ContractList', () => {
  const root = mockRootBuilder(true)
  const mockWallet = root.wallet
  const mockContract = root.contract
  const labels = i18n['zh-CN'].contract.contract
  const classes = mockStyleClasses(styles)

  const mockRouterProps = getMockRouterProps({})
  const mockProps = {
    wallet: mockWallet,
    contract: mockContract,
    labels,
    classes,
    ...mockRouterProps
  }

  let component: ShallowWrapper
  let instance: ContractList

  beforeEach(() => {
    component = shallow(<ContractList {...mockProps} />).dive()
    instance = component.instance() as ContractList
  })

  it('render', () => {
    expect(component.exists()).toBe(true)
  })

  it('jumpToCreated', () => {
    const mockJumpToCreated = jest.spyOn(instance, 'jumpToCreated')
    const mockHistoryPush = jest.fn()
    mockRouterProps.history.push = mockHistoryPush
    instance.jumpToCreated()
    expect(mockJumpToCreated).toHaveBeenCalled()
    expect(mockHistoryPush).toHaveBeenCalled()
  })

  it('jumpToFavorite', () => {
    const mockJumpToFavorite = jest.spyOn(instance, 'jumpToFavorite')
    const mockHistoryPush = jest.fn()
    mockRouterProps.history.push = mockHistoryPush
    instance.jumpToFavorite()
    expect(mockJumpToFavorite).toHaveBeenCalled()
    expect(mockHistoryPush).toHaveBeenCalled()
  })

  it('handleShowTransfer', () => {
    instance.handleShowTransfer('0x0000C878Cc9857474C7Ca9c956bD719e2919a34aa1A0')
    expect(instance.currentAddress).toEqual('0x0000C878Cc9857474C7Ca9c956bD719e2919a34aa1A0')
    expect(instance.showTransfer).toBe(true)
  })

  it('handleCloseTransfer', () => {
    instance.handleCloseTransfer()
    expect(instance.showTransfer).toBe(false)
  })

  it('handleShowContractTx', () => {
    instance.handleShowContractTx('0x0000C878Cc9857474C7Ca9c956bD719e2919a34aa1A0')
    expect(instance.currentAddress).toEqual('0x0000C878Cc9857474C7Ca9c956bD719e2919a34aa1A0')
    expect(instance.showContractTx).toBe(true)
  })

  it('handleCloseContractTx', () => {
    instance.handleCloseContractTx()
    expect(instance.showContractTx).toBe(false)
  })
})
