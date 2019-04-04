import { createStyles } from '@material-ui/core/styles'

import Return from '../../../images/return.png'
import { materialButton } from '@/styles/appStyle'

const styles = createStyles({
  create: {
    position: 'relative',
    width: 892,
    height: 488,
    margin: '60px auto 0',
    paddingTop: 32,
    borderRadius: '6px',
    overflow: 'hidden',
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
  passwordInput: {
    border: '1px solid #bfbfbf',
    height: '60px',
    width: '478px',
    fontSize: '18px',
    paddingLeft: '22px',
    borderRadius: '6px',
    marginBottom: '48px',

    '&:nth-of-type(2)': {
      marginBottom: '92px'
    }
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 60,
    textAlign: 'center'
  },
  item: {
    width: 500,
    margin: '0 auto 18px 196px'
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
