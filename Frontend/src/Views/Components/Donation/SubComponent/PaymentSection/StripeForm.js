import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js'
import React, { useState } from 'react'
import { Col, Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { FaDollarSign, FaEnvelope } from 'react-icons/fa'
import { Controller as DonationController } from '../../../../../Controllers/donation-Controller'
import { getLanguage } from '../../../../../utils/lang'

const CheckoutForm = ({
                        handleDonorInfoChange,
                        donationAmount,
                        handleDonationAmount,
                        email,
                        handleDonationPaymentDone,
                      }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [formProcess, setFormProcess] = useState(false);
  const { t, i18n } = useTranslation()
  
  const handleStripeSubmit = async (event) => {
    // Block native form submission.
    event.preventDefault();
    const billingDetails = {
      email: email,
    };
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }
    setFormProcess(true);
    
    setTimeout(async () => {
      
      // Get a reference to a mounted CardElement. Elements knows how
      // to find your CardElement because there can only ever be one of
      // each type of element.
      const cardElement = elements.getElement(CardElement);
      
      try {
        const data = await DonationController.processStripePayment({
          amount: donationAmount * 100,
        });
        
        console.log(data)
        const clientSecret = data.data;
        const paymentMethodReq = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
          billing_details: billingDetails,
        });
        
        if (paymentMethodReq.error) {
          // setCheckoutError(paymentMethodReq.error.message);
          alert(paymentMethodReq.error.message);
          setFormProcess(false);
          return;
        }
        
        const {error, paymentIntent} = await stripe.confirmCardPayment(clientSecret, {
          payment_method: paymentMethodReq.paymentMethod.id,
        });
        
        if (error) {
          // setCheckoutError(error.message);
          alert(error.message);
          setFormProcess(false);
          return;
        }
        handleDonationPaymentDone({donationTransactionID: paymentIntent.id, donationType: 'stripe'})
        // onSuccessfulCheckout();
      } catch (err) {
        // setCheckoutError(err.message);
        alert(err.message);
      }
    }, 500)
  };
  
  return (
      <form onSubmit={handleStripeSubmit}>
        <div className="panel-body">
          <h2>{t('CARD_HEADER')}</h2>
          <div className="row">
            <div className="col-xs-12 col-md-12">
              <Form.Group
                  as={Col}
                  controlId="formGridEmail"
                  className="amount-wrapper"
              >
                <label className="input-label">{t('CARD_HEADER_EMAIL')}</label>
                <Form.Control
                  type="email"
                  value={email}
                  name={'email'}
                  required
                  onChange={handleDonorInfoChange}
                  placeholder={t('CARD_EMAIL_PLACEHOLDER')}
                />
                <Form.Label className="currency-label">
                  <FaEnvelope/>
                </Form.Label>
              </Form.Group>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 col-md-12">
              <Form.Group
                  as={Col}
                  controlId="formGridEmail"
                  className="amount-wrapper"
              >
                <label className="input-label">{t('CARD_AMOUNT_TEXT')}</label>
                <Form.Control
                  type="number"
                  value={donationAmount}
                  onChange={handleDonationAmount}
                  placeholder={t('CARD_AMOUNT_TEXT_PLACEHOLDER')}
                />
                <Form.Label className="currency-label">
                  <FaDollarSign/>
                </Form.Label>
              </Form.Group>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 col-md-12">
              <CardElement
                  options={{
                    hidePostalCode: true,
                    lang: getLanguage(),
                    style: {
                      base: {
                        fontSize: '18px',
                        color: '#424770',
                        '::placeholder': {
                          color: '#495057',
                        },
                      },
                      invalid: {
                        color: '#9e2146',
                      },
                    },
                  }}
              />
            </div>
          </div>
        </div>
        <div className="panel-footer">
          <div className="row">
            <div className="col-xs-12 col-md-12">
              {formProcess ? (
                  <span className="btn btn-primary btn-lg btn-block">
               {t('CARD_PAYMENT_WAIT')}
              </span>
              ) : (
                  <button className="btn btn-primary btn-lg btn-block">
                    {t('CARD_PAYMENT_BUTTON')}
                  </button>
              )}
            </div>
          </div>
        </div>
      </form>
  );
};


const StripeForm = (props) => {
  const {
    donorInfo,
    handleDonorInfoChange,
    donationAmount,
    handleDonationAmount,
    stripePromise,
    handleDonationPaymentDone,
  } = props;
  const {email} = donorInfo;
  
  return (
      <div className="container">
        <div className="row">
          <div className="col-xs-12  mr-auto ml-auto">
            <div className="panel panel-default">
              <Elements stripe={stripePromise}>
                <CheckoutForm
                    handleDonorInfoChange={handleDonorInfoChange}
                    handleDonationPaymentDone={handleDonationPaymentDone}
                    donationAmount={donationAmount}
                    email={email}
                    handleDonationAmount={handleDonationAmount}
                />
              </Elements>
            </div>
          </div>
        </div>
      </div>
  );
};

export default StripeForm;
