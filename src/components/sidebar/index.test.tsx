import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'

import i18n from '@/i18n/i18n'
import mockRootBuilder from '@/tests/mocks/store'
import getMockRouterProps from '@/tests/mocks/router'
import { mockStyleClasses } from '@/tests/utils'
import mockSwalFire from '@/tests/mocks/swal'

//
import { Sidebar } from './index'
import styles from './sidebarStyle'

// function mockEvent(value: string): React.ChangeEvent<{ value: string }> {
//   return { target: { value } } as any
// }

describe('MenuButton', () => {
  const root = mockRootBuilder(true)
  // const mockWallet = root.wallet
  // const mockAccount = root.account
  // const mockVmContract = root.vmContract
  const labels = i18n['zh-CN'].wallet.sidebar
  const classes = mockStyleClasses(styles)
  const mockRoutes = {
    path: '/',
    sidebarName: 'wallet',
    navbarName: 'wallet',
    icon: 'icon',
    iconActive: 'string'
  }
  const mockRouterProps = getMockRouterProps({ address: '0x001488Fb46F1a09274745d6022EF1A176bcD4C5a02Aa' })
  const mockProps = {
    classes,
    labels,
    wallet: root.wallet,
    logo: 'logo',
    routes: [mockRoutes],
    // color: 'primary',
    image: 'image',
    ...mockRouterProps
  }

  let component: ShallowWrapper
  let instance: Sidebar

  beforeEach(() => {
    component = shallow(<Sidebar {...mockProps} />)
    instance = component.instance() as Sidebar
    mockSwalFire.mockClear()
  })

  it('render', () => {
    expect(component.exists()).toBe(true)
  })

  it('backToHome', () => {
    mockRouterProps.history.push = jest.fn()
    instance.backToHome()
    expect(mockRouterProps.history.push).toHaveBeenCalled()
  })

  it('drawerDisable', () => {
    expect(instance.drawerDisable('/wallet')).toBe(false)
  })

  // it('handleClose', ()=>{
  //   instance.handleClose()
  //   expect(instance.anchorEl).toBe(null)
  // })

  // it('handleShowTransfer', ()=>{
  //   instance.handleShowTransfer()
  //   expect(mockProps.showTransfer).toHaveBeenCalled()
  // })

  // it('handleShowContractTx', ()=>{
  //   instance.handleShowContractTx()
  //   expect(mockProps.showContractTx).toHaveBeenCalled()
  // })
})
