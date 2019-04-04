import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'

import i18n from '@/i18n/i18n'
import getMockRouterProps from '@/tests/mocks/router'
import mockRootBuilder from '@/tests/mocks/store'
import { mockStyleClasses } from '@/tests/utils'
import mockSwalFire from '@/tests/mocks/swal'

import { TransferFrom } from './index'
import styles from './styles'
// import ContractModel from '@/models/contract'

describe('Containers: smartContract/operate/transferForm', () => {
  const routerProps = getMockRouterProps<{ address: string }>({ address: 'test' })
  const mockRoot = mockRootBuilder()
  const mockContract = mockRoot.contract
  const mockWallet = mockRoot.wallet
  const classes = mockStyleClasses(styles)
  const labels = i18n['zh-CN'].contract.transferFrom

  const mockProps = {
    ...routerProps,
    contract: mockContract,
    wallet: mockWallet,
    labels,
    classes
  }

  let component: ShallowWrapper
  let instance: TransferFrom
  beforeEach(() => {
    component = shallow(<TransferFrom {...mockProps} />).dive()
    instance = component.instance() as TransferFrom
    mockSwalFire.mockClear()
  })

  it('render', () => {
    expect(component.exists).toBeTruthy()
  })

  it('toChange', () => {
    instance.toChange({ target: { value: 'newTo' } } as React.ChangeEvent<HTMLInputElement>)
    expect(instance.to).toBe('newTo')
  })

  it('amountChange', () => {
    instance.amountChange({ target: { value: 'newAmount' } } as React.ChangeEvent<HTMLInputElement>)
    expect(instance.amount).toBe('newAmount')
  })

  it('handleOwnerAddressChange', () => {
    instance.handleOwnerAddressChange({
      target: { value: '0x0x0000b4293d60F051936beDecfaE1B85d5A46d377aF37' }
    } as React.ChangeEvent<HTMLSelectElement>)
    expect(instance.selectedOwner).toBe('0x0x0000b4293d60F051936beDecfaE1B85d5A46d377aF37')
  })

  it('verifyInputs insufficientFunds', () => {
    const data = instance.verifyInputs(12, '15', '0x', labels)
    expect(data).toBe(labels.swal.insufficientFunds)
  })

  it('verifyInputs invalidAddress', () => {
    const mockAddress = '0x0x0000b4293d60F051936beDecfaE1B85d5A46d377aF37'
    const data = instance.verifyInputs(100, '10', mockAddress, labels)
    expect(data).toBe(labels.swal.invalidAddress)
  })

  it('handleConfirm error', () => {
    const mockPreventDefault = jest.fn()
    const mockEvent = {
      preventDefault: mockPreventDefault
    }
    const mockVerifyInputs = jest.spyOn(instance, 'verifyInputs')
    const mockHandleShowDialog = jest.spyOn(instance, 'handleShowDialog')
    routerProps.match.params.address = '0x00100e99f3acc2864f153b4977FF2575d362209661AC'
    instance.amountChange({ target: { value: '18' } } as React.ChangeEvent<HTMLInputElement>)
    const event = { target: { value: '0x0000b4293d60F051936beDecfaE1B85d5A46d377aF37' } } as React.ChangeEvent<
      HTMLInputElement
    >
    instance.toChange(event)
    instance.handleConfirm(mockEvent)
    expect(mockPreventDefault).toHaveBeenCalled()
    expect(mockVerifyInputs).toHaveBeenCalled()
    expect(mockHandleShowDialog).not.toHaveBeenCalled()
  })

  it('handleConfirm success', () => {
    const mockPreventDefault = jest.fn()
    const mockEvent = {
      preventDefault: mockPreventDefault
    }
    const mockVerifyInputs = jest.spyOn(instance, 'verifyInputs')
    const mockHandleShowDialog = jest.spyOn(instance, 'handleShowDialog')
    instance.handleConfirm(mockEvent)
    expect(mockPreventDefault).toHaveBeenCalled()
    expect(mockVerifyInputs).toHaveBeenCalled()
    expect(mockHandleShowDialog).toHaveBeenCalled()
  })
  // it('test handleConfirm',()=>{
  //   const mockPreventDefault = jest.fn()
  //   const mockE = {
  //     preventDefault: mockPreventDefault
  //   }

  //   mockContract.contract.set('0x001',new ContractModel('1','2','3'))
  //   instance.handleConfirm(mockE)
  //   expect(mockSwalFire).toHaveBeenCalled()
  // })

  it('dialogConfirm incorrectPassword', async () => {
    // mockProps.match.params.address = '0x00100e99f3acc2864f153b4977FF2575d362209661AC'
    // mockContract.transferFromToken = jest.fn(()=>true)
    instance.dialogConfirm('12345678')
    expect(mockSwalFire.mock.calls[0][0].title).toBe(labels.swal.incorrectPassword)
  })

  it('dialogConfirm transferSuccess', async () => {
    mockProps.match.params.address = '0x00100e99f3acc2864f153b4977FF2575d362209661AC'
    mockContract.transferFromToken = jest.fn().mockImplementation(() => {
      return { success: true }
    })
    mockWallet.checkPassword = jest.fn(() => true)
    await instance.dialogConfirm('12345678')
    expect(mockContract.transferFromToken).toHaveBeenCalled()
    expect(mockSwalFire.mock.calls[0][0].title).toBe(labels.swal.transferSuccess)
  })

  it('dialogConfirm transferSuccess', async () => {
    mockProps.match.params.address = '0x00100e99f3acc2864f153b4977FF2575d362209661AC'
    mockContract.transferFromToken = jest.fn().mockImplementation(() => {
      return { success: false }
    })
    mockWallet.checkPassword = jest.fn(() => true)
    await instance.dialogConfirm('12345678')
    expect(mockContract.transferFromToken).toHaveBeenCalled()
    expect(mockSwalFire.mock.calls[0][0].title).toBe(labels.swal.transferFail)
  })

  it('handleCloseDialog', () => {
    instance.handleCloseDialog()
    expect(instance.showDialog).toBe(false)
  })

  it('handleShowDialog', () => {
    instance.handleShowDialog()
    expect(instance.showDialog).toBe(true)
  })

  it('onClose', () => {
    const mockHistoryPush = jest.fn()
    routerProps.history.push = mockHistoryPush
    instance.onClose()
    expect(mockHistoryPush).toHaveBeenCalled()
  })

  it('test updateAllowance fault', () => {
    const mockGetAllowance = jest.fn().mockImplementation((address, ownerAddress) => 1)
    mockContract.getAllowance = mockGetAllowance
    const mockSetAllowance = jest.spyOn(instance, 'setAllowance')
    instance.updateAllowance('')
    expect(mockGetAllowance).not.toHaveBeenCalled()
    expect(mockSetAllowance).not.toHaveBeenCalled()
  })

  it('test updateAllowance fault', () => {
    const mockGetAllowance = jest.fn().mockImplementation((address, ownerAddress) => 1)
    mockContract.getAllowance = mockGetAllowance
    const mockSetAllowance = jest.spyOn(instance, 'setAllowance')
    instance.updateAllowance('')
    expect(mockGetAllowance).not.toHaveBeenCalled()
    expect(mockSetAllowance).not.toHaveBeenCalled()
  })

  // it('test handleShowAddConfirm insufficientFunds',()=>{
  //   instance.handleConfirmAdd('0x000')
  //   expect(mockSwalFire.mock.calls[0][0]).toEqual({
  //     title: labels.swal.insufficientFunds,
  //     type: 'error',
  //     buttons: [false, false],
  //     timer: 1000
  //   })
  // })

  it('handleShowAddConfirm', () => {
    instance.handleShowAddConfirm()
    expect(instance.showAdd).toBe(true)
  })

  it('handleCloseAddDialog', () => {
    instance.handleCloseDialog()
    expect(instance.showAdd).toBe(false)
  })

  it('handleConfirmAdd insufficientFunds', () => {
    instance.handleConfirmAdd('Fault Address')
    // console.log(labels.swal.insufficientFunds,mockSwalFire.mock.calls[0])
    expect(mockSwalFire.mock.calls[0][0].title).toBe(labels.swal.insufficientFunds)
  })

  it('handleConfirmAdd success', () => {
    instance.handleConfirmAdd('0x0000b4293d60F051936beDecfaE1B85d5A46d377aF37')
    expect(instance.ownerAddress).toContain('0x0000b4293d60F051936beDecfaE1B85d5A46d377aF37')
    expect(instance.showAdd).toBe(false)
  })

  it('handleConfirmAdd addressAleadyExist', () => {
    instance.handleConfirmAdd('0x0000b4293d60F051936beDecfaE1B85d5A46d377aF37')
    instance.handleConfirmAdd('0x0000b4293d60F051936beDecfaE1B85d5A46d377aF37')
    expect(mockSwalFire.mock.calls[0][0].title).toBe(labels.swal.addressAleadyExist)
  })

  it('setOwnerAddress', () => {
    instance.setOwnerAddress(['0x0000b4293d60F051936beDecfaE1B85d5A46d377aF37'])
    expect(instance.ownerAddress).toEqual(['0x0000b4293d60F051936beDecfaE1B85d5A46d377aF37'])
  })

  it('setAllowance', () => {
    instance.setAllowance('100')
    expect(instance.allowance).toBe('100')
  })
})
