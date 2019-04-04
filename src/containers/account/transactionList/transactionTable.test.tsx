import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'

// import { zhCN } from '@/i18n/i18n'
import getMockRouterProps from '@/tests/mocks/router'
// import mockRootBuilder from '@/tests/mocks/store'
import styles from './transactionListStyle'
import { mockStyleClasses } from '@/tests/utils'

import { TransactionTable, TransactionItem } from './transactionTable'

describe('TransactionTable', () => {
  // const root = mockRootBuilder(true)
  // const mockAccount = root.account
  // const mockTransaction = root.transaction
  const classes = mockStyleClasses(styles)
  const mockRouterProps = getMockRouterProps<{}>({})
  const mockPorps = {
    // labels: zhCN.transaction.txList,
    // language: 'zh-CN',
    // account: mockAccount,
    // transaction: mockTransaction,
    classes,
    transactions: [
      {
        transactionHash: '0x',
        status: 'string',
        from: 'string',
        to: 'string',
        value: 'string',
        statusLabel: 'string',
        detail: 'string',
        timestamp: 1
      }
    ],
    jumpToDetail: jest.fn(),
    ...mockRouterProps
  }

  let component: ShallowWrapper
  let instance: TransactionTable

  beforeEach(() => {
    component = shallow(<TransactionTable {...mockPorps} />)
    instance = component.instance() as TransactionTable
  })

  // render
  it('render', () => {
    expect(component.exists()).toBe(true)
  })

  it('jumpToDetail', () => {
    instance.jumpToDetail('TransactionTable')
    // console.log(mockPorps.jumpToDetail.mock.calls)
    expect(mockPorps.jumpToDetail.mock.calls[0][0]).toBe('TransactionTable')
    // mockPorps.jumpToDetail.mockClear()
  })
})

describe('TransactionItem', () => {
  // const root = mockRootBuilder(true)
  // const mockAccount = root.account
  // const mockTransaction = root.transaction
  // const classes = mockStyleClasses(styles)
  // const mockRouterProps = getMockRouterProps<{}>({})
  const classes = mockStyleClasses(styles)
  const mockRouterProps = getMockRouterProps<{}>({})
  const mockTransactionItemPorps = {
    classes,
    transaction: {
      transactionHash: 'TransactionItem',
      status: 'string',
      from: 'string',
      to: 'string',
      value: 'string',
      statusLabel: 'string',
      detail: 'string',
      timestamp: 1
    },
    jumpToDetail: jest.fn(),
    ...mockRouterProps
  }

  let componentItem: ShallowWrapper
  let instanceItem: TransactionItem

  beforeEach(() => {
    componentItem = shallow(<TransactionItem {...mockTransactionItemPorps} />)
    instanceItem = componentItem.instance() as TransactionItem
  })

  // render
  it('render', () => {
    expect(componentItem.exists()).toBe(true)
  })

  it('jumpToDetail', () => {
    instanceItem.jumpToDetail()
    // console.log(mockTransactionItemPorps.jumpToDetail.mock.calls)
    expect(mockTransactionItemPorps.jumpToDetail.mock.calls[0][0]).toBe('TransactionItem')
  })
})
