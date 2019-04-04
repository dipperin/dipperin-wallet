import { shallow } from 'enzyme'
import React from 'react'

import i18n from '@/i18n/i18n'
import getMockRouterProps from '@/tests/mocks/router'
import mockRootBuilder from '@/tests/mocks/store'

import { Create, StyleCreate } from './index'

describe('create', () => {
  const mockRouterProps = getMockRouterProps({})
  const root = mockRootBuilder(true)
  const mockWallet = root.wallet
  const component = shallow(
    <StyleCreate wallet={mockWallet} {...mockRouterProps} labels={i18n['zh-CN'].create.create} />
  )
  const create = component
    .dive()
    .dive()
    .instance() as Create

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
    create.passwordInput(e)
    expect(create.password).toBe('value')
  })

  it('repeatPasswordInput', () => {
    const e = {
      target: {
        value: 'value'
      }
    }
    create.repeatPasswordInput(e)
    expect(create.repeatPassword).toBe('value')
  })

  it('handleConfirm verified', () => {
    const e = {
      preventDefault: jest.fn()
    }
    const mockCreate = jest.spyOn(mockWallet, 'create')
    const mockPush = jest.spyOn(mockRouterProps.history, 'push')
    create.password = '12345678'
    create.repeatPassword = '12345678'
    create.handleConfirm(e)
    expect(e.preventDefault).toBeCalled()
    expect(mockCreate).toBeCalledWith('12345678')
    expect(mockPush).toBeCalledWith('/create/backup')
  })

  it('handleConfirm unverified', () => {
    const e = {
      preventDefault: jest.fn()
    }
    create.password = ''
    const spy = jest.spyOn(mockWallet, 'create')
    jest.spyOn(mockRouterProps.history, 'push')
    create.handleConfirm(e)
    expect(spy.mock.calls.length).toBe(1)
  })
})
