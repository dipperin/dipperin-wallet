import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'

import i18n from '@/i18n/i18n'
import mockRootBuilder from '@/tests/mocks/store'
import getMockRouterProps from '@/tests/mocks/router'
import mockSwalFire from '@/tests/mocks/swal'
// import settings from '@/tests/mocks/settings'

import { MainTour } from './mainTour'

describe('MainTour', () => {
  const root = mockRootBuilder(true)
  const mockWallet = root.wallet
  const labels = i18n['zh-CN'].wallet.accountTour

  const mockRouterProps = getMockRouterProps({})
  const mockProps = {
    labels,
    wallet: mockWallet,
    closeTour: jest.fn(),
    toogleAccountsPage: jest.fn(),
    toogleTransferPage: jest.fn(),
    ...mockRouterProps
  }

  let component: ShallowWrapper
  let instance: MainTour

  beforeEach(() => {
    component = shallow(<MainTour {...mockProps} />)
    instance = component.instance() as MainTour
    mockSwalFire.mockClear()
    mockProps.toogleAccountsPage.mockClear()
    mockProps.toogleTransferPage.mockClear()
  })

  it('render', () => {
    expect(component.exists()).toBe(true)
  })

  it('handNextStep 0', () => {
    instance.handNextStep()
    expect(mockProps.toogleAccountsPage.mock.calls[0][0]).toBe(true)
    expect(instance.step).toBe(1)
  })

  it('handNextStep 1', () => {
    instance.handNextStep()
    instance.handNextStep()
    expect(instance.step).toBe(2)
  })

  it('handNextStep 2', () => {
    instance.handNextStep()
    instance.handNextStep()
    instance.handNextStep()
    expect(mockProps.toogleAccountsPage.mock.calls[1][0]).toBe(false)
  })

  it('handNextStep 3', () => {
    instance.handNextStep()
    instance.handNextStep()
    instance.handNextStep()
    instance.handNextStep()
    expect(mockProps.toogleTransferPage.mock.calls[0][0]).toBe(false)
  })

  it('handNextStep 4', () => {
    instance.handNextStep()
    instance.handNextStep()
    instance.handNextStep()
    instance.handNextStep()
    instance.handNextStep()
    expect(mockProps.closeTour).toHaveBeenCalled()
  })

  it('handPrestep 0', () => {
    instance.handPreStep()
    expect(instance.step).toBe(0)
  })

  it('handPrestep 1', () => {
    instance.handNextStep()
    instance.handPreStep()
    expect(mockProps.toogleAccountsPage.mock.calls[1][0]).toBe(false)
    expect(instance.step).toBe(0)
  })

  it('handPrestep 2', () => {
    instance.handNextStep()
    instance.handNextStep()
    instance.handPreStep()
    expect(instance.step).toBe(1)
  })

  it('handPrestep 3', () => {
    instance.handNextStep()
    instance.handNextStep()
    instance.handNextStep()
    instance.handPreStep()
    expect(mockProps.toogleAccountsPage.mock.calls[2][0]).toBe(true)
    expect(instance.step).toBe(2)
  })

  it('handPrestep 4', () => {
    instance.handNextStep()
    instance.handNextStep()
    instance.handNextStep()
    instance.handNextStep()
    instance.handPreStep()
    expect(mockProps.toogleTransferPage.mock.calls[1][0]).toBe(true)
    expect(instance.step).toBe(3)
  })
})
