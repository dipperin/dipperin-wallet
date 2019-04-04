import React from 'react'
import Tour from 'reactour'
import { observer } from 'mobx-react'
import { observable, action } from 'mobx'
import { WithTranslation, withTranslation } from 'react-i18next'
import { I18nCollectionWallet } from '@/i18n/i18n'

interface WrapProps {
  closeTour: () => void
  toogleAccountsPage: (isShow: boolean) => void
  toogleTransferPage: (isSend: boolean) => void
}

interface Props extends WrapProps {
  labels: I18nCollectionWallet['accountTour']
}

@observer
export class MainTour extends React.Component<Props> {
  // tour guide
  @observable
  step: number = 0

  @action
  handNextStep = () => {
    if (this.step === 4) {
      this.props.closeTour()
      return
    }
    switch (this.step) {
      case 0:
        this.props.toogleAccountsPage(true)
        break
      case 2:
        this.props.toogleAccountsPage(false)
        break
      case 3:
        this.props.toogleTransferPage(false)
    }
    ++this.step
  }

  @action
  handPreStep = async () => {
    if (this.step === 0) {
      return
    }
    switch (this.step) {
      case 1:
        this.props.toogleAccountsPage(false)
        break
      case 3:
        this.props.toogleAccountsPage(true)
        break
      case 4:
        this.props.toogleTransferPage(true)
    }
    --this.step
  }

  render() {
    const { labels } = this.props
    const steps = [
      {
        selector: `[data-tour='change-account']`,
        content: labels.switchAddress,
        style: tourStyles
      },
      {
        selector: `.tour-add`,
        content: labels.addAccount,
        style: tourStyles
      },
      {
        selector: '.tour-account:first-child',
        content: labels.selectAccount,
        style: tourStyles
      },
      {
        selector: `[data-tour='send-form']`,
        content: labels.sendTransfer,
        style: tourStyles
      },

      {
        selector: `[data-tour='send-form']`,
        content: labels.qrcode,
        style: tourStyles
      }
    ]
    return (
      <Tour
        steps={steps}
        isOpen={true}
        goToStep={this.step}
        closeWithMask={false}
        disableInteraction={true}
        lastStepNextButton={'ok'}
        onRequestClose={this.props.closeTour}
        nextStep={this.handNextStep}
        prevStep={this.handPreStep}
        disableDotsNavigation={true}
      />
    )
  }
}

// export default withNamespaces('accountTour')(MainTour)

const MainWrap = (props: WrapProps & WithTranslation) => {
  const { t, ...other } = props
  return <MainTour {...other} labels={t('wallet:accountTour')} />
}
export default withTranslation()(MainWrap)

const tourStyles = {
  borderRadius: '4px'
}
