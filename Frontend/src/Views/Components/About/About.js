import React, { useEffect, useState } from 'react'
import { Col, Container, Image, Nav, Row, Tab } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from 'react-icons/fa'
import SwipeableViews from 'react-swipeable-views'
import { Controller as SponsorController } from '../../../Controllers/sponsor-Controller'
import { getLanguage } from '../../../utils/lang'

import './About.scss'

const About = () => {
  const [state, setState] = useState({
    tabKey: 0,
    sponsors: [],
  })
  const { t, i18n } = useTranslation()
  
  useEffect(() => {
    getSponsorList()
  }, [i18n.language])
  const handleTabClick = (key) => {
    key = parseInt(key)
    setState({ ...state, tabKey: key })
  }
  const getSponsorList = async () => {
    
    try {
      const result = await SponsorController.getSponsorList(getLanguage())
      if (result.status.code === 200) {
        const sponsors = result.data
        setState({ ...state, sponsors })
      } else {
        setState({ ...state, error_message: result.message })
      }
    } catch (err) {
      setState({ ...state, error_message: err.message })
    }
  }
  
  const { tabKey } = state
  
  const ABOUT_US_TAB_SECTION_ONE = t('ABOUT_US_TAB_SECTION_ONE', { returnObjects: true })
  const ABOUT_US_TAB_SECTION_TWO_HEADER = t('ABOUT_US_TAB_SECTION_TWO_HEADER', { returnObjects: true })
  const TEAM_TAB_PERSON_ONE_LI = t('TEAM_TAB_PERSON_ONE_LI', { returnObjects: true })
  const TEAM_TAB_PERSON_TWO_LI = t('TEAM_TAB_PERSON_TWO_LI', { returnObjects: true })
  const TEAM_TAB_PERSON_THREE_LI = t('TEAM_TAB_PERSON_THREE_LI', { returnObjects: true })
  const TEAM_TAB_PERSON_FOUR_LI = t('TEAM_TAB_PERSON_FOUR_LI', { returnObjects: true })
  const TEAM_TAB_PERSON_FIVE_LI = t('TEAM_TAB_PERSON_FIVE_LI', { returnObjects: true })
  const TEAM_TAB_PERSON_SIX_LI = t('TEAM_TAB_PERSON_SIX_LI', { returnObjects: true })
  const TEAM_TAB_PERSON_SEVEN_LI = t('TEAM_TAB_PERSON_SEVEN_LI', { returnObjects: true })
  const TECH_SUPPORT_TAB_PERSON_TWO_LI = t('TECH_SUPPORT_TAB_PERSON_TWO_LI', { returnObjects: true })
  const DEV_TAB_PERSON_ONE_LI = t('DEV_TAB_PERSON_ONE_LI', { returnObjects: true })
  const DEV_TAB_PERSON_TWO_LI = t('DEV_TAB_PERSON_TWO_LI', { returnObjects: true })
  const DEV_TAB_PERSON_THREE_LI = t('DEV_TAB_PERSON_THREE_LI', { returnObjects: true })
  return (
    <div className="About">
      {/* tabs section */}
      <div className="tabs">
        <Tab.Container
          id="controlled-tab-example"
          defaultActiveKey="0"
          unmountOnExit={true}
          activeKey={tabKey}
          onSelect={(key) => handleTabClick(key)}
        >
          <Col>
            <Row sm={3}>
              <Nav>
                <Nav.Item>
                  <Nav.Link eventKey="0">{t('ABOUT_US_TAB_HEADER')}</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="1">{t('TEAM_TAB_HEADER')}</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="2">{t('TECH_SUPPORT_TAB_HEADER')}</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="3">{t('ABOUT_PAGE_SPONSORS_TAB')}</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="4">{t('ABOUT_PAGE_DEVELOPER_TAB')}</Nav.Link>
                </Nav.Item>
              </Nav>
            </Row>
          </Col>
        </Tab.Container>
      </div>
      {/* Swipable section */}
      <SwipeableViews index={tabKey} axis={'x-reverse'}>
        
        <div className="slide aboutus" style={{ height: tabKey === 0 ? 'unset' : '0px' }}>
          <Container>
            <Row>
              <div className="border_arc"/>
              <Col xs={12} md={4}>
                <Image src="/assets/about/img1.png" className="img1about" fluid/>
                <p>
                  {ABOUT_US_TAB_SECTION_ONE[0]}<br/>
                  <span className="textorange">{ABOUT_US_TAB_SECTION_ONE[1]}</span>
                  {ABOUT_US_TAB_SECTION_ONE[2]}
                  <span className="textorange">{ABOUT_US_TAB_SECTION_ONE[3]}</span>
                  {ABOUT_US_TAB_SECTION_ONE[4]}
                </p>
              </Col>
              <Col></Col>
              <Col xs={12} md={7}>
                <Row>
                  <Col xs={12} md={6}>
                    <h5 className="textorange textcenter"> {ABOUT_US_TAB_SECTION_TWO_HEADER[0]}
                    </h5>
                    
                    <h5 className="textorange textcenter">{ABOUT_US_TAB_SECTION_TWO_HEADER[1]}</h5>
                    <ul>
                      <li>{t('ABOUT_US_TAB_SECTION_TWO_LI1')}</li>
                      <li>{t('ABOUT_US_TAB_SECTION_TWO_LI2')}</li>
                      <li>{t('ABOUT_US_TAB_SECTION_TWO_LI3')}</li>
                    </ul>
                    <br/>
                    <p>
                      {t('ABOUT_US_TAB_SECTION_TWO_TEXT')}
                    </p>
                  </Col>
                  
                  <Col xs={12} md={6}>
                    <Row><Col lg="12"> <Image src="/assets/about/img2.png" className="img2about" fluid/></Col></Row>
                    <Row><Col lg="12"> <Image src="/assets/about/img4.png" className="img4about"/></Col></Row>
                  
                  </Col>
                </Row>
                
                <Row>
                  <Col lg="12">
                    <Image src="/assets/about/img3.png" className="img3about" fluid/>
                  </Col>
                </Row>
              </Col>
              <div className="border_arc2"></div>
            </Row>
          </Container>
        </div>
        
        
        <div className="slide team" style={{ height: tabKey === 1 ? 'unset' : '0px' }}>
          <Container>
            <Row className="rowabout"><h5 className="textorange">GARDER LE CAP</h5></Row>
            
            <div></div>
            <div className="team-row">
              
              <div className="team-member">
                <div className="image">
                  <Image src="/assets/about/teamimg1.png" className="teamimg" fluid/>
                </div>
                
                <div className="content">
                  <h5 className="textorange">
                    {t('TEAM_TAB_PERSON_ONE')}
                  </h5>
                  
                  <br/>
                  
                  
                  <h5>{t('TEAM_TAB_PERSON_ONE_HEADER')}</h5>
                  
                  <ul>
                    <li>{TEAM_TAB_PERSON_ONE_LI[0]}</li>
                    <li>{TEAM_TAB_PERSON_ONE_LI[1]}</li>
                    <li>{TEAM_TAB_PERSON_ONE_LI[2]}</li>
                  </ul>
                </div>
                
                <div className="links">
                  <div className="link">
                    <a href="https://rienquedubonheur.com" target="_blank" rel="noopener noreferrer">
                      <Image src="/assets/about/website.png" className="weblogo" fluid/>
                    </a>
                  </div>
                
                </div>
              </div>
              
              <div className="team-member">
                <div className="image">
                  <Image src="/assets/about/teamimg2.jpg" className="teamimg" fluid/>
                </div>
                
                <div className="content">
                  <h5 className="textorange">
                    {t('TEAM_TAB_PERSON_TWO')}
                  </h5>
                  
                  <br/>
                  
                  
                  <h5>{t('TEAM_TAB_PERSON_TWO_HEADER')}</h5>
                  
                  <p>{t('TEAM_TAB_PERSON_TWO_DESCRIPTION')}</p>
                  
                  <ul>
                    <li>{TEAM_TAB_PERSON_TWO_LI[0]}</li>
                    <li>{TEAM_TAB_PERSON_TWO_LI[1]}</li>
                    <li>{TEAM_TAB_PERSON_TWO_LI[2]}</li>
                    <li>{TEAM_TAB_PERSON_TWO_LI[3]}</li>
                  </ul>
                
                </div>
                <div className="contact">
                  <p>{t('TEAM_TAB_PERSON_TWO_MAIL')}</p>
                  <a className="textorange hmargin"
                     href="mailto:cconcetti@milletunevagues.com">cconcetti@milletunevagues.com</a>
                </div>
                
                
                <div className="links">
                  <div className="link">
                    <a href="https://milletunevagues.com/" target="_blank" rel="noopener noreferrer"> <Image
                      src="/assets/about/website.png" className="weblogo"
                      fluid/> </a>
                  </div>
                  <div className="link">
                    <a href="https://www.facebook.com/1001Vagues/" target="_blank" rel="noopener noreferrer">
                      <FaFacebookF/>
                    </a>
                  </div>
                  <div className="link">
                    <a href="https://twitter.com/Milletunevagues" target="_blank" rel="noopener noreferrer">
                      <FaTwitter/>
                    </a>
                  </div>
                  <div className="link"><a href="https://www.instagram.com/milletunevagues/" target="_blank"
                                           rel="noopener noreferrer"> <FaInstagram/> </a>
                  </div>
                </div>
              </div>
              
              <div className="team-member">
                <div className='image'>
                  <Image src="/assets/about/teamimg3.png" className="teamimg" fluid/>
                </div>
                
                <div className="content">
                  <h5 className="textorange">
                    {t('TEAM_TAB_PERSON_THREE')}
                  </h5>
                  
                  <br/>
                  
                  <h5>
                    {t('TEAM_TAB_PERSON_THREE_HEADER')}
                  </h5>
                  
                  <p>
                    {t('TEAM_TAB_PERSON_THREE_DESCRIPTION')}
                  </p>
                  
                  <ul>
                    <li>{TEAM_TAB_PERSON_THREE_LI[0]}</li>
                    <li>{TEAM_TAB_PERSON_THREE_LI[1]}</li>
                    <li>{TEAM_TAB_PERSON_THREE_LI[2]}</li>
                  </ul>
                </div>
                
                <div className="contact">
                  <p>{t('TEAM_TAB_PERSON_THREE_MAIL')}</p>
                  <a className="textorange hmargin" href="mailto:f.tabarly@nigma.global">f.tabarly@nigma.global</a>
                </div>
                
                <div className="links">
                  <div className="link">
                    <a href="https://nigma.global/" target="_blank" rel="noopener noreferrer"> <Image
                      src="/assets/about/website.png" className="weblogo" fluid/>
                    </a>
                  </div>
                
                </div>
              
              </div>
              
              <div xs={12} md={4} lg={4} className="team-member">
                <div className="image">
                  <Image src="/assets/about/teamimg7.jpg" className="teamimg" fluid/>
                </div>
                
                <div className="content ">
                  <h5 className="textorange">{t('TEAM_TAB_PERSON_FOUR')}</h5>
                  <br/>
                  <h5>{t('TEAM_TAB_PERSON_FOUR_HEADER')}</h5>
                  
                  <ul>
                    <li>{TEAM_TAB_PERSON_FOUR_LI[0]}</li>
                    <li>{TEAM_TAB_PERSON_FOUR_LI[1]}</li>
                    <li>{TEAM_TAB_PERSON_FOUR_LI[2]}</li>
                    <li>{TEAM_TAB_PERSON_FOUR_LI[3]}</li>
                    <li>{TEAM_TAB_PERSON_FOUR_LI[4]}</li>
                  </ul>
                </div>
                
                <div className="contact">
                  <p>{t('TEAM_TAB_PERSON_FOUR_MAIL')}</p>
                  <a className="textorange hmargin"
                     href="mailto:contact@luz-informatique.org">contact@luz-informatique.org</a>
                </div>
                
                <div className="links">
                  <div className="link">
                    <a href="https://luz-informatique.org/" target="_blank" rel="noopener noreferrer">
                      <Image src="/assets/about/website.png" className="weblogo" fluid/> </a>
                  </div>
                  <div className="link">
                    <a href="https://www.facebook.com/luzinformatique" target="_blank" rel="noopener noreferrer">
                      <FaFacebookF/> </a>
                  </div>
                </div>
              
              </div>
            
            </div>
            
            <Row className="rowabout2"><h5 className="textorange">{t('ABOUT_US_TAB_HEADER_NORMAL_CASE')}</h5></Row>
            
            <div className="team-row">
              <div className="team-member">
                <div className="image">
                  <Image src="/assets/about/teamimg4.jpg" className="teamimg" fluid/>
                </div>
                
                <div className="content">
                  <h5 className="textorange">{t('TEAM_TAB_PERSON_FIVE')}</h5>
                  
                  <h5>{t('TEAM_TAB_PERSON_FIVE_HEADER')}</h5>
                  
                  <p>{t('TEAM_TAB_PERSON_FIVE_DESCRIPTION')}</p>
                  
                  
                  <ul>
                    <li>{TEAM_TAB_PERSON_FIVE_LI[0]}</li>
                    <li>{TEAM_TAB_PERSON_FIVE_LI[1]}</li>
                    <li>{TEAM_TAB_PERSON_FIVE_LI[2]}</li>
                    <li>{TEAM_TAB_PERSON_FIVE_LI[3]}</li>
                  </ul>
                
                
                </div>
                <div className="contact">
                  <p>{t('TEAM_TAB_PERSON_FIVE_MAIL')}</p>
                  <a className="textorange hmargin"
                     href="mailto:paysbasque-decouverte@orange.fr">paysbasque-decouverte@orange.fr</a>
                </div>
                <div className="links">
                  <div className="link">
                    <a href="https://www.paysbasque-decouverte.fr/" target="_blank" rel="noopener noreferrer">
                      <Image src="/assets/about/website.png" className="weblogo" fluid/>
                    </a>
                  </div>
                  <div className="link">
                    <a
                      href="https://www.facebook.com/Jean-Marc-Travers%C3%A9e-de-lAtlantique-%C3%A0-la-rame-114013453625541/"
                      target="_blank" rel="noopener noreferrer">
                      <FaFacebookF/>
                    </a>
                  </div>
                  <div className="link">
                    <a href="https://www.instagram.com/pays_basque_decouverte/" target="_blank"
                       rel="noopener noreferrer">
                      <FaInstagram/>
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="team-member">
                <div className="image">
                  <Image src="/assets/about/teamimg5.jpg" className="teamimg" fluid/>
                </div>
                
                <div className="content">
                  <h5 className="textorange"> {t('TEAM_TAB_PERSON_SIX')}  </h5>
                  
                  <br/>
                  
                  
                  <h5>{t('TEAM_TAB_PERSON_SIX_HEADER')}</h5>
                  
                  <ul>
                    <li>{TEAM_TAB_PERSON_SIX_LI[0]}</li>
                    <li>{TEAM_TAB_PERSON_SIX_LI[1]}</li>
                    <li>{TEAM_TAB_PERSON_SIX_LI[2]}</li>
                  </ul>
                
                
                </div>
                <div className="contact">
                  <p>{t('TEAM_TAB_PERSON_SIX_MAIL')}</p>
                  <a className="textorange hmargin"
                     href="mailto:contact@cap-women-organisation.fr">contact@cap-women-organisation.fr</a>
                </div>
                <div className="links">
                  <div className="link">
                    <a href="https://cap-women-organisation.fr/" target="_blank" rel="noopener noreferrer">
                      <Image src="/assets/about/website.png" className="weblogo" fluid/>
                    </a>
                  </div>
                  <div className="link">
                    <a href="https://www.facebook.com/raidCapWomen64/" target="_blank" rel="noopener noreferrer">
                      <FaFacebookF/>
                    </a>
                  </div>
                  <div className="link">
                    <a href="https://www.instagram.com/raidcapwomen64/" target="_blank" rel="noopener noreferrer">
                      <FaInstagram/>
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="team-member">
                <div className="image">
                  <Image src="/assets/about/teamimg6.jpg" className="teamimg" fluid/>
                </div>
                
                <div className="content">
                  <h5 className="textorange">
                    {t('TEAM_TAB_PERSON_SEVEN')}
                  </h5>
                  
                  <br/>
                  
                  
                  <h5>{t('TEAM_TAB_PERSON_SEVEN_HEADER')}</h5>
                  
                  <p>{t('TEAM_TAB_PERSON_SEVEN_DESCRIPTION')}</p>
                  
                  <ul>
                    <li>{TEAM_TAB_PERSON_SEVEN_LI[0]}</li>
                    <li>{TEAM_TAB_PERSON_SEVEN_LI[1]}</li>
                    <li>{TEAM_TAB_PERSON_SEVEN_LI[2]}</li>
                    <li>{TEAM_TAB_PERSON_SEVEN_LI[3]}</li>
                  </ul>
                </div>
                <div className="contact">
                  <p>{t('TEAM_TAB_PERSON_SEVEN_MAIL')}</p>
                  <a className="textorange hmargin"
                     href="mailto:david.adam.37@gmail.com">david.adam.37@gmail.com</a>
                </div>
              </div>
            </div>
          </Container>
        </div>
        
        <div className="slide techsupp" style={{ height: tabKey === 2 ? 'unset' : '0px' }}>
          <Container>
            <div className="team-row">
              <div className="team-member">
                <div className="image">
                  <Image src="/assets/about/techsupp1.png" className="teamimg" fluid/>
                </div>
                
                <div className="content">
                  <h5 className="textorange">
                    {t('TECH_SUPPORT_TAB_PERSON_ONE')}
                  </h5>
                  
                  <br/>
                  
                  
                  <p>{t('TECH_SUPPORT_TAB_PERSON_ONE_DESCRIPTION')}</p>
                
                
                </div>
                
                <div className="contact">
                  <p>{t('TECH_SUPPORT_TAB_PERSON_ONE_MAIL')}</p>
                  <a className="textorange hmargin" href="mailto:info@codi.tech">info@codi.tech</a>
                </div>
                
                <div className="links">
                  <div className="link">
                    <a href="https://codi.tech/" target="_blank" rel="noopener noreferrer">
                      <Image src="/assets/about/website.png" className="weblogo" fluid/>
                    </a>
                  </div>
                  <div className="link">
                    <a href="https://www.facebook.com/coditechlb/" target="_blank" rel="noopener noreferrer">
                      <FaFacebookF/>
                    </a>
                  </div>
                  <div className="link">
                    <a href="https://twitter.com/codi_tech" target="_blank" rel="noopener noreferrer">
                      <FaTwitter/>
                    </a>
                  </div>
                  <div className="link">
                    <a href="https://www.instagram.com/codi_tech/" target="_blank" rel="noopener noreferrer">
                      <FaInstagram/>
                    </a>
                  </div>
                  <div className="link">
                    <a href="https://www.linkedin.com/school/codi.tech/" target="_blank" rel="noopener noreferrer">
                      <FaLinkedinIn/>
                    </a>
                  </div>
                </div>
              
              
              </div>
              
              <div className="team-member">
                <div className="image">
                  <Image src="/assets/about/techsupp2.jpeg" className="teamimg" fluid/>
                </div>
                
                <div className="content">
                  <h5 className="textorange">
                    {t('TECH_SUPPORT_TAB_PERSON_TWO')}
                  </h5>
                  
                  <br/>
                  
                  <ul>
                    <li>{TECH_SUPPORT_TAB_PERSON_TWO_LI[0]}</li>
                    <li>{TECH_SUPPORT_TAB_PERSON_TWO_LI[1]}</li>
                  </ul>
                </div>
                
                <div className="links">
                  <div className="link">
                    <a href="https://consultant-juridique-blockchain.com/" target="_blank" rel="noopener noreferrer">
                      <Image
                        src="/assets/about/website.png" className="weblogo" fluid/> </a>
                  </div>
                </div>
              </div>
            
            </div>
          </Container>
        </div>
        
        <div className="slide sponsers" style={{ height: tabKey === 3 ? 'unset' : '0px' }}>
          <Container>
            {
              state.sponsors.map((sponsor, index) => {
                return (
                  <Row className="" key={index}>
                    <Col className="paddingcol">
                      <Row>
                        <Image src={sponsor.image} alt={sponsor.image_alternative} title={sponsor.image_title}
                               className="teamimg" fluid/>
                      </Row>
                      
                      
                      <Row>
                        <h5 className="textorange textcenter">
                          {sponsor.title}
                        </h5>
                      </Row>
                      
                      <Row>
                        <Col>
                          <div className="content" dangerouslySetInnerHTML={{
                            __html: sponsor.content,
                          }}/>
                        </Col>
                      </Row>
                      
                      
                      <Row>
                        <Col className="social-icons">
                          <a href={sponsor.link} target="_blank" rel="noopener noreferrer">
                            <Image
                              src="/assets/about/website.png"
                              className="weblogosponser"
                              fluid/>
                          </a>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                )
              })
            }
          
          </Container>
        </div>
        
        <div className="slide devs" style={{ height: tabKey === 4 ? 'unset' : '0px' }}>
          <Container>
            <div className="team-row">
              <div className="team-member">
                <div className="image">
                  <Image src="/assets/about/devimg1.jpg" className="teamimg" fluid/>
                </div>
                
                <div className="content">
                  <h5 className="textorange">
                    {t('DEV_TAB_PERSON_ONE')}
                  </h5>
                  
                  <h5>{t('DEV_TAB_PERSON_ONE_HEADER')} </h5>
                  
                  <h6 className="textorange">
                    {t('DEV_TAB_PERSON_ONE_DESCRIPTION')}
                  </h6>
                
                </div>
                
                <div className="content">
                  <ul>
                    <li>{DEV_TAB_PERSON_ONE_LI[0]}</li>
                    <li>{DEV_TAB_PERSON_ONE_LI[1]}</li>
                    <li>{DEV_TAB_PERSON_ONE_LI[2]}</li>
                  </ul>
                </div>
                
                
                <div className="contact">
                  <p>{t('DEV_TAB_PERSON_ONE_MAIL')}</p>
                  <a className="textorange hmargin"
                     href="mailto:shirak.kevorkian@gmail.com">shirak.kevorkian@gmail.com</a>
                </div>
                
                
                <div className="links">
                  <div className="link">
                    <a href="https://www.linkedin.com/in/shirak-kevorkian/" target="_blank" rel="noopener noreferrer">
                      <FaLinkedinIn/>
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="team-member">
                <div className="image">
                  <Image src="/assets/about/devimg2.jpg" className="teamimg" fluid/>
                </div>
                
                <div className="content">
                  <h5 className="textorange">
                    {t('DEV_TAB_PERSON_TWO')}
                  </h5>
                  
                  <br/>
                  
                  
                  <h5>{t('DEV_TAB_PERSON_TWO_HEADER')}</h5>
                  
                  <h6 className="textorange">
                    {t('DEV_TAB_PERSON_TWO_DESCRIPTION')}
                  </h6>
                </div>
                
                <div className="content">
                  <ul>
                    <li>{DEV_TAB_PERSON_TWO_LI[0]}</li>
                    <li>{DEV_TAB_PERSON_TWO_LI[1]}</li>
                    <li>{DEV_TAB_PERSON_TWO_LI[2]}</li>
                  </ul>
                </div>
  
  
                <div className="contact">
                  <p>{t('DEV_TAB_PERSON_TWO_MAIL')}</p>
                  <a className="textorange hmargin" href="mailto:info@gabykaram.com">info@gabykaram.com</a>
                </div>
                <div className="links">
                  <div className="link">
                    <a href="https://www.linkedin.com/in/gabykaram/" target="_blank"
                       rel="noopener noreferrer">
                      <FaLinkedinIn/>
                    </a>
                  </div>
  
                </div>
              </div>
              
              <div className="team-member">
                <div className="image">
                  <Image src="/assets/about/devimg3.jpg" className="teamimg" fluid/>
                </div>
                
                <div className="content">
                  <h5 className="textorange">
                    {t('DEV_TAB_PERSON_THREE')}
                  </h5>
                  
                  <br/>
                  
                  
                  <h5>{t('DEV_TAB_PERSON_THREE_HEADER')}</h5>
                  
                  <h6 className="textorange">
                    {t('DEV_TAB_PERSON_THREE_DESCRIPTION')}
                  </h6>
                </div>
                
                <div className="content">
                  <ul>
                    <li>{DEV_TAB_PERSON_THREE_LI[0]}</li>
                    <li>{DEV_TAB_PERSON_THREE_LI[1]}</li>
                  </ul>
                </div>
                
                
                <div className="contact">
                  <p>{t('DEV_TAB_PERSON_THREE_MAIL')}</p>
                  <a className="textorange hmargin" href="mailto:liamshere98@gmail.com">liamshere98@gmail.com</a>
                </div>
                
                
                <div className="links">
                  <div className="link">
                    <a href="https://www.linkedin.com/in/william-abousharaf-030379107/" target="_blank"
                       rel="noopener noreferrer">
                      <FaLinkedinIn/>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>
      
      </SwipeableViews>
    </div>
  )
}

export default About;
