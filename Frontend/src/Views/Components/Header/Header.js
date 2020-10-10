import React from 'react'
import { Dropdown, DropdownButton, Image, Nav, Navbar } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { Link, withRouter } from 'react-router-dom'
import { getLanguage } from '../../../utils/lang'
import FlagIcon from '../FlagIcon/FlagIcon'
//scss
import style from './Header.module.scss'
import './Header.scss'

const languages = [
    {
        code: 'fr',
        label: 'FRENCH',
        flag: 'fr',
        dir: 'ltr',
    },
    {
        code: 'en',
        label: 'ENGLISH',
        flag: 'gb',
        dir: 'ltr',
        
    },
    {
        code: 'es',
        label: 'ESPAÑOL',
        flag: 'es',
        dir: 'ltr',

    },
    {
        code: 'ar',
        label: 'عربي',
        flag: 'lb',
        dir: 'rtl',

    },
]
const Header = (props) => {
    const { pathname } = props.location
    const logoImage = '/Logoimg.png'
    const { t, i18n } = useTranslation()
    const currentLanguage = languages.find(language => language.code === getLanguage())
    return (
      <header className='header container'>
          <Navbar
            collapseOnSelect
            expand="lg"
            bg="light"
            variant="light"
            className={[style.navbar]}
          >
              <div>
                  <div>
                      <Navbar.Brand as={Link} to={'/'}>
                          <Image
                            className={[style.logo]}
                            src={process.env.PUBLIC_URL + logoImage}
                            fluid
                          />
                      </Navbar.Brand>
                  </div>
                  <div className={'menu'}>
                      <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                      <Navbar.Collapse id="responsive-navbar-nav">
                          <Nav className={[style.menuspace, 'mr-auto']}>
                              <Nav.Link eventKey="1" as={Link} className={pathname === '/' ? 'make-me-active' : ''}
                                        to="/">{t('HEADER_HOME')}</Nav.Link>
                              <Nav.Link eventKey="2" as={Link}
                                        className={pathname === '/donation' ? 'make-me-active' : ''}
                                        to="/donation">{t('HEADER_DONATE')}</Nav.Link>
                              <Nav.Link eventKey="3" as={Link}
                                        className={pathname === '/instagram' ? 'make-me-active' : ''}
                                        to="/instagram">{t('HEADER_INSTAGRAM')}</Nav.Link>
                              <Nav.Link eventKey="4" as={Link}
                                        className={pathname === '/theotherheros' ? 'make-me-active' : ''}
                                        to="/theotherheros">{t('HEADER_HEROS')}</Nav.Link>
                              <Nav.Link eventKey="5" as={Link}
                                        className={pathname === '/aboutus' ? 'make-me-active' : ''}
                                        to="/aboutus">{t('HEADER_ABOUT_US')}</Nav.Link>
                              <Nav.Link eventKey="6" as={Link} className={pathname === '/news' ? 'make-me-active' : ''}
                                        to="/news">{t('HEADER_NEWS')}</Nav.Link>
                          </Nav>
                      </Navbar.Collapse>
                  </div>
              </div>
          </Navbar>
          
          <div className={'LangDropDown'}>
              <DropdownButton
                id="dropdown-item-button"
                className={[style.dropdown, 'mydropdown']}
                // title={t('SELECT_A_LANGUAGE')}
                title={currentLanguage !== undefined ? (
                  <>
                      <FlagIcon code={currentLanguage.flag}/> {currentLanguage.label}
                  </>
                ) : t('SELECT_A_LANGUAGE')}
              >
                  {
                      languages.map((language, index) => {
                          return (
                            <Dropdown.Item key={index} as="button" onClick={event => {
                                event.preventDefault()
                                i18n.changeLanguage(language.code)
                                const bodyElement = document.querySelector('html > body')
                                const htmlElement = document.querySelector('html')
                                bodyElement.classList.remove('ltr')
                                bodyElement.classList.remove('rtl')
                                bodyElement.classList.add(language.dir)
                                bodyElement.setAttribute('dir', language.dir)
                                htmlElement.setAttribute('lang', language.code)
                            }}>
                                <FlagIcon code={language.flag}/> {language.label}
                            </Dropdown.Item>
                          )
                      })
                  }
              </DropdownButton>
          </div>
      </header>
    )
}

export default withRouter(Header);
