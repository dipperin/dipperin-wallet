import classNames from 'classnames'
import React from 'react'
import { withTranslation, WithTranslation } from 'react-i18next'

import { withStyles, WithStyles } from '@material-ui/core'

import Next from '../../../images/next.png'
import styles from './progressStyle'
import { I18nCollectionCreate } from '@/i18n/i18n'

interface WrapProps {
  pathname: string
  turnFunc?: [boolean, () => void | null, boolean, () => void | null]
}

interface Props extends WithStyles<typeof styles>, WrapProps {
  labels: I18nCollectionCreate['progressBar']
}
export class ProcessBar extends React.Component<Props> {
  render() {
    const { labels, classes, pathname } = this.props
    return (
      <div className={classes.process}>
        <p
          className={classNames(classes.step, { [classes.active]: pathname === '/create' })}
          onClick={this.props.turnFunc && this.props.turnFunc[0] ? this.props.turnFunc[1] : () => null}
          style={{ cursor: `${this.props.turnFunc && this.props.turnFunc[0] ? 'pointer' : 'default'}` }}
        >
          {labels.create}
        </p>
        <img className={classes.next} src={Next} alt="" />
        <p
          className={classNames(classes.step, { [classes.active]: pathname === '/create/backup' })}
          onClick={this.props.turnFunc && this.props.turnFunc[2] ? this.props.turnFunc[3] : () => null}
          style={{ cursor: `${this.props.turnFunc && this.props.turnFunc[2] ? 'pointer' : 'default'}` }}
        >
          {labels.backup}
        </p>
        <img className={classes.next} src={Next} alt="" />
        <p
          className={classNames(classes.step, { [classes.active]: pathname === '/create/backup_confirm' })}
          style={{ cursor: 'default' }}
        >
          {labels.confirm}
        </p>
      </div>
    )
  }
}
export const StyleProcessBar = withStyles(styles)(ProcessBar)
const ProcessBarWrap = (props: WrapProps & WithTranslation) => {
  const { t, ...other } = props
  return <StyleProcessBar {...other} labels={t('create:progressBar')} />
}

export default withTranslation()(ProcessBarWrap)

// export default withNamespaces('progressBar')(withStyles(styles)(ProcessBar))
