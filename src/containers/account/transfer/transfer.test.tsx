import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'

import { zhCN } from '@/i18n/i18n'
import getMockRouterProps from '@/tests/mocks/router'
import mockRootBuilder from '@/tests/mocks/store'
import styles from './styles'
import { mockStyleClasses } from '@/tests/utils'

import { Transfer } from './index'

describe('TransactionList', () => {
  const root = mockRootBuilder(true)
  const mockAccount = root.account
  const classes = mockStyleClasses(styles)
  const mockRouterProps = getMockRouterProps<{}>({})
  const mockPush = jest.spyOn(mockRouterProps.history, 'push')
  const mockPorps = {
    labels: zhCN.account.account,
    language: 'zh-CN',
    account: mockAccount,
    isSend: true,
    classes,
    ...mockRouterProps
  }

  let component: ShallowWrapper
  let instance: Transfer

  beforeEach(() => {
    component = shallow(<Transfer {...mockPorps} />).dive()
    instance = component.instance() as Transfer
  })

  // render
  it('render', () => {
    expect(component.find('div').length).toBeGreaterThan(0)
  })

  it('checkToCollenction', () => {
    instance.checkToCollenction()
    // expect(mockRouterProps.history.push.mock.calls[0][1]).toBe('')
    expect(mockPush.mock.calls[0][0]).toBe('')
    // expect(mockPush.mock.calls[0][1]).toEqual({ isSend: false })
  })

  it('checkToSend', () => {
    instance.checkToSend()
    expect(mockPush.mock.calls[1][0]).toBe('')
    // expect(mockPush.mock.calls[1][1]).toEqual({ isSend: true })
  })
})
