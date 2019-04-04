import { createStyles } from '@material-ui/core/styles'

const style = createStyles({
  loading: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 3000,
    background: 'rgba(0,0,0,0.5)'
  },
  loadShadow: {
    width: '100%',
    height: '100%',
    filter: 'blur(5px)'
  },
  title: {
    textAlign: 'center',
    fontSize: 40,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.7)',
    userSelect: 'none'
  },
  loadingWrap: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  svg: {
    display: 'block',
    margin: '0 auto'
  }
})

export default style
