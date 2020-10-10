import React, { Component } from 'react'
import { Container } from 'react-bootstrap'
//Custom Components
import HeroCard from '../../Components/HeroCard/HeroCard.js'
//scss
import './TheOtherHerosPage.scss'

class TheOtherHerosPage extends Component {
    
    render () {
        
        return (
          <div className="TheOtherHerosPage">
              <Container>
                  <HeroCard/>
              </Container>
          </div>
        )
    }
}

export default TheOtherHerosPage
