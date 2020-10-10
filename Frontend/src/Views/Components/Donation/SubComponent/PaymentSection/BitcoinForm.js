import React, { useState } from 'react'
import { Col, Container, Image, Nav, Row, Tab } from 'react-bootstrap'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useTranslation } from 'react-i18next'
import { FaCopy } from 'react-icons/fa'
import SwipeableViews from 'react-swipeable-views'

const BitcoinForm = () => {
  const [tabKey, setTabKey] = useState(0);
  
  const [crypto, setCrypto] = useState({
    bitcoin: false,
    ethereum: false,
    litecoin: false,
  })
  const { t, i18n } = useTranslation()
  
  const defaultCrypto = {
    bitcoin: false,
    ethereum: false,
    litecoin: false,
  }
  const resetCrypto = () => {
    setTimeout(() => {
      setCrypto({...defaultCrypto});
    }, 3000)
  }
  const BITCOIN_PAYMENT_TYPES = t('BITCOIN_PAYMENT_TYPES', { returnObjects: true })
  return (
      <Container className="crypto-tabs">
        <div className="tabs">
          <Tab.Container
              id="controlled-tab-example"
              defaultActiveKey="0"
              activeKey={tabKey}
              onSelect={(key) => setTabKey(parseInt(key))}
          >
            <Col>
              <Row sm={3}>
                <Nav>
                  <Nav.Item>
                    <Nav.Link eventKey="0">{BITCOIN_PAYMENT_TYPES[0]}</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="1">{BITCOIN_PAYMENT_TYPES[1]}</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="2">{BITCOIN_PAYMENT_TYPES[2]}</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Row>
            </Col>
          </Tab.Container>
        </div>
        {/* Swipable section */}
        {/* SwipeableViews is added so user can use touch screen and mouse to switch between views */}
        <SwipeableViews index={tabKey}>
          <div className="slide firstSlide">
            <div className="qr-item">
              <h2>{t('BITCOIN_TEXT')}</h2>
              <Image src="/assets/donation/bitcoin-qr.jpg" fluid className="qr"/>
              <div className="copied-status">
                {crypto.bitcoin ? <span style={{color: '#fa755a'}}>Copié.</span> : null}
              </div>
              <div className="qr-code">
                  <span className="qr-code-digit">
                    3QW3yEqU7R8xtyajkzhNKgtkbXT3bacBD7
                  </span>
          
                <CopyToClipboard
                    text="3QW3yEqU7R8xtyajkzhNKgtkbXT3bacBD7"
                    onCopy={() => {
                      setCrypto({...defaultCrypto, bitcoin: true})
                      resetCrypto();
                    }}
                >
                  <button className="copy-buttom">
                    <FaCopy size="15px"/>
                  </button>
                </CopyToClipboard>
              </div>
            </div>
          </div>
          <div className="slide secondSlide">
            <div className="qr-item">
              <h2>{t('ETHEREUM_TEXT')}</h2>
              <Image src="/assets/donation/ethereum-qr.jpg" fluid className="qr"/>
              <div className="copied-status">
                {crypto.ethereum ? <span style={{color: '#fa755a'}}>Copié.</span> : null}
              </div>
              <div className="qr-code">
                  <span className="qr-code-digit">
                    0xE7231F399441420FC2Aa19cA9302Ed679D280040
                  </span>
          
                <CopyToClipboard
                    text="0xE7231F399441420FC2Aa19cA9302Ed679D280040"
                    onCopy={() => {
                      setCrypto({...defaultCrypto, ethereum: true});
                      resetCrypto();
                    }}
          
                >
                  <button className="copy-buttom">
                    <FaCopy size="15px"/>
                  </button>
                </CopyToClipboard>
              </div>
            </div>
          </div>
          <div className="slide thirdSlide">
            <div className="qr-item">
              <h2>{t('LITECOIN_TEXT')}</h2>
              <Image src="/assets/donation/litecoin-qr.jpg" fluid className="qr"/>
              <div className="copied-status">
                {crypto.litecoin ? <span style={{color: '#fa755a'}}>Copié.</span> : null}
              </div>
              <div className="qr-code">
                  <span className="qr-code-digit">
                    MGmftyKJKAVCajbEo7NcoMHHQsJ2BCMKJi
                  </span>
          
                <CopyToClipboard
                    text="MGmftyKJKAVCajbEo7NcoMHHQsJ2BCMKJi"
                    onCopy={() => {
                      setCrypto({...defaultCrypto, litecoin: true});
                      resetCrypto();
                    }}
          
                >
                  <button className="copy-buttom">
                    <FaCopy size="15px"/>
                  </button>
                </CopyToClipboard>
              </div>
            </div>
          </div>
        </SwipeableViews>
      </Container>
  );
};

export default BitcoinForm;
