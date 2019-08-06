import { createStyles } from '@material-ui/core'
import { grayColor } from '@/styles/appStyle'

export const styles = createStyles({
  transactionDetail: {
    marginTop: 27,
    fontSize: 12,
    color: grayColor
  },
  item: {
    marginBottom: 5,
    lineHeight: '20px'
  },
  label: {
    display: 'inline-block',
    width: 110,
    fontWeight: 400
  },
  value: {
    display: 'inline-block',
    width: 390,
    verticalAlign: 'top',
    wordBreak: 'break-all',
    fontWeight: 400,
    maxHeight: 200,
    overflow: 'hidden'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    '& span:nth-child(1)': {
      cursor: 'pointer'
    },
    '& img': {
      margin: '0 12px'
    },
    '& span': {
      fontWeight: 'bold'
    }
  }
})

export default styles
