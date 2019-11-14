import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'

import i18n from '@/i18n/i18n'
// import mockRootBuilder from '@/tests/mocks/store'
// import getMockRouterProps from '@/tests/mocks/router'
import { mockStyleClasses } from '@/tests/utils'
import mockSwalFire from '@/tests/mocks/swal'

//
import { MenuButton } from './index'
import styles from './styles'

// function mockEvent(value: string): React.ChangeEvent<{ value: string }> {
//   return { target: { value } } as any
// }

describe('MenuButton', () => {
  // const root = mockRootBuilder(true)
  // const mockWallet = root.wallet
  // const mockAccount = root.account
  // const mockVmContract = root.vmContract
  const labels = i18n['zh-CN'].contract.menu
  const classes = mockStyleClasses(styles)

  // const mockRouterProps = getMockRouterProps({ address: '0x001488Fb46F1a09274745d6022EF1A176bcD4C5a02Aa' })
  const mockProps = {
    classes,
    labels,
    address: '0x001',
    className: 'botton',
    showTransfer: jest.fn(),
    showContractTx: jest.fn()
  }

  let component: ShallowWrapper
  let instance: MenuButton

  beforeEach(() => {
    component = shallow(<MenuButton {...mockProps} />)
    instance = component.instance() as MenuButton
    mockSwalFire.mockClear()
  })

  it('render', () => {
    expect(component.exists()).toBe(true)
  })

  it('handleShowMenu', () => {
    const e = {
      currentTarget: {}
    } as React.MouseEvent
    instance.handleShowMenu(e)
    expect(instance.anchorEl).toEqual({})
  })

  it('handleClose', () => {
    instance.handleClose()
    expect(instance.anchorEl).toBe(null)
  })

  it('handleShowTransfer', () => {
    instance.handleShowTransfer()
    expect(mockProps.showTransfer).toHaveBeenCalled()
  })

  it('handleShowContractTx', () => {
    instance.handleShowContractTx()
    expect(mockProps.showContractTx).toHaveBeenCalled()
  })
})
