import React, { useEffect, useState } from 'react'
import { Card, Col, Container, Row } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

import { Controller as HeroController } from '../../../Controllers/hero-controller'
import { getLanguage } from '../../../utils/lang'
//assets
//scss
import './HeroCard.scss'

//Custom Components
const HeroCard = () => {
  const [state, setState] = useState({
    heros: [],
  })
  const { t, i18n } = useTranslation()
  
  useEffect(() => {
    getHeroList()
  }, [getLanguage()])
  const getHeroList = async () => {
    setState({ ...state, isLoading: true })
    try {
      const result = await HeroController.getHeroList(getLanguage())
      if (result.status.code === 200) {
        const heros = result.data
        setState({ ...state, heros, isLoading: false })
      } else {
        setState({ ...state, error_message: result.message, isLoading: false })
      }
    } catch (err) {
      setState({ ...state, error_message: err.message, isLoading: false })
    }
  }
  
  return (
    <div className="Hero">
      <Container>
        <Row>
          {
            state.heros.map((hero, index) => {
              return (
                <Col sm={12} md={6} key={index}>
                  <Card>
                    <div className="zoom">
                      <a href={hero.link} target="_blank"
                         rel="noopener noreferrer">
                        <Card.Img variant="top" src={hero.image}/>
                      </a>
                    </div>
                    <Card.Body>
                      <div dangerouslySetInnerHTML={{ __html: hero.content }}/>
                    </Card.Body>
                  </Card>
                </Col>
              )
            })
          }
        </Row>
      </Container>
    </div>
  )
}

export default HeroCard;
