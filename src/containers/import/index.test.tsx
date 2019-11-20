import { shallow } from 'enzyme'
import React from 'react'

import i18n from '@/i18n/i18n'
import getMockRouterProps from '@/tests/mocks/router'
import mockRootBuilder from '@/tests/mocks/store'

import { Import, StyleImport } from './index'

describe('import', () => {
  const mockRouterProps = getMockRouterProps({})
  const root = mockRootBuilder(true)
  const mockWallet = root.wallet
  const mockLoading = root.loading
  const mockAccount = root.account
  const MockChangeLanguage = jest.fn()
  const component = shallow(
    <StyleImport
      wallet={mockWallet}
      loading={mockLoading}
      account={mockAccount}
      language={'zh-CN'}
      changeLanguage={MockChangeLanguage}
      labels={i18n['zh-CN'].wallet.import}
      {...mockRouterProps}
    />
  )

  const im = component
    .dive()
    .dive()
    .instance() as Import
  const mockSave = jest.spyOn(mockWallet, 'save')
  // const mockPush = jest.spyOn(mockRouterProps.history, 'push')

  it('render', () => {
    expect(
      component
        .dive()
        .dive()
        .find('div').length
    ).toBeGreaterThan(1)
  })

  it('passwordInput', () => {
    const e = {
      target: {
        value: 'value'
      }
    }
    im.passwordInput(e as any)
    expect(im.password).toBe('value')
  })

  it('repeatPasswordInput', () => {
    const e = {
      target: {
        value: 'value'
      }
    }
    im.repeatPasswordInput(e)
    expect(im.repeatPassword).toBe('value')
  })

  it('mnemonicInput', () => {
    const e = {
      target: {
        value: 'value'
      }
    }
    im.mnemonicInput(e)
    expect(im.mnemonic).toBe('value')
  })

  it('handleConfirm unverified', () => {
    const submitEvent = {
      preventDefault: () => null
    }
    im.handleConfirm(submitEvent)
    expect(mockSave).not.toBeCalled()
  })

  it('handleConfirm verified', async () => {
    const submitEvent = {
      preventDefault: () => null
    }
    im.mnemonic = 'unusual drastic patrol mansion fuel more obey acquire disagree head trip chat'
    im.password = '12345678'
    im.repeatPassword = '12345678'
    const mockCreate = jest.fn(async () => {
      return
    })
    mockWallet.create = mockCreate
    const res = await im.handleConfirm(submitEvent)
    expect(mockCreate).toBeCalled()
    expect(im.mnemonic).toBe('')
    expect(res).toBe(undefined)
  })
})
