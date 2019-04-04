import CurrentAccountCN from '@/images/selected-cn.png'
import CurrentAccountUS from '@/images/selected.png'

export const zhCN = {
  wallet: {
    accountTour: {
      switchAddress: '点击这里可以切换地址',
      addAccount: '点击这里添加账户',
      selectAccount: '点击选中账户',
      sendTransfer: '这里可以发送交易',
      qrcode: '这里可以查看收款二维码'
    },
    login: {
      title: '解锁钱包',
      password: '密码',
      unlock: '解锁',
      lockText: '密码错误次数过多，请耐性等待...',
      resetText: '如果您忘记了密码，可以通过助记词来重置和恢复钱包',
      resetWallet: '重置钱包',
      swal: {
        documentTitle: 'Dipperin 钱包',
        emptyPassword: '请填写密码！',
        incorrectPassword: '密码错误',
        success: '解锁成功!',
        confirm: '确认',
        cancel: '取消',
        resetConfirm: '确定',
        warnText:
          '如果您重置钱包，所有记录会被删除。在您以后再导入钱包的时候，会一开始显示第一个账户。您可以点击“添加账户”按钮显示更多已存在的账户。',
        warn: '警告'
      }
    },
    import: {
      title: '导入钱包',
      mnemonic: '助记词',
      setPassword: '设置密码',
      repeatPassword: '确认密码',
      recovery: '恢复钱包',
      create: '创建新钱包',
      howToCreate: '怎样创建新钱包',
      langAb: 'CN',
      lang: '中文',
      swal: {
        success: '导入成功!',
        mnemonicLength: '请提供至少12位助记词',
        invalidMnemonic: '助记词不合法',
        passwordLength: '密码长度至少8位',
        invalidPassword: '无效密码',
        diffPassword: '两次密码不一致！',
        confirm: '确认'
      },
      tour: {
        create: '如果您还没有钱包，点击这里去创建钱包！',
        import: '如果您已有钱包，在这里输入助记词并设置您的密码来恢复钱包！'
      }
    },
    sidebar: {
      wallet: '钱包',
      contract: '智能合约',
      setting: '设置',
      title: 'Dipperin 钱包',
      walletVersion: '钱包版本',
      dipperinVersion: 'Dipperin版本',
      height: '块高',
      timestamp: '时间戳'
    },
    setting: {
      left: {
        title: '设置',
        info: '设置您的钱包账户信息'
      },
      net: {
        title: '选择本地节点',
        remoteTitle: '选择远程节点',
        test: '测试网',
        local: '本地',
        mercury: '水星',
        remoteTest: '测试网',
        remoteMecury: '水星',
        closeRemote: '断开远程节点',
        connectRemote: '连接远程节点'
      },
      about: {
        title: '关于钱包',
        label: {
          developer: '开发商',
          version: '版本',
          copyright: '版权所属',
          function: '版本功能'
        },
        value: {
          developer: '开发商',
          version: '版本',
          copyright: '版权所属',
          function: '版本功能'
        }
      },
      btn: {
        help: '帮助',
        guide: '界面指引',
        update: '更新节点',
        reset: '重置钱包'
      },
      connectFail: '未连接到节点',
      loading: '更新中',

      swal: {
        updateSuccess: '更新成功!',
        cancel: '取消',
        confirm: '确定',
        warnText:
          '如果您重置钱包，所有记录会被删除。在您以后再导入钱包的时候，会一开始显示第一个账户。您可以点击“添加账户”按钮显示更多已存在的账户。',
        warn: '警告',
        startUpdate: '开始更新?',
        documentTitle: 'Dipperin 钱包'
      }
    }
  },
  create: {
    create: {
      return: '返回',
      title: '设置钱包登录密码',
      setPassword: '设置密码',
      repeatPassword: '确认密码',
      confirm: '确定',
      swal: {
        passwordLength: '请输入至少８位密码！',
        invalidPassword: '无效密码',
        diffPassword: '两次密码不一致！',
        confirm: '确定'
      }
    },
    backup: {
      return: '返回',
      title: '备份助记词',
      hint:
        '我们强烈建议您将助记词记录在纸上，放置在一个安全的地方。任何人得到这些助记词都可以进入您的钱包使用您的资产！',
      bottomHint: '请记下您的助记词。千万不要截屏！',
      confirm: '确定'
    },
    backupConfirm: {
      return: '返回',
      title: '确认助记词',
      hint: '请按顺序选择助记词',
      confirm: '确定',
      dialogText: '您的助记词将从本机删除！',
      cancel: '取消',
      dialogConfirm: '确认',
      swal: {
        wordsWrong: '选择单词错误！',
        success: '创建成功！',
        confirm: '确认'
      }
    },
    progressBar: {
      create: '创建钱包密码',
      backup: '备份助记词',
      confirm: '确认助记词'
    }
  },
  transaction: {
    send: {
      to: '接收地址',
      amount: '金额',
      note: '备注',
      fee: '交易费',
      moreThan: '不少于',
      transfer: '转账',
      walletPassword: '钱包密码',
      password: '密码',
      cancel: '取消',
      dialogSend: '发送',
      swal: {
        invalidAddress: '无效地址',
        insufficientFunds: '余额不足',
        invalidAmount: '无效数量',
        invalidFee: '无效交易费',
        success: '发送成功!',
        fail: '发送失败!',
        incorrectPassword: '密码错误!',
        confirm: '确认'
      }
    },
    txList: {
      time: '时间',
      from: '发送地址',
      to: '接收地址',
      amount: '交易额',
      state: '状态',
      operation: '操作',
      detail: '详情',
      noRecords: '暂无记录',
      title: '交易记录',
      pending: '打包中',
      success: '成功',
      fail: '失败'
    },
    txDetail: {
      value: '交易额',
      height: '块高度',
      timeStamps: '时间',
      transactions: '交易数',
      hash: '块哈希',
      parentHash: '父块哈希',
      miner: '矿工',
      diffculty: '难度值',
      size: '大小',
      nonce: 'Nonce',
      reward: '出块奖励',
      extraData: '备注',
      from: '发送地址',
      to: '接收地址',
      preTitle: '交易记录',
      title: '详情'
    }
  },

  account: {
    accounts: {
      add: '添加账户',
      account: '账户',
      copySuccess: '复制成功!',
      currentAccount: CurrentAccountCN
    },
    account: {
      transfer: '转账',
      send: '发送',
      receive: '接收'
    },
    accountInfo: {
      account: '账户',
      title: 'Dipperin 钱包',
      walletVersion: '钱包版本',
      dipperinVersion: 'Dipperin版本',
      height: '块高',
      timestamp: '时间戳',
      lock: '锁定钱包',
      langAb: 'CN',
      lang: '中文',
      start: '启动节点',
      stop: '关闭节点'
    }
  },

  contract: {
    contract: {
      add: '添加',
      favoriteContract: '收藏合约',
      contractType: '合约类型',
      contract: '合约',
      create: '创建',
      created: '创建',
      favorite: '收藏',
      status: '状态',
      address: '地址',
      name: '合约名',
      type: '合约类型',
      amount: '总量',
      balance: '余额',
      decimals: '精度',
      symbol: '标志',
      fee: '手续费',
      moreThan: '不少于',
      createTitle: '创建新通证',
      return: '返回',
      pending: '打包中',
      success: '成功',
      fail: '失败',
      addDialog: {
        title: '添加合约',
        label: '合约地址',
        btnText: '添加',
        addSuccess: '添加成功',
        addFailed: '找不到该合约',
        swalConfirm: '确定'
      },
      createSwal: {
        createSuccess: '创建合约成功',
        createErr: '创建合约出错',
        incorrectPassword: '密码错误',
        decimalLength: '精度不能超过18',
        feeMax: '手续费不足'
      },
      labs: {
        transfer: '合约转账',
        approve: '合约授权',
        transferFrom: '任意转账'
      },
      swal: {
        somethingWrong: '系统错误!'
      }
    },

    transfer: {
      lab: '合约转账',
      title: '合约转账',
      name: 'Token名',
      balance: '余额',
      toAddress: '接收地址',
      amount: '发送金额',
      transfer: '发送',
      swal: {
        transferSuccess: 'Token发送成功!',
        transferFail: 'Token发送失败!',
        tryAgain: '请重新提交!',
        incorrectPassword: '密码错误!',
        somethingWrong: '系统错误!',
        insufficientFunds: '余额不足!',
        invalidAddress: '无效地址!',
        confirm: '确定'
      }
    },
    approve: {
      lab: '合约授权',
      title: '合约授权',
      name: 'Token名',
      balance: '余额',
      toAddress: '接收地址',
      amount: '授权金额',
      approve: '授权',
      swal: {
        approveSuccess: 'Token发送成功!',
        approveFail: 'Token发送失败!',
        tryAgain: '请重新提交!',
        incorrectPassword: '密码错误!',
        somethingWrong: '系统错误!',
        insufficientFunds: '余额不足!',
        invalidAddress: '无效地址!',
        confirm: '确认'
      }
    },
    transferFrom: {
      lab: '任意转账',
      title: '任意转账',
      name: 'Token名',
      allowance: '授权余额',
      toAddress: '接收地址',
      amount: '转账金额',
      transfer: '转账',
      add: '添加授权地址',
      none: '暂无授权地址',
      ownerAddress: '授权地址',
      swal: {
        transferSuccess: 'Token发送成功!',
        transferFail: 'Token发送失败!',
        tryAgain: '请重新提交!',
        incorrectPassword: '密码错误!',
        somethingWrong: '系统错误!',
        insufficientFunds: '余额不足!',
        invalidAddress: '无效地址!',
        addressAleadyExist: '账户已经存在',
        addSuccess: '添加成功',
        confirm: '确定'
      },
      addDialog: {
        title: '添加授权地址',
        label: '授权地址',
        btnText: '添加'
      }
    },
    transferTx: {
      title: '发送历史',
      type: '类型',
      time: '时间',
      from: '发送地址',
      to: '接收地址',
      amount: '金额',
      status: '状态',
      noRecords: '暂无记录',
      pending: '打包中',
      success: '成功',
      fail: '失败'
    },
    menu: {
      transfer: '发送',
      history: '发送历史'
    }
  },
  dialog: {
    passwordDialog: {
      walletPassword: '钱包密码',
      password: '密码',
      cancel: '取消',
      confirm: '确认'
    }
  }
}

