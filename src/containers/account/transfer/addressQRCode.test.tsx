import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'

import getMockRouterProps from '@/tests/mocks/router'
import mockRootBuilder from '@/tests/mocks/store'
import { mockStyleClasses } from '@/tests/utils'
import mockSwal from '@/tests/mocks/swal'

import { AddressQRCode } from './addressQRCode'
import styles from './styles'
// import ContractModel from '@/models/contract'

import QRCode from 'qrcode'

jest.mock('qrcode', () => {
  return { toCanvas: jest.fn() }
})
const mockQRCode = QRCode

describe('Containers: account/transfer/addressQRCode', () => {
  const routerProps = getMockRouterProps({})
  const mockRoot = mockRootBuilder(true)
  const mockAccount = mockRoot.account
  const classes = mockStyleClasses(styles)

  const mockProps = {
    classes,
    account: mockAccount,
    address: 'test',
    isChinese: true,
    ...routerProps
  }

  let component: ShallowWrapper
  let instance: AddressQRCode

  beforeEach(() => {
    component = shallow(<AddressQRCode {...mockProps} />)
    instance = component.instance() as AddressQRCode
    mockSwal.mockClear()
    // mockQRCode.mockClear()
  })

  it('render', () => {
    expect(component.exists).toBeTruthy()
  })

  it('showQrcode true', () => {
    // console.log(mockQRCode)
    document.getElementById = jest.fn().mockReturnValue(true)
    // const event = { target: { value: 'newTo' } } as ChangeEvent<HTMLInputElement>
    instance.showQrcode('0x')
    expect(mockQRCode.toCanvas).toHaveBeenCalled()
    document.getElementById = jest.fn().mockReturnValue(false)
    mockQRCode.toCanvas.mockClear()
  })

  it('showQrcode false', () => {
    // console.log(mockQRCode)

    // const event = { target: { value: 'newTo' } } as ChangeEvent<HTMLInputElement>
    instance.showQrcode('false')
    expect(mockQRCode.toCanvas).not.toHaveBeenCalled()
    mockQRCode.toCanvas.mockClear()
  })

  it('copyAddress', () => {
    // console.log(mockQRCode)
    document.createElement = jest.fn().mockImplementation(() => {
      return { setAttribute: jest.fn(), select: jest.fn() }
    })
    document.body.appendChild = jest.fn()
    document.body.removeChild = jest.fn()
    document.execCommand = jest.fn().mockReturnValue(true)
    instance.copyAddress()
    expect(document.body.removeChild).toHaveBeenCalled()
  })
})
