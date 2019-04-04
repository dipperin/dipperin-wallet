import React, { CSSProperties } from 'react'

export const UPDATE_TIME = 200
export const MAX_PROGRESS = 99
export const PROGRESS_INCREASE = 10
export const ANIMATION_DURATION = UPDATE_TIME * 4
export const TERMINATING_ANIMATION_DURATION = UPDATE_TIME / 2

export interface LoadingProps {
  className?: string
  loading?: boolean
  maxProgress?: number
  progressIncrease?: number
  showFastActions?: boolean
  updateTime?: number
  style?: CSSProperties
}

class LoadingBar extends React.Component<
  LoadingProps,
  {
    percent: number
    status: string
  }
> {
  static defaultProps: LoadingProps = {
    className: '',
    loading: false,
    maxProgress: MAX_PROGRESS,
    progressIncrease: PROGRESS_INCREASE,
    showFastActions: false,
    style: {},
    updateTime: UPDATE_TIME
  }

  static shouldStart(props, state) {
    return props.loading && ['hidden', 'stopping'].indexOf(state.status) >= 0
  }

  static shouldStop(props, state) {
    return !props.loading && ['starting', 'running'].indexOf(state.status) >= 0
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (LoadingBar.shouldStart(nextProps, prevState)) {
      return { status: 'starting' }
    }

    if (LoadingBar.shouldStop(nextProps, prevState)) {
      return { status: 'stopping' }
    }

    return null
  }

  state = {
    percent: 0,
    status: 'hidden'
  }

  progressIntervalId: any
  terminatingAnimationTimeoutId: any

  componentDidMount() {
    if (this.state.status === 'starting') {
      this.start()
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.status !== this.state.status) {
      if (this.state.status === 'starting') {
        this.start()
      }

      if (this.state.status === 'stopping') {
        this.stop()
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.progressIntervalId)
    clearTimeout(this.terminatingAnimationTimeoutId)
  }

  start() {
    this.progressIntervalId = setInterval(this.simulateProgress, this.props.updateTime)
    this.setState({ status: 'running' })
  }

  stop() {
    clearInterval(this.progressIntervalId)
    this.progressIntervalId = null

    const terminatingAnimationDuration =
      this.isShown() || this.props.showFastActions ? TERMINATING_ANIMATION_DURATION : 0

    this.terminatingAnimationTimeoutId = setTimeout(this.reset, terminatingAnimationDuration)

    this.setState({ percent: 100 })
  }

  reset = () => {
    this.terminatingAnimationTimeoutId = null
    this.setState({
      percent: 0,
      status: 'hidden'
    })
  }

  newPercent = (percent, progressIncrease) => {
    // Use cosine as a smoothing function
    // It could be any function to slow down progress near the ending 100%
    const smoothedProgressIncrease = progressIncrease * Math.cos(percent * (Math.PI / 2 / 100))

    return percent + smoothedProgressIncrease
  }

  simulateProgress = () => {
    this.setState((prevState, { maxProgress, progressIncrease }) => {
      let { percent } = prevState
      const newPercent = this.newPercent(percent, progressIncrease)

      if (newPercent <= Number(maxProgress)) {
        percent = newPercent
      }

      return { percent }
    })
  }

  isShown() {
    return this.state.percent > 0 && this.state.percent <= 100
  }

  buildStyle() {
    const animationDuration = this.state.status === 'stopping' ? TERMINATING_ANIMATION_DURATION : ANIMATION_DURATION

    const style: CSSProperties = {
      opacity: 1,
      transform: `scaleX(${this.state.percent / 100})`,
      transformOrigin: 'left',
      transition: `transform ${animationDuration}ms linear`,
      width: '100%',
      willChange: 'transform, opacity'
    }

    // Use default styling if there's no CSS class applied
    if (!this.props.className) {
      style.height = '3px'
      style.backgroundColor = '#1b82d1'
      style.position = 'absolute'
    }

    if (this.isShown()) {
      style.opacity = 1
    } else {
      style.opacity = 0
    }

    return { ...style, ...this.props.style }
  }

  render() {
    if (this.state.status === 'hidden') {
      return <div />
    }
    return (
      <div>
        <div style={this.buildStyle()} className={this.props.className} />
        <div style={{ display: 'table', clear: 'both' }} />
      </div>
    )
  }
}

export default LoadingBar
