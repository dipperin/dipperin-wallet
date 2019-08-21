import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'

import i18n from '@/i18n/i18n'
import mockRootBuilder from '@/tests/mocks/store'
import mockSwalFire from '@/tests/mocks/swal'
import { mockStyleClasses } from '@/tests/utils'
import { Input } from '@material-ui/core'
// import { Utils } from '@dipperin/dipperin.js'

import { Send } from './index'
import styles from './sendStyle'

describe('Containers: Send', () => {
  const root = mockRootBuilder(true)
  const mockWallet = root.wallet
  const mockTransaction = root.transaction
  const mockAccount = root.account
  const labels = i18n['zh-CN'].transaction.send
  const classes = mockStyleClasses(styles)

  const mockProps = {
    transaction: mockTransaction,
    wallet: mockWallet,
    account: mockAccount,
    labels,
    classes
  }

  let component: ShallowWrapper
  let instance: Send

  beforeEach(() => {
    // Use shallowWrapper.dive() at the top Instead of shallowWrapper.dive().someMethod,
    // Because this will cause the mock method to fail.
    component = shallow(<Send {...mockProps} />).dive()
    instance = component.instance() as Send
    mockSwalFire.mockClear()
  })

  // it('verifyGetTxFee, Give a invalid account address', () => {
  //   expect(instance.verifyGetTxFee('10000', '0x1432423', '100')).toEqual(labels.swal.invalidAddress)
  // })

  // it('verifyGetTxFee, Give a contract address', () => {
  //   expect(instance.verifyGetTxFee('10000', '0x00109328d55ccb3fce531f199382339f0e576ee840b2', '10000')).toEqual(
  //     labels.swal.invalidAddress
  //   )
  // })

  // it('verifyGetTxFee, Not enough balance', () => {
  //   expect(instance.verifyGetTxFee('10000', '0x00009328d55ccb3fce531f199382339f0e576ee840b2', '100')).toEqual(
  //     labels.swal.insufficientFunds
  //   )
  // })

  // it('verifyGetTxFee, Correct', () => {
  //   expect(
  //     instance.verifyGetTxFee('10000', '0x00009328d55ccb3fce531f199382339f0e576ee840b2', Utils.toUnit('10000'))
  //   ).toEqual(undefined)
  // })

  it('addressChange', () => {
    const mockAddressChange = jest.spyOn(instance, 'addressChange')
    instance.forceUpdate()
    const mockEvent = {
      target: {
        value: '0x00009328d55ccb3fce531f199382339f0e576ee840b2'
      }
    }
    component
      .find(Input)
      .first()
      .simulate('change', mockEvent)
    expect(mockAddressChange).toHaveBeenCalled()
    expect(mockAddressChange.mock.calls[0][0]).toEqual(mockEvent)
    expect(instance.address).toEqual('0x00009328d55ccb3fce531f199382339f0e576ee840b2')
  })

  it('amountChange', () => {
    const mockAmountChange = jest.spyOn(instance, 'amountChange')
    instance.forceUpdate()
    const mockEvent = {
      target: {
        value: '10000'
      }
    }

    component
      .find(Input)
      .at(1)
      .simulate('change', mockEvent)
    expect(mockAmountChange).toHaveBeenCalled()
    expect(mockAmountChange.mock.calls[0][0]).toEqual(mockEvent)
  })

  it('memoChange', () => {
    const mockMemoChange = jest.spyOn(instance, 'memoChange')
    instance.forceUpdate()
    const mockEvent = {
      target: {
        value: 'text'
      }
    }

    component
      .find(Input)
      .at(2)
      .simulate('change', mockEvent)
    expect(mockMemoChange).toHaveBeenCalled()
    expect(mockMemoChange.mock.calls[0][0]).toEqual(mockEvent)
  })

  it('handleGetTxFee, Cannot submit without filling in address and balance', () => {
    component
      .find(Input)
      .at(2)
      .simulate('blur')
    expect(instance.waitConfirm).toEqual(false)
  })

  it('handleSend, Enter an invalid amount', () => {
    const mockHandleSend = jest.spyOn(instance, 'handleSend')
    const preventDefault = jest.fn()
    instance.forceUpdate()
    instance.address = '0x00009328d55ccb3fce531f199382339f0e576ee840b2'
    instance.amount = '10f'
    // instance.minFee = '0.01'
    // instance.fee = '0.1'
    instance.waitConfirm = true
    component
      .find('form')
      .first()
      .simulate('submit', {
        preventDefault
      })
    expect(preventDefault).toHaveBeenCalled()
    expect(mockHandleSend).toHaveBeenCalled()
    expect(mockSwalFire.mock.calls[0][0]).toEqual(labels.swal.invalidAmount)
  })

  it('handleSend, Enter an invalid fee', () => {
    const mockHandleSend = jest.spyOn(instance, 'handleSend')
    const preventDefault = jest.fn()
    instance.forceUpdate()
    instance.address = '0x00009328d55ccb3fce531f199382339f0e576ee840b2'
    instance.amount = '10'
    instance.gasPrice = '1'
    // instance.fee = '0.1f'
    instance.waitConfirm = true
    component
      .find('form')
      .first()
      .simulate('submit', {
        preventDefault
      })
    expect(preventDefault).toHaveBeenCalled()
    expect(mockHandleSend).toHaveBeenCalled()
    // expect(mockSwalFire.mock.calls[0][0]).toEqual(labels.swal.invalidFee)
  })

  it('handleSend, Correct', () => {
    const mockHandleSend = jest.spyOn(instance, 'handleSend')
    const preventDefault = jest.fn()
    instance.forceUpdate()
    instance.address = '0x00009328d55ccb3fce531f199382339f0e576ee840b2'
    instance.amount = '10'
    // instance.minFee = '0.01'
    // instance.fee = '0.1'
    instance.waitConfirm = true
    component
      .find('form')
      .first()
      .simulate('submit', {
        preventDefault
      })
    expect(preventDefault).toHaveBeenCalled()
    expect(mockHandleSend).toHaveBeenCalled()
    expect(instance.showDialog).toEqual(true)
  })

  it('dialogConfirm, fail', async () => {
    const mockHandleDialogConfirm = jest.spyOn(instance, 'dialogConfirm')
    instance.forceUpdate()
    mockWallet.checkPassword = jest.fn().mockImplementation(async () => false)
    await instance.dialogConfirm('123')
    expect(mockHandleDialogConfirm).toHaveBeenCalled()
    expect(mockSwalFire.mock.calls[0][0].title).toEqual(labels.swal.incorrectPassword)
  })

  it('dialogConfirm, success', async () => {
    const mockHandleDialogConfirm = jest.spyOn(instance, 'dialogConfirm')
    const mockSend = jest.fn()
    instance.send = mockSend
    instance.forceUpdate()
    mockWallet.checkPassword = jest.fn().mockImplementation(async () => true)
    await instance.dialogConfirm('123')
    expect(mockHandleDialogConfirm).toHaveBeenCalled()
    expect(mockSend).toHaveBeenCalled()
  })

  it('send, fail', async () => {
    const mockHandleCloseDialog = jest.spyOn(instance, 'handleCloseDialog')
    instance.forceUpdate()
    mockTransaction.confirmTransaction = jest.fn(async () => ({ success: false }))
    await instance.send()
    expect(mockHandleCloseDialog).toHaveBeenCalled()
    expect(mockSwalFire.mock.calls[0][0].title).toEqual(labels.swal.fail)
  })

  it('send, success', async () => {
    const mockHandleCloseDialog = jest.spyOn(instance, 'handleCloseDialog')
    instance.forceUpdate()
    mockTransaction.confirmTransaction = jest.fn(async () => ({
      success: true
    }))
    await instance.send()
    expect(mockHandleCloseDialog).toHaveBeenCalled()
    expect(mockSwalFire.mock.calls[0][0].text).toEqual(labels.swal.success)
  })
})
