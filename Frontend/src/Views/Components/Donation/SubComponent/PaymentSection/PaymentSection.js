import { loadStripe } from '@stripe/stripe-js'
import React from 'react'
import { Container, Image } from 'react-bootstrap'
import { withTranslation } from 'react-i18next'
import Select from 'react-select'

import { Controller as DonationController } from '../../../../../Controllers/donation-Controller'

import bitcoin from './assets/bitcoin.png'
import ethereum from './assets/ethereum.png'
import litecoin from './assets/litecoin.png'
import master from './assets/master.png'
import paypal from './assets/paypal.png'
import visa from './assets/visa.png'

import BitcoinForm from './BitcoinForm'
import DonorInfo from './DonorInfo'
//scss
import './PaymentSection.scss'
import PayPalForm from './PayPalForm'
import StripeForm from './StripeForm'

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

class PaymentSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: null,
      donationAmount: 1,
      formProcess: false,
      donationDone: false,
      donationInfoDone: false,
      donationType: null,
      donationTransactionID: null,
      donorInfo: {
        email: '',
        name: '',
        about: '',
        logo: null,
      },
    };
  }
  componentDidMount() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if (this.props.location.pathname === '/donation/paypal/success') {
      const paymentId = urlParams.get('paymentId')
      const PayerID = urlParams.get('PayerID')
      const donation_amount = localStorage.getItem('donation_amount');
      try {
        DonationController.executePayPalPayment({amount: donation_amount, PayerID: PayerID, paymentId: paymentId})
  
      } catch (e) {
        console.log(e.message)
      }
      this.setState({
        donationDone: true,
        donationType: 'paypal',
        donationTransactionID: paymentId,
      })
    }
  }
  componentWillReceiveProps(nextProps, nextContext) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if (nextProps.location.pathname === '/donation/paypal/success') {
      const paymentId = urlParams.get('paymentId')
      this.setState({
        donationDone: true,
        donationType: 'paypal',
        donationTransactionID: paymentId,
      })
    }
  }
  
  handleDonationPaymentDone = ({donationTransactionID, donationType}) => {
    this.setState({
      formProcess: false,
      donationDone: true,
      donationType: donationType,
      donationTransactionID: donationTransactionID,
    })
  }
  
  handleInfoSubmit = async (event) => {
    event.preventDefault();
    const {donorInfo, donationTransactionID, donationType} = this.state;
    const {email, name, about} = donorInfo;
    
    try {
      await DonationController.processDonorInfo({
        email, full_name: name, about, type: donationType, transaction_id: donationTransactionID,
      });
      
      this.setState({
        donationInfoDone: true,
        donationDone: true,
      })
    } catch (e) {
    
    }
  }
  
  handlePaymentMethodChange = (selectedOption) => {
    this.setState({selectedOption});
  };
  
  handleDonorInfoChange = (event) => {
    event.preventDefault();
    this.setState({
      donorInfo: {
        ...this.state.donorInfo,
        [event.target.name]: event.target.value,
      },
    });
  };
  
  handleDonorLogoChange = (event) => {
    event.preventDefault();
    const files = event.target.files;
    const logo = files.length > 0 ? files[0] : null;
    this.setState({
      donorInfo: {
        ...this.state.donorInfo, logo: logo,
      },
    });
  }
  
  handleDonationAmount = (event) => {
    event.preventDefault();
    const value = event.target.value;
    
    if (parseFloat(value) > 0) {
      this.setState({
        donationAmount: value,
      });
    } else if (value === '') {
      this.setState({
        donationAmount: 1,
      });
    }
  };
  
  handlePayPalPayment = async (event) => {
    event.preventDefault();
    
    const result = await DonationController.processPayPalPayment({
      amount: this.state.donationAmount,
    });
    localStorage.setItem('donation_amount', this.state.donationAmount)
    if (result.status.code === 200) {
      const win = window.open(result.data, '_self');
      win.focus();
    }
  };
  
  setProcessingTo = (bool) => {
    this.setState({
      formProcess: bool,
    });
  };
  
  renderPaymentFrom = () => {
    const selectedOption =
        this.state.selectedOption !== null
            ? this.state.selectedOption.value
            : null;
    
    return (
        <div className="payment-form">
          {selectedOption === null ? <DefaultSelection/> : null}
          {selectedOption === 'Credit / Debit Card' ? (
              <StripeForm
                  donationAmount={this.state.donationAmount}
                  handleDonationAmount={this.handleDonationAmount}
                  handleDonorInfoChange={this.handleDonorInfoChange}
                  donorInfo={this.state.donorInfo}
                  stripePromise={stripePromise}
                  handleDonationPaymentDone={this.handleDonationPaymentDone}
                  setProcessingTo={this.setProcessingTo}
              />
          ) : null}
          {selectedOption === 'Paypal' ? (
              <PayPalForm
                  donationAmount={this.state.donationAmount}
                  handleDonationAmount={this.handleDonationAmount}
                  handlePayPalPayment={this.handlePayPalPayment}
              />
          ) : null}
          {selectedOption === 'Bitcoin' ? <BitcoinForm/> : null}
        </div>
    );
  };
  
  render() {
    const {selectedOption, donationDone, donationInfoDone, donorInfo, formProcess} = this.state;
    const {handleDonorLogoChange, handleInfoSubmit, handleDonorInfoChange} = this;
  
    const options = [
      { value: 'Credit / Debit Card', label: this.props.t('DONATE_PAGE_DROPDOWN_CARD') },
      { value: 'Paypal', label: this.props.t('DONATE_PAGE_DROPDOWN_PAYPAL') },
      { value: 'Bitcoin', label: this.props.t('DONATE_PAGE_DROPDOWN_CREPTO') },
    ]
    return (
        <div className="PaymentSection">
          {
            !donationDone ? (
                <>
                  <Select
                    className="selector"
                    value={selectedOption}
                    onChange={this.handlePaymentMethodChange}
                    options={options}
                    placeholder={this.props.t('DONATE_PAGE_SELECT_PAYMENT_OPTION')}
                  />
                  {this.renderPaymentFrom()}
                </>
            ) : donationInfoDone ? (
                <>
                  <div>
                    <h2>{this.props.t('DONATE_PAGE_THANK_U_MSG_ONE')} {donorInfo.name.charAt(0).toUpperCase() + donorInfo.name.slice(1)}</h2>
  
                    <p>{this.props.t('DONATE_PAGE_THANK_U_MSG_TWO')}</p>
                  </div>
                </>
            ) : <DonorInfo donorInfo={donorInfo} handleInfoSubmit={handleInfoSubmit}
                           handleDonorLogoChange={handleDonorLogoChange}
                           formProcess={formProcess} handleDonorInfoChange={handleDonorInfoChange}/>
          }
        
        </div>
    );
  }
}

const DefaultSelection = () => {
  return (
      <Container className={'payments-methods'}>
        <Image src={master} className="master-img" fluid/>{' '}
        <Image src={visa}  className="visa-img" fluid/>{' '}
        <Image src={paypal} className="paypal-img" fluid/>
        <Image src={bitcoin} className="bitcoin-img" fluid/>{' '}
        <Image src={ethereum} className="ethereum-img" fluid/>{' '}
        <Image src={litecoin} className="litecoin-img" fluid/>{' '}
      </Container>
  );
};
export default withTranslation()(PaymentSection)
