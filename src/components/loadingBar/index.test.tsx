import LoadingBar from './index'
import React from 'react'
import { shallow } from 'enzyme'
describe('LoadingBar', () => {
  const component = shallow(<LoadingBar />)
  const loadingBar = component.instance() as LoadingBar
  it('render', () => {
    expect(component.find('div').length).toBeGreaterThan(0)
  })

  it('shouldStart', () => {
    expect(LoadingBar.shouldStart({ loading: true }, {})).toBe(false)
  })

  it('shouldStop', () => {
    expect(LoadingBar.shouldStop({}, {})).toBe(false)
  })

  it('getDerivedStateFromProps', () => {
    expect(LoadingBar.getDerivedStateFromProps({}, {})).toBe(null)
    expect(LoadingBar.getDerivedStateFromProps({ loading: true }, { status: 'hidden' })).toEqual({ status: 'starting' })
    expect(LoadingBar.getDerivedStateFromProps({ loading: false }, { status: 'starting' })).toEqual({
      status: 'stopping'
    })
  })

  // it('start', () => {
  //   loadingBar.start()
  //   expect(loadingBar.state.status).toBe('running')
  // })

  it('stop', () => {
    loadingBar.stop()
    expect(loadingBar.state.percent).toBe(100)
    //   expect(loadingBar.state.status).toBe('hidden')
  })

  it('reset', () => {
    loadingBar.reset()
    expect(loadingBar.state.percent).toBe(0)
    expect(loadingBar.state.status).toBe('hidden')
  })

  it('newPercent', () => {
    const percent = 10
    const progressIncrease = 2
    expect(loadingBar.newPercent(percent, progressIncrease)).toBe(
      percent + progressIncrease * Math.cos(percent * (Math.PI / 2 / 100))
    )
  })

  it('simulateProgress', () => {
    loadingBar.simulateProgress()
    expect(loadingBar.state.percent).toBe(10)
  })

  it('isShown', () => {
    loadingBar.state.percent = 20
    expect(loadingBar.isShown()).toBe(true)
  })

  it('buildStyle', () => {
    const percent = 20
    loadingBar.state.percent = percent
    loadingBar.state.status = 'stopping'
    expect(loadingBar.buildStyle()).toEqual({
      backgroundColor: '#1b82d1',
      height: '3px',
      opacity: 1,
      position: 'absolute',
      transform: `scaleX(${percent / 100})`,
      transformOrigin: 'left',
      transition: `transform 100ms linear`,
      width: '100%',
      willChange: 'transform, opacity'
    })
  })
})
