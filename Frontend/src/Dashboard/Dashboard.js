import React, { useEffect, useState } from 'react'
import Notification from './Components/Notification'
import PrivateRoute from './Containers/PrivateRoute'
import PublicRoute from './Containers/PublicRoute'
import './Dasboard.scss'

import AdminPage from './Pages/AdminPage'
import DashboardPage from './Pages/DashboardPage'
import DonationInfo from './Pages/DonationInfo'
import HerosPage from './Pages/HerosPage'
import LoginPage from './Pages/LoginPage/LoginPage'
import MapCalendarPage from './Pages/MapCalendarPage'
import NewsPage from './Pages/NewsPage'
import NewspaperPage from './Pages/NewspaperPage'
import SettingsPage from './Pages/SettingsPage'
import SponsorsPage from './Pages/SponsorsPage'
import { TOKEN_KEY } from './Utils'
import API from './Utils/api'
import { useBodyClass, useStyles } from './Utils/hooks'

const Dashboard = () => {
  useBodyClass('dashboard')
  const selectedLanguage = localStorage.getItem('dashboard_lang')
  const defaultLanguage = 'fr'
  const currentLanguage = selectedLanguage !== null ? selectedLanguage : defaultLanguage
  const [semantic_loaded, semantic_error] = useStyles('https://cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css')
  const [state, setState] = useState({
    loading: true,
    loggedIn: false,
    sideMenu: {
      open: true,
    },
    lang: currentLanguage,
  })
  
  useEffect(() => {
    const checkAuth = async () => {
      if (state) {
        try {
          await API().post('auth')
          setState({
            ...state,
            loading: false,
            loggedIn: true,
          })
        } catch (e) {
          setState({
            ...state,
            loading: false,
            loggedIn: false,
          })
        }
      }
    }
    document.body.classList.add('dashboard')
    if (!state.loggedIn) {
      checkAuth()
    }
  }, [])
  
  const logUserIn = () => {
    setState({
      ...state,
      loggedIn: true,
    })
  }
  
  const logUserOut = () => {
    localStorage.removeItem(TOKEN_KEY)
    setState({
      ...state,
      loggedIn: false,
    })
  }
  
  const toggleSideMenu = () => {
    setState({
      ...state,
      sideMenu: {
        ...state.sideMenu,
        open: !state.sideMenu.open,
      },
    })
  }
  
  const changeLanguage = (lang) => {
    const available_languages = ['ar', 'en', 'fr', 'es']
    if (available_languages.includes(lang)) {
      localStorage.setItem('dashboard_lang', lang)
      setState({
        ...state,
        lang: lang,
      })
      window.location.reload()
    } else {
      alert('An Error happened, please try again.')
    }
    
  }
  
  const { loggedIn, loading, sideMenu } = state
  
  const commonProps = {
    loggedIn,
    logUserIn,
    logUserOut,
    sideMenu: {
      ...sideMenu,
      toggleSideMenu,
    },
    language: {
      value: state.lang,
      handleChange: changeLanguage,
    },
  }
  return (
    <>
      {
        semantic_error ? <Notification title='Please check your internet connection'/> : null
      }
      <div className="dashboard-App">
        
        {
          !semantic_loaded && loading ? 'Loading ...' : (
            <div>
              <PrivateRoute {...commonProps} component={DashboardPage} path="/dashboard" exact/>
              <PrivateRoute {...commonProps} component={AdminPage} path="/dashboard/admin"
                            exact/>
              <PrivateRoute {...commonProps} component={NewspaperPage} path="/dashboard/newsletter"
                            exact/>
              <PrivateRoute {...commonProps} component={HerosPage} path="/dashboard/hero"
                            exact/>
              <PrivateRoute {...commonProps} component={NewsPage} path="/dashboard/news"
                            exact/>
              <PrivateRoute {...commonProps} component={SponsorsPage} path="/dashboard/sponsors"
                            exact/>
              <PrivateRoute {...commonProps} component={DonationInfo} path="/dashboard/donation"
                            exact/>
              <PrivateRoute {...commonProps} component={SettingsPage} path="/dashboard/settings"
                            exact/>
              <PrivateRoute {...commonProps} component={MapCalendarPage} path="/dashboard/map-calendar"
                            exact/>
              <PublicRoute  {...commonProps} restricted={true} component={LoginPage}
                            path="/dashboard/sign-in"
                            exact/>
            
            </div>
          )
        }
      </div>
    </>
  )
  
}
export default Dashboard
