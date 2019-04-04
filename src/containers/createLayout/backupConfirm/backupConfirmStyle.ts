import { createStyles } from '@material-ui/core/styles'
import { grayColor, materialButton } from '@/styles/appStyle'
import Return from '../../../images/return.png'

const styles = createStyles({
  backupConfirm: {
    width: 892,
    height: 488,
    margin: '60px auto 0',
    borderRadius: '6px',
    overflow: 'hidden'
  },
  top: {
    height: 311,
    paddingTop: 32,
    paddingBottom: 30,
    background: '#fff'
  },
  back: {
    fontSize: 18,
    color: '#000',
    marginLeft: 24,
    fontWeight: 'bold',
    cursor: 'pointer',
    paddingLeft: 20,
    background: `url(${Return}) no-repeat`,
    backgroundSize: '8px 16px',
    backgroundPosition: 0
  },
  title: {
    marginBottom: 10,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center'
  },
  hint: {
    margin: '0 auto',
    textAlign: 'center',
    fontSize: 12,
    lineHeight: '20px',
    color: grayColor,
    marginBottom: '24px',
    fontWeight: 'bold'
  },
  selectedWords: {
    height: 40,
    lineHeight: '40px',
    textAlign: 'center',
    '& span': {
      display: 'inline-block',
      fontWeight: 'bold',
      color: '#fff',
      marginRight: '10px',
      cursor: 'pointer',
      '&:hover': {
        opacity: 0.7
      }
    }
  },
  remainingWords: {
    textAlign: 'center',
    '& span': {
      display: 'inline-block',
      marginRight: '10px'
    }
  },
  clickWord: {
    cursor: 'pointer',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    '&.selected': {
      cursor: 'not-allowed',
      color: '#27BAFF'
    }
  },
  bottom: {
    position: 'relative',
    height: 137,
    paddingTop: 18,
    background: '#fff'
  },
  button: {
    position: 'absolute',
    width: '262px',
    height: '36px',
    bottom: 30,
    left: '50%',
    marginLeft: '-131px',
    margin: '15px auto 0',
    textTransform: 'none',
    fontSize: '16px',
    ...materialButton,
    '& span': {
      fontWeight: 'bold'
    }
  },
  dialogContent: {
    width: 310
  },
  dialogText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0E050A',
    textAlign: 'center'
  },
  dialogBtns: {
    justifyContent: 'space-evenly'
  },
  dialogBtn: {
    color: grayColor,
    fontSize: 16,
    textTransform: 'none',
    '& span': {
      fontWeight: 'bold'
    }
  }
})

export default styles
