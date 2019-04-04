import { shallow } from 'enzyme'
import React from 'react'
import i18n from '@/i18n/i18n'

import { StylePasswordConfirm } from './index'

describe('FormTitle', () => {
  const mockClose = jest.fn()
  const mockConfirm = jest.fn()
  const props = {
    labels: i18n['en-US'].dialog.passwordDialog,
    onClose: mockClose,
    onConfirm: mockConfirm
  }
  const component = shallow(<StylePasswordConfirm {...props} />)
  // const passwordConfirm = component.dive().instance() as PasswordConfirm
  it('render', () => {
    expect(component.exists()).toBe(true)
  })

  // it('handleChangePassword', () => {
  //   const e = {
  //     target: {
  //       value: 1
  //     }
  //   }
  //   passwordConfirm.handleChangePassword(e)
  //   expect(passwordConfirm.password).toBe(1)
  // })

  // it('handleConfirm', () => {
  //   const e = {
  //     preventDefault: jest.fn()
  //   }
  //   passwordConfirm.handleConfirm(e)
  //   expect(mockConfirm.mock.calls[0][0]).toBe(1)
  // })
})
