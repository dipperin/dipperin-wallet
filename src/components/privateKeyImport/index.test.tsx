import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'

import i18n from '@/i18n/i18n'
// import mockRootBuilder from '@/tests/mocks/store'
// import getMockRouterProps from '@/tests/mocks/router'
import { mockStyleClasses } from '@/tests/utils'
import mockSwalFire from '@/tests/mocks/swal'

//
import { DialogConfirm } from './index'
import styles from './styles'

// function mockEvent(value: string): React.ChangeEvent<{ value: string }> {
//   return { target: { value } } as any
// }

// function MockCode(): React.ChangeEvent<HTMLInputElement> {
//   const obj = { name: 'token.wasm' }
//   // const blob = new Blob([ JSON.stringify(obj) ], {type : 'application/json'});
//   return { target: { files: obj } } as any
// }

// function MockAbi(): React.ChangeEvent<HTMLInputElement> {
//   const obj = { name: 'token.json' }
//   return { target: { files: obj } } as any
// }

// function MockFormEvent(): React.FormEvent {
//   const res = {
//     preventDefault: jest.fn()
//   }
//   return res as any
// }

describe('dialogConfirm', () => {
  // const root = mockRootBuilder(true)
  // const mockWallet = root.wallet
  // const mockAccount = root.account
  // const mockVmContract = root.vmContract
  // const labels = i18n['zh-CN'].contract.contract
  const classes = mockStyleClasses(styles)

  // const mockRouterProps = getMockRouterProps({ address: '0x001488Fb46F1a09274745d6022EF1A176bcD4C5a02Aa' })
  const mockProps = {
    classes,
    title: 'title',
    label: 'label',
    btnText: 'btnText',
    type: 'type',
    prk: 'key',
    swal: '111',
    onClose: jest.fn(),
    onConfirm: jest.fn(),
    tips: i18n['zh-CN'].account.accounts
  }

  let component: ShallowWrapper
  // let instance: DialogConfirm

  beforeEach(() => {
    component = shallow(<DialogConfirm {...mockProps} />)
    // instance = component.instance() as DialogConfirm
    mockSwalFire.mockClear()
  })

  it('render', () => {
    expect(component.exists()).toBe(true)
  })

  // it('handleChangePassword', () => {
  //   instance.handleChangePassword(mockEvent('value'))
  //   expect(instance.value).toBe('value')
  // })

  // it('handleConfirm', () => {
  //   const e = {
  //     preventDefault: () => undefined
  //   }
  //   instance.handleConfirm(e)
  //   expect(mockProps.onConfirm).toHaveBeenCalled()
  // })
})
