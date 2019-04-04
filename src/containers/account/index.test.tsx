import { shallow } from 'enzyme'
import React from 'react'

import getMockRouterProps from '@/tests/mocks/router'
import { mockStyleClasses } from '@/tests/utils'

import Account from './index'
import styles from './accountStyle'

jest.mock('sweetalert2')

describe('Account', () => {
  const routerProps = getMockRouterProps<{ id: string }>({ id: '1' })
  const classes = mockStyleClasses(styles)
  const mockProps = {
    classes,
    ...routerProps
  }

  const component = shallow(<Account {...mockProps} />)

  it('render', () => {
    expect(component).toExist()
  })
})
