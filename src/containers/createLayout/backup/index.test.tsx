import { shallow } from 'enzyme'
import React from 'react'

import i18n from '@/i18n/i18n'
import getMockRouterProps from '@/tests/mocks/router'
import mockRootBuilder from '@/tests/mocks/store'

import { Backup, StyleBackup } from './index'

describe('backup', () => {
  const routerProps = getMockRouterProps<{}>({})
  const replace = jest.fn()
  const push = jest.fn()
  const root = mockRootBuilder()
  const component = shallow(
    <StyleBackup
      wallet={root.wallet}
      labels={i18n['zh-CN'].create.backup}
      {...routerProps}
      history={{ ...routerProps.history, replace, push }}
    />
  )
  const backup = component
    .dive()
    .dive()
    .instance() as Backup
  it('render', () => {
    expect(
      component
        .dive()
        .dive()
        .find('div').length
    ).toBeGreaterThan(1)
  })
  it('componentDidMount', () => {
    expect(push.mock.calls[0][0]).toBe('/')
  })

  it('handleNext', () => {
    backup.handleNext()
    expect(replace).toBeCalledWith('/create/backup_confirm')
  })

  it('goBack', () => {
    backup.goBack()
    // TODO componentDidMount called many times
    expect(push.mock.calls[2][0]).toBe('/create')
  })
})
