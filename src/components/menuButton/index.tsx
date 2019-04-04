import classNames from 'classnames'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import React, { Fragment } from 'react'
import { WithTranslation, withTranslation } from 'react-i18next'

import { ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper } from '@material-ui/core'
import { withStyles, WithStyles } from '@material-ui/core/styles'
import { I18nCollectionContract } from '@/i18n/i18n'

import styles from './styles'

interface Props extends WithStyles<typeof styles>, WrapProps {
  labels: I18nCollectionContract['menu']
}

@observer
class MenuButton extends React.Component<Props> {
  @observable
  showMenu: boolean
  @observable
  anchorEl: any = null

  @action
  handleShowMenu = (e: React.MouseEvent) => {
    this.anchorEl = e.currentTarget
  }

  @action
  handleClose = () => {
    this.anchorEl = null
  }

  @action
  handleShowTransfer = () => {
    const { address, showTransfer } = this.props
    showTransfer(address)
    this.anchorEl = null
  }

  @action
  handleShowContractTx = () => {
    const { address, showContractTx } = this.props
    showContractTx(address)
    this.anchorEl = null
  }

  render() {
    const { className, classes, labels } = this.props
    return (
      <Fragment>
        <span className={classNames(classes.btn, className)} onClick={this.handleShowMenu}>
          <span />
          <span />
          <span />
        </span>
        <Popper
          id="menu-list-grow"
          open={Boolean(this.anchorEl) as boolean}
          anchorEl={this.anchorEl}
          transition={true}
          disablePortal={true}
          style={{ zIndex: 1 }}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper>
                <ClickAwayListener onClickAway={this.handleClose}>
                  <MenuList>
                    <MenuItem classes={{ root: classes.item }} onClick={this.handleShowTransfer}>
                      {labels.transfer}
                    </MenuItem>
                    <MenuItem classes={{ root: classes.item }} onClick={this.handleShowContractTx}>
                      {labels.history}
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Fragment>
    )
  }
}

export const StyleMenuButton = withStyles(styles)(MenuButton)

const MenuButtonWrap = (props: WrapProps & WithTranslation) => {
  const { t, ...other } = props
  return <StyleMenuButton {...other} labels={t('contract:menu')} />
}
export default withTranslation()(MenuButtonWrap)

interface WrapProps {
  address: string
  showTransfer: (address: string) => void
  showContractTx: (address: string) => void
  className?: string
}
