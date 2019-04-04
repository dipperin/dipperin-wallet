import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'

import mockRootBuilder from '@/tests/mocks/store'
import getMockRouterProps from '@/tests/mocks/router'
import mockSwalFire from '@/tests/mocks/swal'
import settings from '@/tests/mocks/settings'

import Main from './index'

describe('main', () => {
  const root = mockRootBuilder(true)
  const mockWallet = root.wallet

  const mockRouterProps = getMockRouterProps({})
  const mockProps = {
    wallet: mockWallet,
    ...mockRouterProps
  }

  let component: ShallowWrapper
  let instance: Main

  beforeEach(() => {
    component = shallow(<Main {...mockProps} />).dive()
    instance = component.instance() as Main
    mockSwalFire.mockClear()
  })

  it('render', () => {
    expect(component.exists()).toBe(true)
  })

  it('showAccountsPage', () => {
    const spyToogleAccountsPage = jest.spyOn(instance, 'toogleAccountsPage')
    instance.showAccountsPage()
    expect(spyToogleAccountsPage.mock.calls[0][0]).toBe(true)
  })

  it('handleClose', () => {
    const spyToogleAccountsPage = jest.spyOn(instance, 'toogleAccountsPage')
    instance.handleClose()
    expect(spyToogleAccountsPage.mock.calls[0][0]).toBe(false)
  })

  it('toogleAccountsPage', () => {
    instance.toogleAccountsPage(true)
    expect(instance.showAccounts).toBe(true)
  })

  it('toogleTransferPage', () => {
    const mockPush = jest.fn()
    mockProps.history.push = mockPush
    instance.toogleTransferPage(true)
    expect(mockPush.mock.calls[0][1]).toEqual({ isSend: true })
  })

  it('showGuide', () => {
    settings.get.mockClear()
    instance.showGuide()
    // console.log(settings.get.mock.calls)
    expect(settings.get.mock.calls[0][0]).toBe('showAccountGuide')
    expect(instance.showTour).toBe(true)
  })

  it('closeTour', () => {
    settings.set.mockClear()
    instance.closeTour()
    expect(instance.showTour).toBe(false)
    expect(settings.set.mock.calls[0][1]).toBe(true)
  })
})
