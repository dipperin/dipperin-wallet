import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'

// import i18n from '@/i18n/i18n'
import mockRootBuilder from '@/tests/mocks/store'
import getMockRouterProps from '@/tests/mocks/router'
import { mockStyleClasses } from '@/tests/utils'
import mockSwalFire from '@/tests/mocks/swal'
import ContractModel from '@/models/contract'

import { ContractTable, ContractItem } from './contractList'
import styles from './favoriteContractStyle'

describe('favoriteContract/contractList ContractTable', () => {
  const root = mockRootBuilder(true)
  const mockContract = root.contract.favoriteContract
  const classes = mockStyleClasses(styles)

  const mockRouterProps = getMockRouterProps({})
  const mockProps = {
    classes,
    contracts: mockContract,
    handleShowContractTx: jest.fn(),
    handleShowTransfer: jest.fn(),
    ...mockRouterProps
  }

  let component: ShallowWrapper

  beforeEach(() => {
    component = shallow(<ContractTable {...mockProps} />)
    mockSwalFire.mockClear()
  })

  it('render', () => {
    expect(component.exists()).toBe(true)
  })
})

describe('favoriteContract/contractList ContractItem', () => {
  // const root = mockRootBuilder(true)
  const mockContract = new ContractModel(
    'test',
    '1',
    '10',
    1,
    'ERC20',
    '0x0000eb288194F65163EaE668D923089A02175a7Af3e1',
    'success',
    '0x00100e99f3acc2864f153b4977FF2575d362209661AC',
    1549010635991,
    '0',
    '0xb86f4b67a32e8ddb6fd38a07a30702ae7515abae0248b7bbf0017af3c28359fa'
  )

  const classes = mockStyleClasses(styles)

  const mockRouterProps = getMockRouterProps({})
  const mockProps = {
    classes,
    contract: mockContract,
    handleShowContractTx: jest.fn(),
    handleShowTransfer: jest.fn(),
    ...mockRouterProps
  }

  let component: ShallowWrapper

  beforeEach(() => {
    // console.log(root.contract.contract)
    component = shallow(<ContractItem {...mockProps} />)
    mockSwalFire.mockClear()
  })

  it('render', () => {
    expect(component.exists()).toBe(true)
  })
})
