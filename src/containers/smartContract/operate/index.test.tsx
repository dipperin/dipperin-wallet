import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'

import i18n from '@/i18n/i18n'
import mockRootBuilder from '@/tests/mocks/store'
import getMockRouterProps from '@/tests/mocks/router'
import { mockStyleClasses } from '@/tests/utils'
import mockSwalFire from '@/tests/mocks/swal'

import { Operate } from './index'
import styles from './styles'

describe('operate', () => {
  const root = mockRootBuilder(true)
  const mockContract = root.contract
  const labels = i18n['zh-CN'].contract.contract
  const classes = mockStyleClasses(styles)

  const mockRouterProps = getMockRouterProps({ address: '0x', operate: 'xx' })
  const mockProps = {
    labels,
    classes,
    contract: mockContract,
    ...mockRouterProps
  }

  let component: ShallowWrapper
  let instance: Operate

  beforeEach(() => {
    component = shallow(<Operate {...mockProps} />).dive()
    instance = component.instance() as Operate
    mockSwalFire.mockClear()
  })

  it('render', () => {
    expect(component.exists()).toBe(true)
  })
  it('close', () => {
    const mockHistoryPush = jest.fn()
    mockRouterProps.history.push = mockHistoryPush
    instance.onClose()
    expect(mockHistoryPush).toHaveBeenCalled()
  })
})
