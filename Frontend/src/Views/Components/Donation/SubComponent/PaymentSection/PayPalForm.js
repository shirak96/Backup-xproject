import React from 'react'
import { Col, Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

import { FaDollarSign } from 'react-icons/fa'

const PayPalForm = (props) => {
  const { donationAmount, handleDonationAmount, handlePayPalPayment } = props;
  const { t, i18n } = useTranslation()
  
  return (
      <div className="container paypal-from">
        <div className="row">
          <div className="col-xs-12  col-lg-12  ">
            <div className="panel panel-default">
              <div className="panel-body">
                <h2>{t('PAYPAL_HEADER')}</h2>
                <div className="row">
                  <div className="col-xs-12 col-md-12">
                    <Form.Group
                        as={Col}
                        controlId="formGridEmail"
                        className="amount-wrapper"
                    >
                      <label className="input-label">{t('PAYPAL_TEXT')}</label>
                      <Form.Control
                        type="number"
                        value={donationAmount}
                        onChange={handleDonationAmount}
                        placeholder={t('PAYPAL_AMOUNT')}
                      />
                      <Form.Label className="currency-label">
                        <FaDollarSign />
                      </Form.Label>
                    </Form.Group>
                  </div>
                </div>
              </div>
              <div className="panel-footer">
                <div className="row">
                  <div className="col-xs-12 col-md-12">
                    <button
                        className="btn paypal-button btn-primary btn-lg btn-block"
                        onClick={handlePayPalPayment}
                    >
                      {t('PAYPAL_BUTTON')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};
export default PayPalForm;
