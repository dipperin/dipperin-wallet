import classNames from 'classnames'
import { observable, action, runInAction } from 'mobx'
import { inject, observer } from 'mobx-react'
import React from 'react'
import { withTranslation, WithTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router'
import swal from 'sweetalert2'
import _ from 'lodash'

import PackageJson from '@/../package.json'
import Loading from '@/components/loading'
import Accounts from '@/containers/accounts'
import PasswordConfirm from '@/components/passwordConfirm'
import DialogConfirm from '@/components/privateConfirm'

// import Help from '@/images/setting-help.png'
// import Reset from '@/images/setting-reset.png'
// import Update from '@/images/setting-update.png'
import {
  onDownloadProgress,
  onNodeRestart,
  openDipperin,
  openTmp,
  setNodeNet,
  updateNode,
  sendStopNode,
  sendStartNode,
  onStartNodeSuccess
} from '@/ipc'
import WalletStore from '@/stores/wallet'
// import RootStore from '@/stores/root'
import AccountStore from '@/stores/account'
import { isAlpha } from '@/utils'
import { getCurrentNet, setCurrentNet, setIsRemoteNode } from '@/utils/node'
import settings from '@/utils/settings'
import { Button, Fab, WithStyles, withStyles, Tooltip } from '@material-ui/core'

import { I18nCollectionWallet } from '@/i18n/i18n'
import RootStore from '@/stores/root'
import { DEFAULT_NET, VENUS, TEST, LOCAL, NET_HOST_OBJ } from '@/utils/constants'
import SwitchButton from '@/components/switchButton'

import styles from './settingStyle'

interface WrapProps extends RouteComponentProps<{}> {
  wallet: WalletStore
  account: AccountStore
  root: RootStore
}

interface Props extends WithStyles<typeof styles>, WrapProps {
  labels: I18nCollectionWallet['setting']
}

@inject('wallet', 'account', 'root')
@observer
export class Setting extends React.Component<Props> {
  @observable
  showAccounts: boolean = false
  @observable
  loading: boolean = false
  @observable
  netEnv: string = DEFAULT_NET
  @observable
  progress: number = 0.005
  @observable
  showDialog: boolean = false
  @observable
  showPrivateKey: boolean = false
  @observable
  privateKey: string = ''
  @observable
  showTip: boolean = true

  constructor(props: Props) {
    super(props)

    const { labels } = props

    this.netEnv = getCurrentNet() || DEFAULT_NET
    onNodeRestart(
      () => {
        this.closeLoading()
        swal.fire({
          type: 'success',
          title: labels.swal.updateSuccess,
          timer: 1000
        })
      },
      () => {
        this.props.root.reconnect()
      }
    )

    onDownloadProgress((progress: number) => {
      if (progress > this.progress) {
        this.changeProgress(progress)
      }
    })

    onStartNodeSuccess(this.nodeStartSuccess)
  }

  nodeStartSuccess = () => {
    setTimeout(() => {
      this.props.root!.reconnect()
    }, 1000)
  }

  @action
  changeAccount = () => {
    this.showAccounts = true
  }

  @action
  handleClose = () => {
    this.showAccounts = false
  }

  @action
  setShowDialog = (flag: boolean) => {
    this.showDialog = flag
  }

  handleCloseDialog = () => {
    this.setShowDialog(false)
  }

  handleShowDialog = () => {
    this.setShowDialog(true)
  }

  handleReset = async () => {
    const { labels, root } = this.props
    const res = await swal.fire({
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: labels.swal.cancel,
      confirmButtonText: labels.swal.confirm,
      type: 'warning',
      text: labels.swal.warnText,
      title: labels.swal.warn,
      reverseButtons: true
    })
    if (res.value) {
      root.clear(true)

      settings.set('showAccountGuide', false)

      this.props.history.push('/')
    }
  }

  handleUpdate = async () => {
    const { labels, root } = this.props
    const res = await swal.fire({
      text: labels.swal.startUpdate,
      type: 'warning',
      showConfirmButton: true,
      showCancelButton: true,
      cancelButtonText: labels.swal.cancel,
      confirmButtonText: labels.swal.confirm,
      reverseButtons: true
    })
    if (res.value) {
      root.stopConnectNode()
      this.showLoading()
      updateNode()
    }
  }

  lockWallet = () => {
    this.props.history.push('/login')
  }

  /**
   * change net
   */
  handleChangeNet = net => () => {
    if (net === this.netEnv) {
      return
    }
    runInAction(() => {
      this.netEnv = net
    })
    // disconnect node
    this.props.root.stopConnectNode()
    // update settings netEnv
    setCurrentNet(net)
    if (!this.props.root.isRemoteNode) {
      // (ipc)restart local node with different net
      setNodeNet(net)
      // reconnect node in ipc event listener
    } else {
      this.selectRemote(net)
    }
  }

  /**
   * toggle isRemoteNode
   */
  handleToggleRemoteNode = () => {
    const { root } = this.props
    root.toggleIsRemoteNode()
    if (root.isRemoteNode) {
      // stop local node
      sendStopNode()
      // default select REMOTE_MECURY
      if (this.netEnv in NET_HOST_OBJ) {
        this.selectRemote(this.netEnv)
      } else {
        this.selectRemote(VENUS)
      }
      // this.selectRemote(VENUS)
      this.props.root!.reconnect()
    } else {
      this.selectLocal()
    }
  }

  /**
   * select remote note
   */
  selectRemote = (remoteNode: string) => {
    // update isRemote in settings
    setIsRemoteNode(true)
    this.props.root.changeRemoteProvide(remoteNode)
    this.handleChangeNet(remoteNode)()
  }

  handleSelectRemoteNode = net => () => {
    this.selectRemote(net)
  }

  /**
   * select local node
   */
  @action
  selectLocal = () => {
    // stop connect
    this.props.root.stopConnectNode()
    // update isRemote in settings
    setIsRemoteNode(false)
    // default select MERCURY
    // this.netEnv = VENUS
    // update net in settings
    setCurrentNet(this.netEnv)
    sendStartNode()
    this.props.root.reconnect()
  }

  // setMiner = async () => {
  //   const res = await swal.fire('miner address?', {
  //     content: {
  //       element: 'input'
  //     }
  //   })
  //   if (res) {
  //     await this.props.wallet.setMiner(res)
  //     swal.fire('success', '', 'success')
  //   }
  // }

  // setHost = async () => {
  //   const res = await swal.fire('set host?', {
  //     content: {
  //       element: 'input'
  //     }
  //   })
  //   if (res) {
  //     settings.set('host', res)
  //     await swal.fire('success', '', 'success')
  //     this.props.wallet.reconnectNode()
  //     // this.props.history.push('/login')
  //     window.location.reload()
  //   }
  // }

  handOpenTmp = () => {
    openTmp()
  }

  handOpenDipperin = () => {
    openDipperin()
  }

  handleToHelp = () => {
    const {
      match: { path },
      history
    } = this.props
    history.push(`${path}/help`)
  }

  @action
  showLoading = () => {
    this.loading = true
  }

  @action
  closeLoading = () => {
    this.loading = false
  }

  @action
  changeProgress = (progress: number) => {
    this.progress = progress
  }

  handleConsoleEncry = () => {
    console.log(this.props.wallet!.hdAccount)
  }

  @action
  setPrivateKay = (key: string) => {
    this.privateKey = key
  }

  handleGeneratePrivateKey = async (password: string) => {
    this.handleCloseDialog()
    const res = await this.props.wallet!.checkPassword(password)
    let pri = ''
    if (res) {
      pri = this.props.account!.exportPrivateKey(password)
      this.setPrivateKay(pri)
      console.log(pri)
      this.handleShowPrivateKey()
    }
  }

  handleDialogConfirm = _.debounce(this.handleGeneratePrivateKey, 1000)

  @action
  setShowPrivateKey(flag: boolean) {
    this.showPrivateKey = flag
  }

  handleShowPrivateKey = () => {
    this.setShowPrivateKey(true)
  }

  handleClosePrivateKey = () => {
    this.setPrivateKay('')
    this.setShowPrivateKey(false)
  }

  @action
  handleCLoseTip = () => {
    this.showTip = false
  }

  render() {
    const {
      labels,
      account,
      classes,
      root,
      wallet: { blockInfo }
    } = this.props
    // const isConnecting = root.isConnecting
    const isRemoteNode = root.isRemoteNode
    const activeAccount = account.activeAccount
    if (!activeAccount) {
      return null
    }

    return (
      <div>
        <div className={classes.setting}>
          <div className={classes.left}>
            <p className={classes.title}>{labels.left.title}</p>
            <p>{labels.left.info}</p>
            {/* <Button
              variant="contained"
              className={classNames(classes.button, classes.help)}
              onClick={this.handleToHelp}
            >
              <img src={Help} alt="" />
              {t('btn.help')}
            </Button> */}
            <div className={classes.version}>
              <p>
                {labels.about.label.version} : {PackageJson.version}
              </p>
            </div>
          </div>
          <div className={classes.right}>
            <Tooltip title={isRemoteNode ? labels.net.closeRemote : labels.net.connectRemote}>
              <div className={classes.switch}>
                <SwitchButton isChecked={isRemoteNode} handleChange={this.handleToggleRemoteNode} />
              </div>
            </Tooltip>
            <p className={classes.title}>{isRemoteNode ? labels.net.remoteTitle : labels.net.title}</p>
            {isRemoteNode ? (
              <div className={classes.netWrap}>
                {[VENUS, TEST].map(net => {
                  return (
                    <Fab
                      className={classNames(classes.netBtn, { [classes.netBtnActive]: this.netEnv === net })}
                      variant="extended"
                      key={net}
                      onClick={this.handleChangeNet(net)}
                    >
                      <span>{labels.net[net]}</span>
                    </Fab>
                  )
                })}
              </div>
            ) : (
              <div className={classes.netWrap}>
                {[VENUS, TEST, LOCAL].map(net => {
                  if (!isAlpha && net === TEST) {
                    return
                  }
                  return (
                    <Fab
                      className={classNames(classes.netBtn, { [classes.netBtnActive]: this.netEnv === net })}
                      variant="extended"
                      key={net}
                      onClick={this.handleChangeNet(net)}
                    >
                      <span>{labels.net[net]}</span>
                    </Fab>
                  )
                })}
              </div>
            )}
            {this.showTip && (
              <div className={classes.tip}>
                <span className={classes.hornIcon} />
                <span className={classes.tipContent}>
                  {isRemoteNode ? labels.net.remoteHint : labels.net.localHint}
                </span>
                <span className={classes.tipClose} onClick={this.handleCLoseTip}>
                  ×
                </span>
              </div>
            )}
            <p className={classes.title} style={{ position: 'absolute', top: '150px' }}>
              {labels.walletManagement}
            </p>
            <div className={classes.aboutInfo} style={{ position: 'absolute', top: '190px' }}>
              {/* <div>
                <p>{t('about.label.developer')}:</p>
                <p>{t('about.value.developer')}</p>
              </div> */}
              <div>
                <Fab
                  className={classNames(classes.netBtn)}
                  variant="extended"
                  style={{ width: 140 }}
                  onClick={this.handleShowDialog}
                >
                  <span style={{ textTransform: 'none' }}>{labels.exportPrivateKey}</span>
                </Fab>
                {/* <Button variant="contained" onClick={this.handleConsoleEncry}>
                  打印秘钥
                </Button> */}
              </div>
              {/* <div>
                <p>{t('about.label.copyright')}:</p>
                <p>{t('about.value.copyright')}</p>
              </div> */}
              {/* <div>
                <p>{t('about.label.function')}:</p>
                <p>{t('about.value.function')}</p>
              </div> */}
            </div>
            {!blockInfo && <p className={classes.connectFail}>{labels.connectFail}</p>}
          </div>
          {!isRemoteNode && (
            <Button
              variant="contained"
              className={classNames(classes.button, classes.updateNodeButton)}
              onClick={this.handleUpdate}
            >
              {/* <img src={Update} alt="" /> */}
              <div className="btn-img" />
              {labels.btn.update}
            </Button>
          )}

          <Button
            variant="contained"
            className={classNames(classes.button, classes.resetButton)}
            onClick={this.handleReset}
          >
            <div className="btn-img" />
            {labels.btn.reset}
          </Button>
          {/* {PackageJson.version && <div className={classes.setMiner} title="set miner" onClick={this.setMiner} />} */}
          {/* {PackageJson.version && <div className={classes.setHost} title="set host" onClick={this.setHost} />} */}
          {PackageJson.version && <div className={classes.openTmp} title="open tmp" onClick={this.handOpenTmp} />}
          {PackageJson.version && (
            <div className={classes.openDipperin} title="open dipperin" onClick={this.handOpenDipperin} />
          )}
          {PackageJson.version && (
            <div className={classes.changeRemote} title="toggle remote" onClick={this.handleToggleRemoteNode} />
          )}
        </div>
        {this.showAccounts && <Accounts handleClose={this.handleClose} history={this.props.history} />}
        {this.loading && <Loading title={labels.loading} progress={this.progress} />}
        {this.showDialog && <PasswordConfirm onClose={this.handleCloseDialog} onConfirm={this.handleDialogConfirm} />}
        {this.showPrivateKey && (
          <DialogConfirm
            onClose={this.handleClosePrivateKey}
            prk={this.privateKey}
            title={labels.privateKey.title}
            label={labels.privateKey.label}
            note={labels.privateKey.notes}
            btnText={labels.privateKey.confirm}
            swal={labels.swal.copySuccess}
          />
        )}
      </div>
    )
  }
}

const StyleSetting = withStyles(styles)(Setting)

const SettingWrap = (props: WrapProps & WithTranslation) => {
  const { t, ...other } = props
  return <StyleSetting {...other} labels={t('wallet:setting')} />
}

export default withTranslation()(SettingWrap)

// export default withStyles(styles)(withNamespaces('setting')(Setting))
