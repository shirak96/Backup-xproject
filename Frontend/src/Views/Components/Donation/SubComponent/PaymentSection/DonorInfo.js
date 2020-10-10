import React from 'react'
import { Col, Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { FaComment, FaEnvelope, FaUser } from 'react-icons/fa'

import './DonorInfo.scss'

const DonorInfo = ({handleInfoSubmit, donorInfo, handleDonorInfoChange, formProcess}) => {
  const {email, name, about} = donorInfo;
  const { t, i18n } = useTranslation()
  const DONATION_PAGE = t('DONATION_PAGE', { returnObjects: true })
  return (
      <div className="container">
        <div className="row">
          <div className="col-xs-12  mr-auto ml-auto">
            <div className="panel panel-default">
              <form onSubmit={handleInfoSubmit}>
                <div className="panel-body">
                  <h2>{DONATION_PAGE.HEADER}</h2>
                  <div className="row">
                    <div className="col-xs-12 col-md-12">
                      <Form.Group
                          as={Col}
                      >
                        <label className="input-label">{DONATION_PAGE.EMAIL}</label>
                        <Form.Control
                          type="text"
                          defaultValue={email}
                          name={'email'}
                          required
                          onChange={handleDonorInfoChange}
                          placeholder={DONATION_PAGE.EMAIL_PLACEHOLDER}
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
                      >
                        <label className="input-label">{DONATION_PAGE.NAME}</label>
                        <Form.Control
                          type="text"
                          defaultValue={name}
                          name={'name'}
                          required
                          onChange={handleDonorInfoChange}
                          placeholder={DONATION_PAGE.NAME_PLACEHOLDER}
                        />
                        <Form.Label className="currency-label">
                          <FaUser/>
                        </Form.Label>
                      </Form.Group>
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-xs-12 col-md-12">
                      <Form.Group
                          as={Col}
                      >
                        <label className="input-label">{DONATION_PAGE.A_WORD_FOR_US}</label>
                        <Form.Control
                            as="textarea" rows="3"
                            defaultValue={about}
                            name="about"
                            onChange={handleDonorInfoChange}
                            placeholder={DONATION_PAGE.A_WORD_FOR_US}
                        />
                        <Form.Label className="currency-label">
                          <FaComment/>
                        </Form.Label>
                      </Form.Group>
                    </div>
                  </div>
                </div>
                <div className="panel-footer">
                  <div className="row">
                    <div className="col-xs-12 col-md-12">
                      {
                        formProcess ? (
                            <span className="btn btn-primary btn-lg btn-block">
                           {DONATION_PAGE.WAIT}
                          </span>
                        ) : (
                            <button className="btn btn-primary btn-lg btn-block">
                              {DONATION_PAGE.CONTINUE}
                            </button>
                        )
                      }
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
  )
}

export default DonorInfo;
