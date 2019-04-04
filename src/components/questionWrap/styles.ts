import { createStyles } from '@material-ui/core/styles'
import { grayColor } from '@/styles/appStyle'

const styles = createStyles({
  question: {
    position: 'relative',
    fontSize: 12,
    color: grayColor,
    borderTop: `1px solid ${grayColor}`,
    '& img': {
      position: 'absolute',
      right: 4,
      top: 18,
      width: 12
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      width: 8,
      height: 8,
      borderRadius: '100%',
      border: `1px solid ${grayColor}`,
      left: -4,
      top: -4,
      background: '#fff'
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      width: 8,
      height: 8,
      borderRadius: '100%',
      border: `1px solid ${grayColor}`,
      right: -4,
      top: -4,
      background: '#fff'
    }
  },
  title: {
    height: 46,
    lineHeight: '46px',
    whiteSpace: 'nowrap'
  },
  content: {
    padding: '0 0 20px 32px'
  }
})

export default styles
