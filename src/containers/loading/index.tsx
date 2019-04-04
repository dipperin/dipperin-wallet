import { inject, observer } from 'mobx-react'
import React from 'react'
import ReactDOM from 'react-dom'

import LoadingBar from '../../components/loadingBar'
import LoadingStore from '../../stores/loading'

interface LoaidngProps {
  loading?: LoadingStore
}

@inject('loading')
@observer
class Loading extends React.Component<LoaidngProps> {
  render() {
    const root = document.getElementById('root') as Element
    const loading = this.props.loading as LoadingStore
    return ReactDOM.createPortal(
      <div>
        <LoadingBar loading={loading.load} />
      </div>,
      root
    )
  }
}

export default Loading
