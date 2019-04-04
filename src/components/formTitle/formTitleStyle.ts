import { createStyles } from '@material-ui/core/styles'

import Back from '../../images/back.png'
import DIP from '../../images/dip.png'

const styles = createStyles({
  formTitle: {
    position: 'relative',
    width: '100%',
    backgroundColor: '#002864',
    '&>p': {
      color: '#fff',
      fontSize: '18px',
      textAlign: 'right',
      lineHeight: '50px',
      height: '50px',
      paddingRight: '30px'
    },
    '&>span': {
      position: 'absolute',
      cursor: 'pointer',
      left: '30px',
      top: '0',
      paddingLeft: '90px',
      paddingTop: '4px',
      fontSize: '18px',
      color: '#fff',
      lineHeight: '46px',
      backgroundImage: `url(${Back}), url(${DIP})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: '0 center 60px center'
    }
  }
})

export default styles
