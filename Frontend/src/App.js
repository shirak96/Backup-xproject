import React, { Suspense, useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player'
import 'react-h5-audio-player/lib/styles.css'
import { Route, withRouter } from 'react-router-dom'
//scss
import './App.scss'
//Controller
import { Controller as YoutubeVideoController } from './Controllers/youtube-video-Controller'
import './rtl.scss'
import { getLanguage } from './utils/lang'
import Footer from './Views/Components/Footer/Footer.js'
import Header from './Views/Components/Header/Header'
//scss
import './Views/Components/Music/Music.scss'
import AboutPage from './Views/Pages/AboutPage/AboutPage.js'
import DonationPage from './Views/Pages/DonationPage/DonationPage.js'
//Custom Components
import Home from './Views/Pages/HomePage/Home.js'
import InstagramPage from './Views/Pages/InstagramPage/InstagramPage.js'
import NewsPaperPage from './Views/Pages/NewsPaperPage/NewsPaperPage.js'
import PrivacyPolicyPage from './Views/Pages/PrivacyPolicyPage/PrivacyPolicyPage'
import TheOtherHerosPage from './Views/Pages/TheOtherHerosPage/TheOtherHerosPage.js'

// loading component for suspense fallback
const Loader = () => (
  <div className="App">
    <img src={'/Logoimg.png'} className="App-logo" alt="logo"/>
    <div>loading...</div>
  </div>
)

const App = (props) => {
  const { pathname } = props.location
  
  const [state, setState] = useState({
    newsPaper_list: [],
    error_message: '',
    isLoading: false,
    initialPage: props.location.pathname,
    homePagePlayMusic: false,
    showSplash: pathname === '/',
    splashCallback: null,
  })
  
  useEffect(() => {
    initializeLanguage();
    window['getLang'] = getLanguage;
    getLatestYoutubeVideos();
    ['click', 'mousemove', 'mouseover', 'mousemove', 'touchmove', 'focus'].forEach((eventName) => {
      window.addEventListener(eventName, forcePlayMusic, false)
    })
    
    return () => {
      ['click', 'mousemove', 'mouseover', 'mousemove', 'touchmove', 'focus'].forEach((eventName) => {
        window.removeEventListener(eventName, forcePlayMusic)
      })
    }
  }, [])
  
  useEffect(() => {
    
    if (state.showSplash === false && state.splashCallback !== null) {
      setTimeout(() => {
        setState({
          ...state,
          homePagePlayMusic: true,
          splashCallback: null,
        })
      }, 3000)
      state.splashCallback()
    }
  }, [state.showSplash])
  
  const initializeLanguage = () => {
    const lng = getLanguage()
    const body = document.querySelector('body')
    if (lng === 'ar') {
      body.classList.remove('ltr')
      body.classList.add('rtl');
      body.setAttribute('dir', 'rtl')
    } else {
      body.classList.add('ltr')
      body.classList.remove('rtl');
      body.setAttribute('dir', 'ltr')
    }
  }
  const getLatestYoutubeVideos = async () => {
    setState({ ...state, isLoading: true })
    try {
      const result = await YoutubeVideoController.getYoutubeVideoList()
      if (result.status.code === 200) {
        const youtubeVideos = result.data
        setState({ ...state, youtubeVideos, isLoading: false })
      } else {
        setState({ ...state, error_message: result.message, isLoading: false })
      }
    } catch (err) {
      setState({ ...state, error_message: err.message, isLoading: false })
    }
  }
  
  const forcePlayMusic = () => {
    
    let counter = 0
    const playButton = document.querySelector('.rhap_main-controls button:nth-child(2)')
    if (playButton !== null) {
      const playInterval = setInterval(() => {
        if (counter > 10) {
          clearInterval(playInterval)
        }
        if (playButton.attributes['aria-label'].value === 'Play') {
          playButton.click()
        }
        counter++
      }, 300)
    }
  }
  const handleSplashDone = (callback = () => {
  }) => {
    setState(
      {
        ...state,
        showSplash: false,
        splashCallback: callback,
      },
    )
  }
  const { youtubeVideos } = state
  
  return (
    <Suspense fallback={<Loader/>}>
      <div className="App">
        <AudioPlayer
          src={'/Music.mp3'}
          customProgressBarSection={[]}
          customControlsSection={[RHAP_UI.VOLUME_CONTROLS, RHAP_UI.MAIN_CONTROLS]}
          preload="metadata"
          autoPlay={true}
          volume="0.5"
          loop
        />
        <Header/>
        <Route
          path={'/'}
          exact
          render={(props) => (
            <Home
              {...props}
              handleSplashDone={handleSplashDone}
              showSplash={state.showSplash}
            />
          )}
        />
        <Route
          path={'/donation'}
          render={(props) => (
            <DonationPage
              {...props}
            />
          )}
        />
        <Route
          path={'/instagram'}
          render={(props) => (
            <InstagramPage
              {...props}
            />
          )}
        />
        <Route
          path={'/theotherheros'}
          render={(props) => (
            <TheOtherHerosPage
              {...props}
            />
          )}
        />
        <Route
          path={'/aboutus'}
          render={(props) => (
            <AboutPage
              {...props}
            />
          )}
        />
        <Route
          path={'/news'}
          render={(props) => (
            <NewsPaperPage
              {...props}
            />
          )}
        />
        <Route
          path={'/privacy-policy'}
          render={(props) => (
            <PrivacyPolicyPage
              {...props}
            />
          )}
        />
        
        <Container>
          <Footer
            youtubeVideos={youtubeVideos}
          /> </Container>
      
      </div>
    </Suspense>
  )
}

export default withRouter(App)
