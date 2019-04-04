import { createStyles } from '@material-ui/core/styles'
import { primaryColor, grayColor, materialButton } from '@/styles/appStyle'

const styles = createStyles({
  root: {
    padding: '0 24px'
  },
  tab: {
    height: 36,
    width: 260,
    marginTop: 21,
    border: `1px solid ${primaryColor}`,
    borderRadius: '4px',
    overflow: 'hidden'
  },
  tabLeft: {
    display: 'inline-block',
    width: '50%',
    height: '100%',
    borderRight: `1px solid ${primaryColor}`
  },
  tabRight: {
    display: 'inline-block',
    width: '50%',
    height: '100%'
  },
  button: {
    width: '100%',
    height: '100%',
    padding: 0,
    textTransform: 'none',
    background: '#fff',
    borderRadius: 0,
    ...materialButton,
    '&:hover': {
      background: '#fff'
    },

    '& span': {
      fontSize: 16,
      fontWeight: 'bold',
      color: grayColor
    }
  },
  active: {
    background: primaryColor,
    '&:hover': {
      background: primaryColor
    },
    '& span': {
      color: '#fff'
    }
  }
})

export default styles
