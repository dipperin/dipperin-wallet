import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'

import i18n from '@/i18n/i18n'
import mockRootBuilder from '@/tests/mocks/store'
import getMockRouterProps from '@/tests/mocks/router'
import { mockStyleClasses } from '@/tests/utils'
import mockSwalFire from '@/tests/mocks/swal'
import { mockAbi } from '@/tests/testData/vmContract'
//
import { Call } from './index'
import styles from './styles'

describe('setting', () => {
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
  let instance: Call

  beforeEach(() => {
    component = shallow(<Call {...mockProps} />).dive()
    instance = component.instance() as Call
    mockSwalFire.mockClear()
  })

  it('render', () => {
    expect(component.exists()).toBe(true)
  })

  it('nameChange', () => {
    const mockEvent = {
      target: {
        value: 'func1'
      }
    }
    instance.nameChange(mockEvent)
    expect(instance.name).toBe('func1')
  })

  it('paramsChange', () => {
    const mockEvent = {
      target: {
        value: 'p1,p2,p3'
      }
    }
    instance.paramsChange(mockEvent)
    expect(instance.params).toBe('p1,p2,p3')
  })

  it('gasChange', () => {
    const mockEvent = {
      target: {
        value: '10000'
      }
    }
    instance.gasChange(mockEvent)
    expect(instance.gas).toBe('10000')
  })

  it('gasPriceChange', () => {
    const mockEvent = {
      target: {
        value: '1'
      }
    }
    instance.gasChange(mockEvent)
    expect(instance.gasPrice).toBe('1')
  })

  it('handleCall', async () => {
    root.vmContract.addContract(mockAbi, '0x001')
    mockRouterProps.match.params.address = '0x001'
    instance.abiChange(mockAbi)
    root.vmContract.confirmConstantCallContractMethod = jest.fn(async () => {
      return { success: true, info: '0x002' }
    })
    const res = await instance.handleCall('getBalance', '', true)
    expect(res).toEqual({ success: true, info: '0x002' })
  })

  it('handleCloseDialog', () => {
    instance.handleCloseDialog()
    expect(instance.showDialog).toBe(false)
  })

  it('handleShowDialog', () => {
    instance.handleShowDialog()
  })
})
