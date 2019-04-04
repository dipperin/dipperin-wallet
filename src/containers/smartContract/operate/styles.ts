import { createStyles } from '@material-ui/core/styles'
import { primaryColor, grayColor, materialButton } from '@/styles/appStyle'

const styles = createStyles({
  container: {
    width: 500
  },
  tab: {
    display: 'flex',
    height: 36,
    width: 450,
    margin: '20px auto',
    border: `1px solid ${primaryColor}`,
    borderRadius: '4px',
    overflow: 'hidden'
  },
  tabItem: {
    width: 150,
    height: '100%',
    boxSizing: 'border-box',
    '&:nth-child(2)': {
      borderLeft: `1px solid ${primaryColor}`,
      borderRight: `1px solid ${primaryColor}`
    },
    '& a': {
      textDecoration: 'none'
    }
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
