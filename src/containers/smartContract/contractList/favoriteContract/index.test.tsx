import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'

import i18n from '@/i18n/i18n'
import mockRootBuilder from '@/tests/mocks/store'
import getMockRouterProps from '@/tests/mocks/router'
import { mockStyleClasses } from '@/tests/utils'
import mockSwalFire from '@/tests/mocks/swal'

import { FavoriteContract } from './index'
import styles from './favoriteContractStyle'

describe('favoriteContract', () => {
  const root = mockRootBuilder(true)
  const mockContract = root.contract
  const mockWallet = root.wallet
  const labels = i18n['zh-CN'].contract.contract
  const classes = mockStyleClasses(styles)

  const mockRouterProps = getMockRouterProps({})
  const mockProps = {
    labels,
    classes,
    wallet: mockWallet,
    contract: mockContract,
    ...mockRouterProps
  }

  let component: ShallowWrapper
  let instance: FavoriteContract

  beforeEach(() => {
    component = shallow(<FavoriteContract {...mockProps} />).dive()
    instance = component.instance() as FavoriteContract
    mockSwalFire.mockClear()
  })

  it('render', () => {
    expect(component.exists()).toBe(true)
  })

  it('get  minIndex/maxIndex', () => {
    expect(instance.minIndex).toBe(0)
    expect(instance.maxIndex).toBe(9)
  })

  it('change add', () => {
    instance.pageChange(2)
    expect(instance.page).toBe(2)
  })

  it('test handleTransfer', () => {
    const mockHandleTransfer = jest.spyOn(instance, 'handleTransfer')
    const mockHistoryPush = jest.fn()
    mockRouterProps.history.push = mockHistoryPush
    instance.handleTransfer('0x-----')
    expect(mockHandleTransfer).toHaveBeenCalled()
    expect(mockHistoryPush).toHaveBeenCalled()
  })

  it('show/close showAdd dialog', () => {
    instance.handleShowAdd()
    expect(instance.showAdd).toBe(true)
    instance.handleCloseAddDialog()
    expect(instance.showAdd).toBe(false)
  })

  it('handleConfirmAdd success', async () => {
    const mockAddContract = jest.fn(async (address: string): Promise<boolean> => true)
    mockContract.addContract = mockAddContract
    const mockHandleCloseAddDialog = jest.spyOn(instance, 'handleCloseAddDialog')
    instance.forceUpdate()
    await instance.handleConfirmAdd('0x0001')
    expect(mockAddContract.mock.calls[0][0]).toBe('0x0001')
    // console.log(mockSwalFire.mock)
    expect(mockSwalFire.mock.calls[0][0]).toEqual({
      text: labels.addDialog.addSuccess,
      type: 'success',
      confirmButtonText: labels.addDialog.swalConfirm,
      timer: 1000
    })
    expect(mockHandleCloseAddDialog).toHaveBeenCalled()
  })

  it('handleConfirmAdd fault', async () => {
    const mockAddContract = jest.fn(async (address: string): Promise<boolean> => false)
    mockContract.addContract = mockAddContract
    const mockHandleCloseAddDialog = jest.spyOn(instance, 'handleCloseAddDialog')
    instance.forceUpdate()
    await instance.handleConfirmAdd('0x0001')
    expect(mockAddContract.mock.calls[0][0]).toBe('0x0001')
    // console.log(mockSwalFire.mock)
    expect(mockSwalFire).toHaveBeenCalled()
    expect(mockHandleCloseAddDialog).toHaveBeenCalled()
  })

  it('test handleShowTransfer/handleShowContractTx', () => {
    const mockHistoryPush = jest.fn()
    mockRouterProps.history.push = mockHistoryPush
    instance.handleShowTransfer('0x1')
    expect(mockHistoryPush.mock.calls[0][0]).toBe(`${mockRouterProps.match.path}/transfer/0x1`)
    instance.handleShowContractTx('0x1')
    expect(mockHistoryPush.mock.calls[1][0]).toBe(`${mockRouterProps.match.path}/tx/0x1`)
  })
})
