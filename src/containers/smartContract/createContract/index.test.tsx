import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'

import i18n from '@/i18n/i18n'
import mockRootBuilder from '@/tests/mocks/store'
import getMockRouterProps from '@/tests/mocks/router'
import { mockStyleClasses } from '@/tests/utils'
import mockSwalFire from '@/tests/mocks/swal'

import { Select, Input } from '@material-ui/core'

import { CreateContract } from './index'
import styles from './createContractStyle'

describe('favoriteContract', () => {
  const root = mockRootBuilder(true)
  const mockContract = root.contract
  const mockWallet = root.wallet
  const mockTransaction = root.transaction
  const mockAccount = root.account
  const labels = i18n['zh-CN'].contract.contract
  const classes = mockStyleClasses(styles)

  const mockRouterProps = getMockRouterProps({})
  const mockProps = {
    labels,
    classes,
    wallet: mockWallet,
    contract: mockContract,
    transaction: mockTransaction,
    account: mockAccount,
    ...mockRouterProps
  }

  let component: ShallowWrapper
  let instance: CreateContract

  beforeEach(() => {
    component = shallow(<CreateContract {...mockProps} />).dive()
    instance = component.instance() as CreateContract
    mockSwalFire.mockClear()
  })

  it('render', () => {
    expect(component.exists()).toBe(true)
  })

  it('change type/name/symbol/amount/decimal/fee', () => {
    component.find(Select).simulate('change', {
      target: {
        value: 'test'
      }
    })
    // instance.handleChangeType(mockE)
    expect(instance.type).toBe('test')
    component
      .find(Input)
      .first()
      .simulate('change', {
        target: {
          value: '1000'
        }
      })
    expect(instance.amount).toBe('1000')
    component
      .find(Input)
      .first()
      .simulate('change', {
        target: {
          value: '1001eeee'
        }
      })
    expect(instance.amount).toBe('1001')

    component
      .find(Input)
      .at(1)
      .simulate('change', {
        target: {
          value: 'test'
        }
      })
    expect(instance.name).toBe('test')

    component
      .find(Input)
      .at(2)
      .simulate('change', {
        target: {
          value: '3'
        }
      })
    expect(instance.decimal).toBe('3')

    component
      .find(Input)
      .at(3)
      .simulate('change', {
        target: {
          value: 'test'
        }
      })
    expect(instance.symbol).toBe('test')

    component
      .find(Input)
      .at(4)
      .simulate('change', {
        target: {
          value: '3'
        }
      })
    expect(instance.fee).toBe('3')
  })

  it('test handleGenContract', () => {
    const mockSetWaitConfirm = jest.spyOn(instance, 'setWaitConfirm')
    instance.handleGenContract()
    expect(mockSetWaitConfirm.mock.calls[0][0]).toBe(false)
    component.find(Select).simulate('change', {
      target: {
        value: 'test'
      }
    })
    component
      .find(Input)
      .at(0)
      .simulate('change', {
        target: {
          value: 'test'
        }
      })
    component
      .find(Input)
      .at(1)
      .simulate('change', {
        target: {
          value: 'test'
        }
      })
    component
      .find(Input)
      .at(2)
      .simulate('change', {
        target: {
          value: 'test'
        }
      })
    component
      .find(Input)
      .at(3)
      .simulate('change', {
        target: {
          value: 'test'
        }
      })
    const mockGetCreateContractFee = jest.fn().mockImplementation((name, symbol, amount, decimal) => 0.1)
    mockContract.getCreateContractFee = mockGetCreateContractFee
    instance.handleGenContract()
    expect(mockGetCreateContractFee.mock.calls[0][0]).toBe('test')
    expect(mockSetWaitConfirm.mock.calls[2][0]).toBe(true)
    expect(instance.minFee).toBe(0.1)
  })

  it('test handleConfirm fault', async () => {
    const mockPreventDefault = jest.fn()
    component
      .find(Input)
      .at(2)
      .simulate('change', {
        target: {
          value: '19'
        }
      })
    component.find('form').simulate('submit', {
      preventDefault: mockPreventDefault
    })
    expect(mockPreventDefault).toHaveBeenCalled()
    expect(mockSwalFire.mock.calls[0][0]).toEqual({
      title: labels.createSwal.decimalLength,
      type: 'error',
      showConfirmButton: false,
      timer: 1000
    })
  })
  it('test handleConfirm success', async () => {
    const mockPreventDefault = jest.fn()
    const mockhandleShowDialog = jest.spyOn(instance, 'handleShowDialog')
    component
      .find(Input)
      .at(2)
      .simulate('change', {
        target: {
          value: '17'
        }
      })
    component.find('form').simulate('submit', {
      preventDefault: mockPreventDefault
    })
    expect(mockPreventDefault).toHaveBeenCalled()
    expect(mockhandleShowDialog).toHaveBeenCalled()
  })

  it('test handleCloseDialog', () => {
    instance.handleCloseDialog()
    expect(instance.showDialog).toBe(false)
  })

  it('test handleShowDialog', () => {
    instance.handleShowDialog()
    expect(instance.showDialog).toBe(true)
  })

  it('switch to list', () => {
    const mockHistoryPush = jest.fn()
    mockRouterProps.history.push = mockHistoryPush
    instance.switchToList()
    expect(mockHistoryPush.mock.calls[0][0]).toBe('/main/contract/list/created')
  })

  it('set wait confirm', () => {
    instance.setWaitConfirm(true)
    expect(instance.waitConfirm).toBe(true)
    instance.setWaitConfirm(false)
    expect(instance.waitConfirm).toBe(false)
  })
})
