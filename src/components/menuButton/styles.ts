import { createStyles } from '@material-ui/core/styles'
import { grayColor } from '@/styles/appStyle'

const styles = createStyles({
  btn: {
    width: 25,
    height: 28,
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    '& span': {
      display: 'blcok',
      width: 4,
      height: 4,
      marginRight: 4,
      borderRadius: '100%',
      background: grayColor
    }
  },
  item: {
    fontSize: 12,
    textAlign: 'center',
    display: 'block',
    padding: '2px 5px'
  }
})

export default styles
