import React, { Component } from 'react'
import Carousel, { Modal, ModalGateway } from 'react-images'
import { Controller as NewsPaperController } from '../../../Controllers/news-paper-Controller'

import './NewsPaper.scss'

class NewsPaper extends Component {
  state = {
    newsPaper_list: [],
    modalIsOpen: false,
    isLoading: false,
  }
  
  async componentDidMount () {
    await this.getNewsPaperList()
  }
  
  getNewsPaperList = async () => {
    this.setState({ isLoading: true })
    try {
      const result = await NewsPaperController.getNewsPaperList()
      if (result.status.code === 200) {
        const newsPaper_list = result.data
        this.setState({ newsPaper_list, isLoading: false })
      } else {
        this.setState({ error_message: result.message, isLoading: false })
      }
    } catch (err) {
      this.setState({ error_message: err.message, isLoading: false })
    }
  }
  
  toggleLightBox = (selectedIndex) => {
    this.setState(state => ({
      modalIsOpen: !state.modalIsOpen,
      selectedIndex,
    }))
  }
  
  render () {
    const { modalIsOpen, isLoading, selectedIndex, newsPaper_list } = this.state
    
    return (
      <>
        {!isLoading ? (
          <div className="NewsPaper">
            <div className="NewsPaperimg">
              {
                newsPaper_list.map((newspaper, index) => {
                  return (
                    <div onClick={() => this.toggleLightBox(index)} key={index}>
                      <img src={newspaper.image} alt={newspaper.alternative} title={newspaper.title}/>
                    </div>
                  )
                })}
            </div>
          </div>
        ) : null}
        
        <ModalGateway>
          {modalIsOpen && !isLoading ? (
            <Modal className="editbutton" onClose={this.toggleLightBox}>
              <Carousel
                className="editbutton"
                currentIndex={selectedIndex}
                frameProps={{ autoSize: 'height' }}
                views={newsPaper_list.map(newspaper => {
                  return { src: newspaper.image }
                })}
              />
            </Modal>
          ) : null}
        </ModalGateway>
      </>
    )
  }
}

export default NewsPaper