export type I18nCollection = typeof zhCN

export type I18nCollectionTransaction = typeof zhCN.transaction

export type I18nCollectionAccount = typeof zhCN.account

export type I18nCollectionContract = typeof zhCN.contract

export type I18nCollectionDialog = typeof zhCN.dialog

export type I18nCollectionWallet = typeof zhCN.wallet

export type I18nCollectionCreate = typeof zhCN.create

export const enUS: I18nCollection = {
  wallet: {
    accountTour: {
      switchAddress: 'Click here to switch addresses',
      addAccount: 'Click here to add account',
      selectAccount: 'Click here to select account',
      sendTransfer: 'You can send transactions here',
      qrcode: 'Here you can view the two-dimensional code of receipt'
    },
    login: {
      title: 'Unlock Wallet',
      password: 'Password',
      unlock: 'Unlock',
      lockText: 'Too many password attempts. Please wait patiently...',
      resetText: 'In case you forget password, you may restore the wallet using the mnemonic code',
      resetWallet: 'Reset Wallet',
      swal: {
        documentTitle: 'Dipperin Wallet',
        emptyPassword: 'Password is required!',
        incorrectPassword: 'Incorrect password',
        success: 'Success!',
        confirm: 'Ok',
        cancel: 'Cancel',
        resetConfirm: 'Confirm',
        warnText:
          'If you reset your wallet, all transaction records will be deleted. When you import this wallet somewhere later, it will initially only display the first account. You may display more existing accounts by simply clicking the "Add Account" button.',
        warn: 'Warning'
      }
    },
    import: {
      title: 'Import Wallet',
      mnemonic: 'Mnemonic Phrase',
      setPassword: 'Set Password',
      repeatPassword: 'Repeat Password',
      recovery: 'Recovery wallet',
      create: 'Create New Wallet',
      howToCreate: 'How to create new wallet',
      langAb: 'US',
      lang: 'English',
      swal: {
        success: 'Success!',
        mnemonicLength: 'You should provide 12 words of mnemonics',
        invalidMnemonic: 'Invalid mnemonics',
        passwordLength: 'Please fill in a password greater than or equal to 8 digits in length',
        invalidPassword: 'Invalid password',
        diffPassword: 'The first password is not equal to the second password!',
        confirm: 'Ok'
      },
      tour: {
        create: `If you don't already have a wallet, click here to create one!`,
        import: 'If you already have a wallet, enter a mnemonic here and set your password to restore the wallet!'
      }
    },
    sidebar: {
      wallet: 'Wallet',
      contract: 'Contract',
      setting: 'Setting',
      title: 'Dipperin Wallet',
      walletVersion: 'Wallet Version',
      dipperinVersion: 'Dipperin Version',
      height: 'Height',
      timestamp: 'Timestamp'
    },
    setting: {
      left: {
        title: 'Setting',
        info: 'Set up your wallet infomation'
      },
      net: {
        title: 'Select Local Node',
        remoteTitle: 'Select Remote Node',
        test: 'test',
        local: 'local',
        mercury: 'mecury',
        remoteTest: 'test',
        remoteMecury: 'mecury',
        closeRemote: 'disconnect remote node',
        connectRemote: 'connect remote node'
      },
      about: {
        title: 'About Wallet',
        label: {
          developer: 'Developer',
          version: 'Version',
          copyright: 'Copyright',
          function: '版本功能'
        },
        value: {
          developer: '开发商',
          version: '版本',
          copyright: '版权所属',
          function: '版本功能'
        }
      },
      btn: {
        help: 'help',
        guide: 'guide',
        update: 'update node',
        reset: 'reset wallet'
      },
      connectFail: `can't connect to dipperin node`,
      loading: 'Loading',

      swal: {
        updateSuccess: 'update success',
        cancel: 'Cancel',
        confirm: 'Confirm',
        warnText:
          'If you reset your wallet, all transaction records will be deleted. When you import this wallet somewhere later, it will initially only display the first account. You may display more existing accounts by simply clicking the "Add Account" button.',
        warn: 'Warning',
        startUpdate: 'Start update',
        documentTitle: 'Dipperin Wallet'
      }
    }
  },

  create: {
    create: {
      return: 'Return',
      title: 'Set your wallet login password',
      setPassword: 'Set Password',
      repeatPassword: 'Repeat Password',
      confirm: 'confirm',
      swal: {
        passwordLength: 'Please fill in a password greater than or equal to 8 digits in length!',
        invalidPassword: 'Invalid password',
        diffPassword: 'The first password is not equal to the second password!',
        confirm: 'OK'
      }
    },
    backup: {
      return: 'Return',
      title: 'Backup mnemonic',
      hint:
        'We highly recommend you write down the mnemonic words on paper and keep it in a safe place. Anyone who gets it can access and spend your assets.',
      bottomHint: 'Remember your mnemonic. DO NOT SCREENSHOT!',
      confirm: 'Confirm'
    },
    backupConfirm: {
      return: 'Return',
      title: 'Confirm mnemonic',
      hint: 'Please select mnemonic words in correct order.',
      confirm: 'Confirm',
      dialogText: 'Your mnemonic words will be removed from this device!',
      cancel: 'Cancel',
      dialogConfirm: 'Confirm',
      swal: {
        wordsWrong: 'Selected words is wrong!',
        success: 'Success!',
        confirm: 'Ok'
      }
    },
    progressBar: {
      create: 'Create wallet password',
      backup: 'Backup mnemonic',
      confirm: 'Confirm mnemonic'
    }
  },
  transaction: {
    send: {
      to: 'Receiver’s Address',
      amount: 'Amount',
      note: 'Note',
      fee: 'Poundage',
      moreThan: 'more than',
      transfer: 'Transfer',
      walletPassword: 'Wallet password',
      password: 'Password',
      cancel: 'Cancel',
      dialogSend: 'Send',
      swal: {
        invalidAddress: 'Provided address is invalid',
        insufficientFunds: 'Insufficient funds',
        invalidAmount: 'Invalid amount',
        invalidFee: 'Invalid poundage',
        success: 'Send transaction successful!',
        fail: 'Send transaction fail!',
        incorrectPassword: 'Incorrect password!',
        confirm: 'Ok'
      }
    },
    txList: {
      time: 'Time',
      from: 'From',
      to: 'To',
      amount: 'Amount',
      state: 'State',
      operation: 'Operation',
      detail: 'detail',
      noRecords: 'no records',
      title: 'Transaction records',
      pending: 'pending',
      success: 'success',
      fail: 'fail'
    },
    txDetail: {
      value: 'Value',
      height: 'Height',
      timeStamps: 'TimeStamps',
      transactions: 'Transactions',
      hash: 'Hash',
      parentHash: 'Parent Hash',
      miner: 'Miner',
      diffculty: 'Diffculty',
      size: 'Size',
      nonce: 'Nonce',
      reward: 'Block Reward',
      extraData: 'Extra Data',
      from: 'From',
      to: 'To',
      preTitle: 'Transaction records',
      title: 'Detail'
    }
  },

  account: {
    accounts: {
      add: 'Add account',
      account: 'Account',
      copySuccess: 'Replicating Success!',
      currentAccount: CurrentAccountUS
    },
    account: {
      transfer: 'Transfer',
      send: 'Send',
      receive: 'Receive'
    },
    accountInfo: {
      account: 'Account',
      title: 'Dipperin Wallet',
      walletVersion: 'Wallet Version',
      dipperinVersion: 'Dipperin Version',
      height: 'Height',
      timestamp: 'Timestamp',
      lock: 'Lock wallet',
      langAb: 'US',
      lang: 'English',
      start: 'Start node',
      stop: 'Stop node'
    }
  },

  contract: {
    contract: {
      add: 'Add',
      favoriteContract: 'favorite contract',
      contractType: 'Contract Type',
      contract: 'contract',
      create: 'Create',
      created: 'Created',
      favorite: 'Favorite',
      status: 'Status',
      address: 'Address',
      name: 'Name',
      type: 'Type',
      amount: 'Amount',
      balance: 'Balance',
      decimals: 'Decimals',
      symbol: 'Symbol',
      fee: 'Poundage',
      moreThan: 'more than',
      createTitle: 'Create New Token',
      return: 'Return',
      pending: 'pending',
      success: 'success',
      fail: 'fail',
      addDialog: {
        title: 'Add Smart Contract',
        label: 'Smart Contract Address',
        btnText: 'Add',
        addSuccess: 'Add contract success',
        addFailed: `Can't find this contract`,
        swalConfirm: 'OK'
      },
      createSwal: {
        createSuccess: 'Create contract success',
        createErr: 'Create contract error',
        incorrectPassword: 'Incorrect password',
        decimalLength: 'Decimal should not exceed 18',
        feeMax: 'Fee is less than the minimum fee'
      },
      labs: {
        transfer: 'Transfer',
        approve: 'Approve',
        transferFrom: 'Transfer From'
      },
      swal: {
        somethingWrong: 'Something wrong!'
      }
    },
    transfer: {
      lab: 'Transfer',
      title: 'Transfer Token',
      name: 'Token Name',
      balance: 'Balance',
      toAddress: 'To Address',
      amount: 'Transfer Amount',
      transfer: 'Transfer',
      swal: {
        transferSuccess: 'Transfer token success!',
        transferFail: 'Transfer fail!',
        tryAgain: 'Confirm and try again',
        incorrectPassword: 'Incorrect password!',
        somethingWrong: 'Something wrong!',
        insufficientFunds: 'Incufficient funds!',
        invalidAddress: 'Invalid address!',
        confirm: 'OK'
      }
    },
    approve: {
      lab: 'Approve',
      title: 'Approve Token',
      name: 'Token Name',
      balance: 'Balance',
      toAddress: 'To Address',
      amount: 'Approve Amount',
      approve: 'Approve',
      swal: {
        approveSuccess: 'Approve token success!',
        approveFail: 'Approve fail!',
        tryAgain: 'Confirm and try again',
        incorrectPassword: 'Incorrect password!',
        somethingWrong: 'Something wrong!',
        insufficientFunds: 'Incufficient funds!',
        invalidAddress: 'Invalid address!',
        confirm: 'OK'
      }
    },
    transferFrom: {
      lab: 'Transfer From',
      title: 'Transfer From',
      name: 'Token Name',
      allowance: 'Allowance',
      toAddress: 'To Address',
      amount: 'Transfer amount',
      transfer: 'Transfer',
      add: 'Add Owner Address',
      none: 'None owneradress',
      ownerAddress: 'Owner Address',
      swal: {
        transferSuccess: 'Transfer token success!',
        transferFail: 'Transfer fail!',
        tryAgain: 'Confirm and try again',
        incorrectPassword: 'Incorrect password!',
        somethingWrong: 'Something wrong!',
        insufficientFunds: 'Incufficient funds!',
        invalidAddress: 'Invalid address!',
        addressAleadyExist: 'Address aleady exist',
        addSuccess: 'Add success',
        confirm: 'OK'
      },
      addDialog: {
        title: 'Add owner address',
        label: 'Owner address',
        btnText: 'Add'
      }
    },
    transferTx: {
      title: 'Transfer History',
      type: 'Type',
      time: 'Time',
      from: 'From',
      to: 'To',
      amount: 'Amount',
      status: 'Status',
      noRecords: 'NoRecords',
      pending: 'pending',
      success: 'success',
      fail: 'fail'
    },
    menu: {
      transfer: 'transfer',
      history: 'transfer history'
    }
  },
  dialog: {
    passwordDialog: {
      walletPassword: 'Wallet password',
      password: 'Password',
      cancel: 'Cancel',
      confirm: 'Confirm'
    }
  }
}

export default {
  'zh-CN': zhCN,
  'en-US': enUS
}
