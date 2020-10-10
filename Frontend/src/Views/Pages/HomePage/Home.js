import React, { Component } from 'react'
import { Container, Row } from 'react-bootstrap'
import { withTranslation } from 'react-i18next'
import AboutPopup from '../../Components/AboutPopup/AboutPopup.js'
import MapSection from '../../Components/MapSection/MapSection.js'
import NewsSlider from '../../Components/NewsSlider'
//Custom Components
import Splash from '../../Components/Splash/Splash.js';

//scss
import './Home.scss'

class Home extends Component {
    constructor (props) {
        super(props)
        this.state = {
            showPopup: false,
        }
    }
    
    handleSplashDone = () => {
        this.props.handleSplashDone(() => {
            // setTimeout(this.handlePopupShow, 300)
            
            setTimeout(() => {
                this.handlePopupShow()
            }, 300)
        })
    } // what is happening ?
    
    handlePopupClose = () => {
        this.setState({
            showPopup: false,
        })
    }
    
    handlePopupShow = () => {
        this.setState({
            showPopup: true,
        })
    }
    
    render () {
        const { showPopup } = this.state
        const { showSplash } = this.props
        const { handleSplashDone, handlePopupClose } = this
        
        const t = this.props.t
        return (
          <Container className="home">
              <div>
                  <Splash showSplash={showSplash} handleSplashDone={handleSplashDone}/>
                  <AboutPopup showPopup={showPopup} handlePopupClose={handlePopupClose}/>
                  <Row>
                      <div className="mid-section">
                          <MapSection/>
                      </div>
                  </Row>
                  {
                      showSplash === false ? (
                        <>
    
                            <Row>
                                <div className="news-container">
                                    
                                    <div className="bar-section">
                                        <h2>{t('NEWS_BAR_NEWS_HEADER')}</h2>
                                        <NewsSlider type='news'/>
                                    </div>
                                    
                                    <div className="bar-section">
                                        <h2>{t('NEW_BAR_SPONSORS_HEADER')}</h2>
                                        <NewsSlider type="sponsors"/>
                                    </div>
                                </div>
                            </Row>
                        
                        </>
                      ) : null
                  }
              </div>
          </Container>
        )
    }
}

export default withTranslation()(Home)
