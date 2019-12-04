import { createStyles } from '@material-ui/core/styles'
import { grayColor, materialButton } from '@/styles/appStyle'
const styles = createStyles({
  dialogMain: {
    width: 310
  },
  dialogTitle: {
    textAlign: 'center',
    fontSize: '16px',
    fontWeight: 400,
    paddingBottom: '13px'
  },
  dialogContent: {
    width: '100%',
    fontSize: '12px',
    color: '#838899',
    fontWeight: 400,
    paddingBottom: '12px'
  },
  dialogBtns: {
    justifyContent: 'space-evenly',
    marginBottom: '20px'
  },
  dialogBtn: {
    width: 118,
    color: grayColor,
    fontSize: 16,
    textTransform: 'none',
    background: '#528DD0',
    ...materialButton,
    '& span': {
      fontWeight: 'bold',
      color: '#fff'
    }
  },
  inputLabel: {
    color: '#838899',
    fontSize: '12px',
    marginBottom: '5px'
  },
  input: {
    width: '262px',
    background: 'rgba(242,243,247,1)',
    borderRadius: '4px',
    border: 'none',
    outline: 'none',
    resize: 'none',
    boxSizing: 'border-box',
    padding: '12px 10px',
    fontSize: '12px',
    overflow: 'hidden'
  },
  postInfo: {
    color: '#838899',
    textAlign: 'right'
  }
})

export default styles
