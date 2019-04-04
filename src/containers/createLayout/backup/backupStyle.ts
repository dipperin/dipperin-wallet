import { createStyles } from '@material-ui/core/styles'
import { grayColor, materialButton } from '@/styles/appStyle'
import Return from '../../../images/return.png'

const styles = createStyles({
  backup: {
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
    width: 454,
    margin: '0 auto',
    textAlign: 'center',
    fontSize: 12,
    lineHeight: '20px',
    color: grayColor,
    marginBottom: '24px',
    fontWeight: 'bold'
  },
  mnemonic: {
    height: 40,
    lineHeight: '40px',
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  bottom: {
    position: 'relative',
    height: 137,
    paddingTop: 18,
    background: '#fff'
  },
  hintBot: {
    fontSize: 18,
    color: '#ff0000',
    textAlign: 'center',
    fontWeight: 'bold'
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
  }
})

export default styles
