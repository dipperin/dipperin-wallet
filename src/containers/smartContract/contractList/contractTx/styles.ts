import { createStyles } from '@material-ui/core/styles'
import { textOverflow, grayColor } from '@/styles/appStyle'

const styles = createStyles({
  dialogTitle: {
    textAlign: 'center'
  },
  dialogContent: {
    height: 415
  },
  transactionsList: {
    marginTop: 21,
    minWidth: 500
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
  itemType: {
    width: 100
  },
  itemTime: {
    width: 110
  },
  itemFrom: {
    width: 114
  },
  itemAddress: {
    width: 114
  },
  itemAmount: {
    width: 106
  },
  itemStatu: {
    width: 80
  },
  itemOperation: {
    width: 100,
    cursor: 'pointer'
  },
  detail: {
    '&:hover': {
      color: '#3ec9fd'
    }
  },
  pagination: {
    position: 'absolute',
    width: '100%',
    bottom: 15,
    textAlign: 'center',
    '& ul': {
      display: 'inline-block',
      '& li': {
        outline: 'none'
      }
    }
  },
  noRecords: {
    textAlign: 'center',
    '& img': {
      display: 'inline-block',
      width: 58,
      height: 62,
      marginTop: 147,
      marginBottom: 24
    },
    '& p': {
      fontSize: 12,
      color: grayColor
    }
  }
})

export default styles
