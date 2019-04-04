import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'

import getMockRouterProps from '@/tests/mocks/router'
import mockRootBuilder from '@/tests/mocks/store'

import { zhCN } from '@/i18n/i18n'

import { TransactionDetail } from './index'
import { mockStyleClasses } from '@/tests/utils'
import styles from './transactionDetailStyle'

describe('TransactionDetail', () => {
  const root = mockRootBuilder(true)
  const mockTransaction = root.transaction
  const mockRouterProps = getMockRouterProps<{ id: string }>({
    id: '0xf84236f25e504d51f698eba4a2fc562a2b3fcd9ecde058eab10a706d34dbdbf7'
  })
  let component: ShallowWrapper
  let instance: TransactionDetail

  beforeEach(() => {
    component = shallow(
      <TransactionDetail
        labels={zhCN.transaction.txDetail}
        transaction={mockTransaction}
        classes={mockStyleClasses(styles)}
        {...mockRouterProps}
      />
    ).dive()
    instance = component.instance() as TransactionDetail
  })

  // render
  it('render', () => {
    expect(component.find('div').length).toBeGreaterThan(0)
  })

  it('switchToList', () => {
    instance.switchToList()
    expect(mockRouterProps.history.push).toBeCalledWith('/main/wallet')
  })
})

describe('TransactionDetail', () => {
  const root = mockRootBuilder(true)
  const mockTransaction = root.transaction
  const mockRouterProps = getMockRouterProps<{ id: string }>({ id: '1' })
  let component: ShallowWrapper

  beforeEach(() => {
    component = shallow(
      <TransactionDetail
        labels={zhCN.transaction.txDetail}
        transaction={mockTransaction}
        classes={mockStyleClasses(styles)}
        {...mockRouterProps}
      />
    ).dive()
  })

  // render
  it('render with no data', () => {
    expect(component.find('div').length).toBe(0)
  })
})
