import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'

import i18n from '@/i18n/i18n'
import { mockStyleClasses } from '@/tests/utils'
import mockSwalFire from '@/tests/mocks/swal'
//
import { FunctionCaller } from './index'
import styles from './styles'

function ChangeEvent(value: string): React.ChangeEvent<{ value: string }> {
  return { target: { value } } as any
}

describe('setting', () => {
  // const root = mockRootBuilder(true)
  const labels = i18n['zh-CN'].contract.contract
  const classes = mockStyleClasses(styles)
  const mockOnCall = jest.fn()

  // const mockRouterProps = getMockRouterProps({ address: '0x001488Fb46F1a09274745d6022EF1A176bcD4C5a02Aa' })
  // const mockProps = {
  //   labels,
  //   classes,
  //   wallet: mockWallet,
  //   vmContract: mockVmContract,
  //   ...mockRouterProps
  // }

  let component: ShallowWrapper
  let instance: FunctionCaller

  beforeEach(() => {
    const mockfunc = {
      name: 'getBalance',
      inputs: [
        {
          name: 'own',
          type: 'string'
        }
      ],
      outputs: [
        {
          name: '',
          type: 'uint64'
        }
      ],
      constant: 'true',
      type: 'function'
    }
    component = shallow(<FunctionCaller classes={classes} func={mockfunc} labels={labels} onCall={mockOnCall} />)
    instance = component.instance() as FunctionCaller
    mockSwalFire.mockClear()
  })

  it('render', () => {
    expect(component.exists()).toBe(true)
  })

  it('paramsChange', () => {
    const mockEvent = ChangeEvent('l,l,1000')
    instance.paramsChange(mockEvent)
    expect(instance.params).toBe('l,l,1000')
  })
})
