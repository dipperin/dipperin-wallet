import { createStyles } from '@material-ui/core'
import { primaryColor, grayColor } from '@/styles/appStyle'

const styles = createStyles({
  process: {
    margin: '48px 0 58px',
    textAlign: 'center'
  },
  step: {
    display: 'inline-block',
    fontSIze: 16,
    fontWeight: 'bold',
    color: grayColor,
    verticalAlign: 'middle'
  },
  active: {
    color: primaryColor
  },
  next: {
    width: 14,
    height: 14,
    margin: '0 17px',
    verticalAlign: 'middle'
  }
})

export default styles
