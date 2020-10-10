import React, { Component } from 'react'
import { Container } from 'react-bootstrap'
//Custom Components
import NewsPaper from '../../Components/NewsPaper/NewsPaper.js'
//scss
import './NewsPaperPage.scss'

class NewsPaperPage extends Component {
  render () {
    
    return (
      <div className="NewsPaperPage">
        <Container>
          <NewsPaper/>
        </Container>
      </div>
    )
  }
}

export default NewsPaperPage
