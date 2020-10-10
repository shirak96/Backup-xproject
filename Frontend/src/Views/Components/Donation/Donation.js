import React from 'react'
import { Col, Container, Image, Row } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
//scss
import './Donation.scss'
//Custom Components
import PaymentSetion from './SubComponent/PaymentSection/PaymentSection.js'

const Donation = (props) => {
  const { t, i18n } = useTranslation()
  const DONATE_PAGE_TEXT_SECTION_ONE = t('DONATE_PAGE_TEXT_SECTION_ONE', { returnObjects: true })
  return (
    <div className="Donation">
      <Container>
        <Row>
          <Col xs={12} md={6}>
            <Image
              className="Img1"
              src="/assets/donation/Img1.jpg"
              fluid
            />
            <p className="pdonate">
              {DONATE_PAGE_TEXT_SECTION_ONE[0]}
              <span className="porange">{DONATE_PAGE_TEXT_SECTION_ONE[1]}</span>
              {DONATE_PAGE_TEXT_SECTION_ONE[2]}
              <span className="porange">{DONATE_PAGE_TEXT_SECTION_ONE[3]}</span>
              {DONATE_PAGE_TEXT_SECTION_ONE[4]}
            </p>
            
            <div className="image-container">
              <Image
                className="Img2"
                src="/assets/donation/Img2.png"
                fluid
              />
            </div>
            <p className="pdate">{t('DONATE_PAGE_TEXT_DATE')}</p>
            <p className="pdonate">
              {t('DONATE_PAGE_TEXT_SECTION_TWO')}
            </p>
          </Col>
          
          <Col xs={12} md={6}>
            <h1>{t('DONATE_PAGE_HEADER')}</h1>
            <p>
              {t('DONATE_PAGE_TEXT')}
            </p>
            
            <PaymentSetion {...props}/>
          </Col>
        
        </Row>
      </Container>
    </div>
  )
}


export default Donation;
