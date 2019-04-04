import classNames from 'classnames'
import React from 'react'
import { withTranslation, WithTranslation } from 'react-i18next'

import { withStyles, WithStyles } from '@material-ui/core'

import Next from '../../../images/next.png'
import styles from './progressStyle'
import { I18nCollectionCreate } from '@/i18n/i18n'

interface WrapProps {
  pathname: string
}

interface Props extends WithStyles<typeof styles>, WrapProps {
  labels: I18nCollectionCreate['progressBar']
}
export class ProcessBar extends React.Component<Props> {
  render() {
    const { labels, classes, pathname } = this.props
    return (
      <div className={classes.process}>
        <p className={classNames(classes.step, { [classes.active]: pathname === '/create' })}>{labels.create}</p>
        <img className={classes.next} src={Next} alt="" />
        <p className={classNames(classes.step, { [classes.active]: pathname === '/create/backup' })}>{labels.backup}</p>
        <img className={classes.next} src={Next} alt="" />
        <p className={classNames(classes.step, { [classes.active]: pathname === '/create/backup_confirm' })}>
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
