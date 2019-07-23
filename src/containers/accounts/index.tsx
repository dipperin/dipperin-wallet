import classNames from 'classnames'
import { observable, reaction, action } from 'mobx'
import { inject, observer } from 'mobx-react'
import React from 'react'
import { WithTranslation, withTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router'

import AccountStore from '@/stores/account'
import { Button } from '@material-ui/core'
import { withStyles, WithStyles } from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/Add'

import AccountModel from '@/models/account'
import { I18nCollectionAccount } from '@/i18n/i18n'
import SmallAccountList from './components/smallAccountList'
import BigAccountList from './components/bigAccountList'

import Close from '@/images/close.png'
import Left from '@/images/left.png'
import Right from '@/images/right.png'

import styles from './accountsStyle'

export interface Props extends AccountWrapProps, WithStyles<typeof styles> {
  account?: AccountStore
  labels: I18nCollectionAccount['accounts']
}

const S_WIDTH = 80
const S_MARGIN = 12
const S_AMOUNT = 9
const ITEM_WIDTH = S_MARGIN + S_WIDTH
const CONTAINER_WIDTH = S_AMOUNT * S_WIDTH + (S_AMOUNT - 1) * S_MARGIN // 816

@inject('account')
@observer
export class Accounts extends React.Component<Props> {
  @observable
  selectedId: string = '1'
  // show big accounts
  @observable
  bigAccounts: AccountModel[] = []
  @observable
  smallListLeft: number = 0
  @observable
  smallListPage: number = 1

  constructor(props: Props) {
    super(props)
    this.init()
  }

  @action
  init = () => {
    this.changeAccount(this.props.account!.activeAccount.id)
    reaction(
      () => this.props.account!.activeAccount.id,
      id => {
        this.changeAccount(id)
      }
    )
  }

  /**
   * show big accounts & small accounts
   */
  @action
  showAccounts = (id: string) => {
    const { account } = this.props
    const { accounts } = account!
    this.selectAccount(id)
    this.bigAccounts = this.getBigAccounts(id, accounts)
  }

  /**
   * get current big accounts
   */
  getBigAccounts = (id: string, accounts: AccountModel[]) => {
    const accountLength = accounts.length
    return accounts.filter(item => {
      // active id is the last/first one
      if ((Number(id) === accountLength || Number(id) === 1) && Math.abs(Number(item.id) - Number(id)) < 3) {
        return true
      }
      if (Math.abs(Number(item.id) - Number(id)) < 2) {
        return true
      }

      return false
    })
  }

  addAccount = () => {
    try {
      this.props.account!.addAccount()
    } catch (err) {
      this.props.history.push('/login')
    }
  }

  handleChangeActiveAccount = (id: string) => {
    this.props.account!.changeActiveAccount(id)
    this.props.handleClose()
    // console.log('changeActiveAccount Id', id)
  }

  @action
  changeAccount = (id: string) => {
    this.selectedId = id
    this.showAccounts(id)
  }

  computeMiddleAccount = (accountLength: number, samllListLeft: number): number | undefined => {
    const perWidth = S_WIDTH + S_MARGIN
    if (accountLength <= S_AMOUNT) {
      return
    }
    return Math.floor(Math.abs(samllListLeft) / perWidth) + 5
  }

  /**
   * show big account by small account position
   */
  @action
  updateSelectedAccount = () => {
    const { accounts } = this.props.account!
    const middleAccount = this.computeMiddleAccount(accounts.length, this.smallListLeft)
    if (middleAccount) {
      this.selectedId = String(middleAccount)
    }
  }

  /**
   * handle left
   */
  @action
  handleLeft = () => {
    const preSmallListleft = this.smallListLeft
    this.smallListLeft = this.computeHandleLeft(this.smallListLeft)
    if (preSmallListleft !== this.smallListLeft) {
      this.updateSelectedAccount()
    }
  }

  computeHandleLeft = (beforeLeft: number): number => {
    if (Math.abs(beforeLeft) > CONTAINER_WIDTH) {
      return beforeLeft + (CONTAINER_WIDTH + S_MARGIN)
    }
    return 0
  }

  @action
  handleRight = () => {
    const { accounts } = this.props.account!
    if (accounts.length < S_AMOUNT) {
      return
    }

    const preSmallListleft = this.smallListLeft
    const smallListWidth = this.getSmallListWidth(accounts.length)
    const computeLeft = this.computeHandleRight(smallListWidth, this.smallListLeft)
    this.smallListLeft = computeLeft
    if (preSmallListleft !== this.smallListLeft) {
      this.updateSelectedAccount()
    }
  }

  computeHandleRight = (smallListWidth: number, beforeLeft: number): number => {
    if (smallListWidth - Math.abs(beforeLeft) >= 2 * CONTAINER_WIDTH) {
      return beforeLeft - (CONTAINER_WIDTH + S_MARGIN)
    } else {
      return CONTAINER_WIDTH - smallListWidth
    }
  }

  getSmallListWidth = (accountLength: number) => {
    return accountLength * S_WIDTH + (accountLength - 1) * S_MARGIN
  }

  /**
   * show small accounts by id
   */
  @action
  selectAccount = (id: string) => {
    const { accounts } = this.props.account!
    const computedLeft = this.computeLeftBySelectId(accounts.length, Number(id))
    this.smallListLeft = computedLeft
  }

  computeLeftBySelectId = (accountLength: number, id: number): number => {
    const smallListWidth = this.getSmallListWidth(accountLength)

    const halfAmount = Math.floor(S_AMOUNT / 2)
    const totalAmount = accountLength
    if (totalAmount < S_AMOUNT) {
      return 0
    } else {
      if (id - 1 <= halfAmount) {
        return 0
      } else if (totalAmount - id <= halfAmount) {
        return CONTAINER_WIDTH - smallListWidth
      } else {
        return -(id - 1 - halfAmount) * ITEM_WIDTH
      }
    }
  }

  render() {
    const { labels, classes } = this.props
    const { account, handleClose } = this.props
    const {
      accounts,
      activeAccount: { id }
    } = account!
    const smallListWidth = this.getSmallListWidth(accounts.length)
    return (
      <div className={classes.changeAccount}>
        <div className={classes.shadow}>
          <Button variant="contained" className={classNames(classes.add, 'tour-add')} onClick={this.addAccount}>
            <AddIcon className={classes.btnIcon} />
            {labels.add}
          </Button>
          <Button className={classes.close} onClick={handleClose}>
            <img src={Close} alt="close" draggable={false} />
          </Button>
          <BigAccountList
            labels={labels}
            activeId={id}
            handleChangeActiveAccount={this.handleChangeActiveAccount}
            accounts={this.bigAccounts}
          />

          <div className={classes.accountsList}>
            <Button className={classes.left} onClick={this.handleLeft}>
              <img src={Left} alt={'left'} draggable={false} />
            </Button>
            <Button className={classes.right} onClick={this.handleRight}>
              <img src={Right} alt={'right'} draggable={false} />
            </Button>

            <div className={classes.listContainer} style={{ width: `${CONTAINER_WIDTH}px` }}>
              <ul
                className={classes.list}
                style={{
                  width: `${smallListWidth}px`,
                  left: `${this.smallListLeft}px`
                }}
              >
                <SmallAccountList
                  accounts={accounts}
                  labels={labels}
                  selectedId={this.selectedId}
                  activeId={id}
                  changeAccount={this.changeAccount}
                />
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const StyleAccounts = withStyles(styles)(Accounts)

interface AccountWrapProps extends Pick<RouteComponentProps, 'history'> {
  handleClose: () => void
}

const AccountWrap = (props: AccountWrapProps & WithTranslation) => {
  const { t, history, handleClose } = props
  return <StyleAccounts handleClose={handleClose} history={history} labels={t('account:accounts')} />
}

export default withTranslation()(AccountWrap)
