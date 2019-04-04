import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'

import { zhCN } from '@/i18n/i18n'
import getMockRouterProps from '@/tests/mocks/router'
import mockRootBuilder from '@/tests/mocks/store'
import styles from './transactionListStyle'
import { mockStyleClasses } from '@/tests/utils'

import { TransactionList } from './index'

describe('TransactionList', () => {
  const root = mockRootBuilder(true)
  const mockAccount = root.account
  const mockTransaction = root.transaction
  const classes = mockStyleClasses(styles)
  const mockRouterProps = getMockRouterProps<{}>({})
  const mockPorps = {
    labels: zhCN.transaction.txList,
    language: 'zh-CN',
    account: mockAccount,
    transaction: mockTransaction,
    classes,
    ...mockRouterProps
  }

  let component: ShallowWrapper
  let instance: TransactionList

  beforeEach(() => {
    component = shallow(<TransactionList {...mockPorps} />).dive()
    instance = component.instance() as TransactionList
  })

  // render
  it('render', () => {
    expect(component.find('div').length).toBeGreaterThan(0)
  })

  it('getMinIndex', () => {
    expect(instance.minIndex).toBe(0)
  })

  it('getMaxIndex', () => {
    expect(instance.maxIndex).toBe(9)
  })

  it('pageChange', () => {
    instance.pageChange(1)
    expect(instance.page).toBe(1)
  })

  it('jumpToDetail', () => {
    instance.jumpToDetail('000')
    expect(mockRouterProps.history.push).toBeCalledWith(`/main/wallet/000`)
  })
})
