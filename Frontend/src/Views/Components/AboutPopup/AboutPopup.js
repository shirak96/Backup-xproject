import React from 'react'
import { Button, Col, Container, Image, Modal, Row } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
//scss
import './Aboutpopup.scss'

//Custom Components

const AboutPopup = (props) => {
  const { t, i18n } = useTranslation()
  
  return (
    <Modal size="xl" dialogClassName="aboutpopup" show={props.showPopup}
           onHide={props.handlePopupClose}>
      <Modal.Header>
        <Image
          src={process.env.PUBLIC_URL + '/Logoimg.png'}
          fluid
        />
      </Modal.Header>
      <Modal.Body>
        
        <Container>
          <Row className="show-grid">
            <Col xs={12} md={5}>
              <Image src="/assets/about-popup/Img1.jpg" className="aboutpopupimg" fluid/>
            </Col>
            <Col xs={6} md={7}>
              <p> {t('ABOUT_POPUP_SECTION_ONE')}
              </p>
            </Col>
          </Row>
          
          <Row className="show-grid">
            <Col xs={6} md={7}>
              <h1> {t('ABOUT_POPUP_SECTION_TWO_HEADER')} </h1>
              <p> {t('ABOUT_POPUP_SECTION_TWO')}
              </p>
            </Col>
            <Col xs={12} md={5}>
              <Image src="/assets/about-popup/Img2.jpg" className="aboutpopupimg" fluid/>
            </Col>
          </Row>
        </Container>
      
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.handlePopupClose}>
          {t('ABOUT_POPUP_BUTTON')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AboutPopup;
