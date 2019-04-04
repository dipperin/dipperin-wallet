import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'

import i18n from '@/i18n/i18n'
import { mockStyleClasses } from '@/tests/utils'
import mockSwalFire from '@/tests/mocks/swal'

import styles from './progressStyle'
import { ProcessBar } from './index'

describe('ProcessBar', () => {
  const labels = i18n['zh-CN'].create.progressBar
  const classes = mockStyleClasses(styles)

  const mockProps = {
    labels,
    classes,
    pathname: '/test'
  }

  // let component: ReactWrapper
  let component: ShallowWrapper
  // let instance: BigAccountList

  beforeEach(() => {
    component = shallow(<ProcessBar {...mockProps} />)
    mockSwalFire.mockClear()
  })

  it('render', () => {
    expect(component.find('div').length).toBeGreaterThan(0)
  })
})
