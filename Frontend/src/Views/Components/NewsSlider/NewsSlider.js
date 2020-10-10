import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Ticker from 'react-ticker'

import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { Controller as NewsController } from '../../../Controllers/news-Controller'
import { getLanguage } from '../../../utils/lang'

import './NewsSlider.scss'

const NewsSlider = (props) => {
    
    const [state, setState] = useState({
        news: [],
        activeItem: 0,
        move: 0,
        triggerOnResize: false,
    })
    const { t, i18n } = useTranslation()
    
    useEffect(() => {
        getLatestNews()
    }, [i18n.language])
    
    const getLatestNews = async () => {
        setState({ ...state, isLoading: true })
        try {
            const result = await NewsController.getNewsList(getLanguage())
            if (result.status.code === 200) {
                const newsList = result.data.filter(news_item => news_item.type === props.type)
                setState({ ...state, news: [], activeItem: 0 })
                setState({
                    ...state,
                    news: newsList,
                    activeItem: newsList.length > 0 ? 0 : -1,
                    triggerOnResize: true,
                    
                })
                
            } else {
                // setState({...state, error_message: result.message, isLoading: false});
            }
        } catch (err) {
            // setState({...state, error_message: err.message, isLoading: false});
        }
        
    }
    
    /*
     * onNext
     *
     * This function will be passed to "react-ticker" component to
     * allow the component to track the state of the slider
     *
     * In more basics words this function will run whenever a new item get ready to be
     * shown in the view.
     *
     * This function will run even for the 1st item that show on the view
     *
     * index value will vary from 0 to infinite
     *
     * The use of this.state.move is to track if the function had run on the first item or not
     * */
    const onNext = (index) => {
        let activeIndex = (index) % state.news.length
        
        if (state.move) {
            setState({
                ...state,
                activeIndex: activeIndex + 1,
            })
        } else {
            setState({
                ...state,
                move: true,
            })
        }
    }
    
    const { activeIndex, news, move } = state
    
    /*
     * This block is to get the active new available on the view
     *
     * First set the active news to undefined for the case where news is an empty array
     * */
    let activeNew = undefined
    if (news.length > 0) {
        activeNew = news[0]
        const body = document.querySelector('body.rtl')
        const isRTL = body !== null
        if (activeIndex !== undefined && move) {
            activeNew = news[state.activeIndex % news.length]
        }
        
        return (
          <div className="news-slider">
              <div className="item">
                  
                  <div className="item__info">
                      {
                          activeNew !== undefined ? (
                            <>
                                <div>
                                    <TransitionGroup>
                                        <CSSTransition
                                          key={activeNew.id}
                                          timeout={1000}
                                          classNames="news-out"
                                        >
                                            <div>
                                                <h5 className="item__info__author">{activeNew.name}</h5>
                                                <span className="item__info__date">{activeNew.date}</span>
                                            </div>
                                        </CSSTransition>
                                    </TransitionGroup>
                                </div>
                            </>
                          ) : null
                      }
                  </div>
                  
                  <Ticker
                    offset="80%"
                    move={true}
                    speed={8}
                    onNext={onNext}
                    triggerOnResize={news.length > 0}
                    direction={isRTL ? 'toRight' : 'toLeft'}
                  >
                      {(item) => {
                          // Don't ask why is that available it only worked using this way
                          
                          const { id, content } = news[(item.index) % state.news.length]
                          return (
                            <>
                                <div className="item__content" key={id}>
                                    <p>{content}</p>
                                </div>
                            </>
                          )
                      }}
                  </Ticker>
              </div>
          
          </div>
        )
    } else {
        return (<div className="news-slider">
            <span className="loading">{t('LOADING')}</span>
        </div>)
    }
}

export default NewsSlider;
