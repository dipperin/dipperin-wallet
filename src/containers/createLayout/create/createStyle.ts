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
    marginBottom: 20,
    textAlign: 'center'
  },
  item: {
    // width: 500,
    marginLeft: 286
  },
  button: {
    position: 'absolute',
    width: '320px',
    height: '36px',
    bottom: 30,
    left: '50%',
    marginLeft: '-160px',
    margin: '15px auto 0',
    textTransform: 'none',
    fontSize: '16px',
    background: '#528DD0',
    color: '#fff',
    ...materialButton,
    '& span': {
      fontWeight: 'bold'
    }
  },
  textInput: {
    border: 'none',
    outline: 'none',
    resize: 'none',
    background: '#F2F3F7',
    borderRadius: 4,
    padding: '5px 13px',
    fontSize: 18,
    fontWeight: 400
  },
  mnemonicInput: {
    width: 320,
    height: 74
  },
  pswInput: {
    width: 320,
    height: 36
  },
  pswStr: {
    width: 320,
    height: 26,
    marginLeft: 286,
    marginTop: 5
  },
  rankbar: {
    display: 'flex',
    justifyContent: 'space-around'
  },
  weakPsw: {
    background: '#ECECEC',
    borderRadius: '4px 0px 0px 4px',
    width: 106,
    height: 8
  },
  weakPswActive: {
    background: '#96BEEC',
    borderRadius: '4px 0px 0px 4px',
    width: 106,
    height: 8
  },
  mediumPsw: {
    width: 106,
    height: 8,
    background: '#ECECEC'
  },
  mediumPswActive: {
    width: 106,
    height: 8,
    background: 'rgba(82,141,208,1)'
  },
  strongPsw: {
    background: '#ECECEC',
    borderRadius: '0px 4px 4px 0px',
    width: 106,
    height: 8
  },
  strongPswActive: {
    background: '#1B4C83',
    borderRadius: '0px 4px 4px 0px',
    width: 106,
    height: 8
  },
  strengthTextDefault: {
    fontSize: 12,
    color: '#B5B5B5'
  },
  weakText: {
    fontSize: 12,
    color: '#96BEEC'
  },
  mediumText: {
    fontSize: 12,
    color: '#528DD0'
  },
  strongText: {
    fontSize: 12,
    color: '#1B4C83'
  },
  inputLabel: {
    marginTop: 10,
    marginBottom: 3,
    color: '#BABBBE',
    fontSize: 12,
    lineHeight: '12px'
  }
})

export default styles
