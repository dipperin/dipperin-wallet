import { createStyles } from '@material-ui/core'
import { drawerWidth } from '../styles/appStyle'

const styles = createStyles({
  main: {
    paddingLeft: drawerWidth,
    height: '100vh',
    overflow: 'hidden'
  },
  filter: {
    filter: 'blur(2px)'
  },
  loading: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 3000,
    background: 'rgba(0,0,0,0.5)',
    '& div': {
      lineHeight: '100vh',
      textAlign: 'center',
      fontSize: 40,
      fontWeight: 'bold',
      color: 'rgba(255,255,255,0.7)',
      userSelect: 'none'
    }
  }
})

export default styles
