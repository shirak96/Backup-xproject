import React, { Component } from 'react'
import { Container } from 'react-bootstrap'
//Custom Components
import About from '../../Components/About/About.js'
//scss
import './AboutPage.scss'

class AboutPage extends Component {
  
  render () {
    return (
      
      <div className="about-container">
        <Container>
          <div className="DonationPage">
            <About/>
          </div>
        </Container>
      </div>
    )
  }
}

export default AboutPage



