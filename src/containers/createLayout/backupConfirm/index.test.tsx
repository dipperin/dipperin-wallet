import { shallow } from 'enzyme'
import { observable } from 'mobx'
import React from 'react'

import i18n from '@/i18n/i18n'
import getMockRouterProps from '@/tests/mocks/router'
import mockRootBuilder from '@/tests/mocks/store'

import { BackupConfirm, ClickWord, SelectedWord, StyleBackupConfirm } from './index'

describe('backupConfirm', () => {
  const routerProps = getMockRouterProps<{}>({})
  const root = mockRootBuilder(true)
  const mockWallet = root.wallet
  const component = shallow(
    <StyleBackupConfirm labels={i18n['en-US'].create.backupConfirm} wallet={mockWallet} {...routerProps} />
  )
  const backupConfirm = component
    .dive()
    .dive()
    .instance() as BackupConfirm
  it('render', () => {
    expect(
      component
        .dive()
        .dive()
        .find('div').length
    ).toBeGreaterThan(1)
  })

  it('clickWord', () => {
    backupConfirm.clickWords = observable([{ word: 'word', selected: true }])
    backupConfirm.clickWord('word', 0)
    expect(backupConfirm.clickWords[0].selected).toBe(true)
    expect(backupConfirm.selectedWords.length).toBe(1)
  })

  it('removeWord', () => {
    backupConfirm.removeWord('word')
    expect(backupConfirm.clickWords[0].selected).toBe(false)
    expect(backupConfirm.selectedWords.length).toBe(0)
  })

  it('handleDone error', () => {
    backupConfirm.handleDone()
    jest.spyOn(mockWallet, 'save')
    expect(mockWallet.save).not.toBeCalled()
  })

  it('handleDone success', () => {
    backupConfirm.selectedWords = observable(['word'])
    backupConfirm.correctWords = observable(['word'])
    backupConfirm.handleDone()
    expect(backupConfirm.open).toBe(true)
  })
})

describe('SelectedWord', () => {
  const onClick = jest.fn()
  const word: string = 'word'
  const component = shallow(<SelectedWord onClick={onClick} word={word} />)
  const selectedWords = component.instance() as SelectedWord

  it('render', () => {
    expect(component.find('span').length).toBe(1)
  })

  it('handleClick', () => {
    selectedWords.handleClick()
    expect(onClick).toBeCalledWith(word)
  })
})

describe('ClickWord', () => {
  const onClick = jest.fn()
  const isSelected: boolean = true
  const word: string = 'word'
  const index: number = 0
  const component = shallow(
    <ClickWord className="" onClick={onClick} word="word" index={index} isSelected={isSelected} />
  )
  const clickWord = component.instance() as ClickWord

  it('render', () => {
    expect(component.find('span').length).toBe(1)
  })

  it('handleClick', () => {
    clickWord.handleClick()
    expect(onClick).toBeCalledWith(word, index)
  })
})
