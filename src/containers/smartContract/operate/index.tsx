import React from 'react'
// import { observable } from 'mobx'
import classNames from 'classnames'
import { inject, observer } from 'mobx-react'
import { RouteComponentProps } from 'react-router'
import { Switch, Route, NavLink } from 'react-router-dom'
import { withTranslation, WithTranslation } from 'react-i18next'
import { withStyles, WithStyles } from '@material-ui/core/styles'
import { Dialog, Button } from '@material-ui/core'
import swal from 'sweetalert2'

// store
import ContractStore from '@/stores/contract'

// components
import Transfer from './transfer'
import Approve from './approve'
import TransferFrom from './transferFrom'

import { I18nCollectionContract } from '@/i18n/i18n'
import styles from './styles'

interface WrapProps extends RouteComponentProps<{ address: string; operate: string }> {
  contract: ContractStore
}

interface IProps extends WithStyles<typeof styles>, WrapProps {
  labels: I18nCollectionContract['contract']
}

@inject('contract')
@observer
export class Operate extends React.Component<IProps> {
  onClose = () => {
    const {
      match: {
        params: { operate }
      },
      history
    } = this.props
    history.push(history.location.pathname.split(operate)[0])
  }
  render() {
    const {
      contract,
      labels,
      classes,
      match: {
        params: { address, operate }
      },
      history: {
        location: { pathname }
      }
    } = this.props
    const transferContract = contract.contract.get(address)
    if (!transferContract) {
      swal.fire({
        type: 'error',
        title: labels.swal.somethingWrong
      })
      setTimeout(() => {
        this.onClose()
      })
      return null
    }
    const basePath = pathname.split(operate)[0]
    return (
      <Dialog open={true} onClose={this.onClose} aria-labelledby="form-dialog-title" maxWidth={false}>
        <div className={classes.container}>
          <div className={classes.tab}>
            <div className={classes.tabItem} data-tour="created-btn">
              <NavLink to={`${basePath}transfer/${address}`}>
                <Button
                  variant="contained"
                  className={classNames(classes.button, { [classes.active]: operate === 'transfer' })}
                >
                  {labels.labs.transfer}
                </Button>
              </NavLink>
            </div>
            <div className={classes.tabItem} data-tour="receive-btn">
              <NavLink to={`${basePath}approve/${address}`}>
                <Button
                  variant="contained"
                  className={classNames(classes.button, { [classes.active]: operate === 'approve' })}
                >
                  {labels.labs.approve}
                </Button>
              </NavLink>
            </div>
            <div className={classes.tabItem} data-tour="receive-btn">
              <NavLink to={`${basePath}transferFrom/${address}`}>
                <Button
                  variant="contained"
                  className={classNames(classes.button, { [classes.active]: operate === 'transferFrom' })}
                >
                  {labels.labs.transferFrom}
                </Button>
              </NavLink>
            </div>
          </div>
          <Switch>
            <Route path={`${basePath}transfer/:address`} component={Transfer} />
            <Route path={`${basePath}approve/:address`} component={Approve} />
            <Route path={`${basePath}transferFrom/:address`} component={TransferFrom} />
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
