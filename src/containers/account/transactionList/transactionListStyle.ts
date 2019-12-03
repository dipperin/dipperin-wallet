import { createStyles } from '@material-ui/core'
import { textOverflow, grayColor } from '@/styles/appStyle'

export const styles = createStyles({
  transactionsList: {
    marginTop: 21
  },
  transactionsListHeader: {
    height: 30,
    background: grayColor,
    fontSize: 12,
    color: '#fff',
    '& p': {
      display: 'inline-block',
      height: '100%',
      padding: '0 5px',
      lineHeight: '30px',
      verticalAlign: 'top',
      fontWeight: 'bold',
      textAlign: 'center',
      ...textOverflow
    }
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
  },

  transactionsListBody: {},
  transactionsItem: {
    height: 28,
    fontSize: 12,
    color: '#999',
    '& p': {
      display: 'inline-block',
      height: '100%',
      padding: '0 5px',
      lineHeight: '28px',
      verticalAlign: 'top',
      textAlign: 'center',
      fontWeight: 400,
      ...textOverflow
    },
    '&:nth-child(odd)': {
      background: '#fff'
    },
    '&:nth-child(even)': {
      background: '#F5F5F5'
    }
  },
  success: {
    color: '#000'
  },
  itemTime: {
    width: 110
  },
  itemAddress: {
    width: 72
  },
  itemAmount: {
    width: 70
  },
  itemStatu: {
    width: 80
  },
  itemOperation: {
    width: 100,
    cursor: 'pointer'
  },
  detail: {
    color: '#3ec9fd',
    '&:hover': {
      color: '#3ec9fd'
    }
  },
  pagination: {
    position: 'absolute',
    // width: '100%',
    width: 510,
    bottom: 15,
    textAlign: 'center',
    '& ul': {
      display: 'flex',
      justifyContent: 'center',
      '& li': {
        outline: 'none'
      },
      '& li:first-child': {
        position: 'absolute',
        top: 0,
        left: 50
      },
      '& li:last-child': {
        position: 'absolute',
        top: 0,
        right: 50
      }
    }
  },
  noRecords: {
    textAlign: 'center',
    '& img': {
      display: 'inline-block',
      widht: 58,
      height: 62,
      marginTop: 100,
      marginBottom: 24
    },
    '& p': {
      fontSize: 12,
      color: grayColor
    }
  }
})

export default styles
