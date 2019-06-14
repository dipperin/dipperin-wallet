import React from 'react'
import { observer } from 'mobx-react'
import { RouteComponentProps } from 'react-router'
import { Switch, Route } from 'react-router-dom'
import { withTranslation, WithTranslation } from 'react-i18next'
import { withStyles, WithStyles } from '@material-ui/core/styles'
import { Dialog } from '@material-ui/core'

// components
import Call from './call'
import Receipts from './receipts'

import { I18nCollectionContract } from '@/i18n/i18n'
import styles from './styles'

type WrapProps = RouteComponentProps<{ address: string; operate: string }>

interface IProps extends WithStyles<typeof styles>, WrapProps {
  labels: I18nCollectionContract['contract']
}

@observer
export class Operate extends React.Component<IProps> {
  onClose = () => {
    const {
      match: {
        params: { operate, address },
        url
      },
      history
    } = this.props
    history.push(url.replace(`/${operate}`, '').replace(`/${address}`, ''))
  }
  render() {
    const {
      classes,
      match,
      history: {
        location: { pathname }
      }
    } = this.props
    const {
      params: { operate }
    } = match
    const basePath = pathname.split(operate)[0]
    return (
      <Dialog open={true} onClose={this.onClose} aria-labelledby="form-dialog-title" maxWidth={false}>
        <div className={classes.container}>
          <Switch>
            <Route path={`${basePath}call/:address`} component={Call} />
            <Route path={`${basePath}receipts/:address`} component={Receipts} />
          </Switch>
        </div>
      </Dialog>
    )
  }
}

export const StyleOperate = withStyles(styles)(Operate)

const OperateWrap = (props: WrapProps & WithTranslation) => {
  const { t, ...other } = props
  return <StyleOperate {...other} labels={t('contract:contract')} />
}

export default withTranslation()(OperateWrap)
// export default withNamespaces('contract')(StyleOperate)
