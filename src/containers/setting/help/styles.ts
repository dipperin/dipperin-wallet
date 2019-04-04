import { createStyles } from '@material-ui/core/styles'
import { grayColor } from '@/styles/appStyle'

const styles = createStyles({
  help: {
    width: 892,
    height: 450,
    margin: '0 auto',
    padding: '34px 24px',
    borderRadius: '6px',
    color: grayColor,
    background: '#fff',
    overflow: 'hidden'
  },
  nav: {
    display: 'flex',
    fontSize: 18,
    alignItems: 'baseline',
    '& a': {
      textDecoration: 'none',
      color: 'rgba(0,0,0,0.8)',
      fontWeight: 'bold'
    },
    '& p': {
      marginRight: 14,
      fontWeight: 'bold',
      color: '#000'
    },
    '& img': {
      width: 12,
      marginRight: 14
    }
  },
  questions: {
    marginTop: 22
  }
})

export default styles
