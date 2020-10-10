import React from 'react'
import { Col, Nav, Row, Tab } from 'react-bootstrap'
import ReactDOM from 'react-dom'
import { withTranslation } from 'react-i18next'
import SwipeableViews from 'react-swipeable-views'
import { Controller } from '../../../Controllers/youtube-video-Controller'

import { EventEmitter, Signals } from '../../../utils/EventEmitter'
//css
import './MapSection.scss'
//custom components
import GoogleMap from './subComponents/Map/Map.js'
import MapCalendar from './subComponents/MapCalendar/MapCalendar.js'
import YoutubeLive from './subComponents/YoutubeLive.js'

/**
 * @class MapSection - section that shows{Map /Meeting Points/ Calendar/ Live} with tabs
 * @props null
 * @extends {React.Component}
 */
class MapSection extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      tabKey: 0,
      isLive: false,
      liveVideoId: '',
    };
    
    this.liveButton = React.createRef();
  }
  
  async componentDidMount() {
    //adding className to SwipeableViews hidden parent(not MapSection)
    ReactDOM.findDOMNode(this).children[1].className = 'SwipeableViewsContainer'
    await this.getYoutubeLiveInfo()
    EventEmitter.once(Signals.errorInReactPlayer, () => this.HandleReactPlayerError());
  }
  
  //This is for if player can't play the current youtube video id
  // and switch to another youtube video ID
  async HandleReactPlayerError() {
      try {
        const {data} = await Controller.reFetchLiveVideo();
        if(data.length > 0){
          let liveVideoId = data[0].videoId;
          this.setState({liveVideoId});
          if (data[0].eventType === 'live') {
            this.setState({isLive: true});
            this.SwitchToLiveTabOnLive();
          } else {
            this.setState({isLive: false});
          }
        }
      
      } catch (err) {
        console.log('err.message', err.message)
        throw new Error("re-fetching live videos failed");
      }
    }
  
  //This is added to handle fetching youtube live whenever needed
  async getYoutubeLiveInfo() {
    try {
      const { data } = await Controller.getYoutubeLiveInfo();
      
      if (data.length === 0) {
        this.HandleReactPlayerError();
      }
      else  {
        console.log(data)
        let liveVideoId = data[0].videoId;
        this.setState({liveVideoId});
        if (data[0].eventType === 'live') {
          this.setState({isLive: true});
          //handles switching to live tab with slow transition.
          EventEmitter.on(Signals.splashIsDone, () => {
            this.SwitchToLiveTabOnLive();
          });
        } else {
          this.setState({isLive: false})
        }
      }
    } catch (err) {
      this.HandleReactPlayerError();
    }
  }
  
  SwitchToLiveTabOnLive() {
    setTimeout(() => {
      this.setState({tabKey: 1})
    }, 3000);
    setTimeout(() => {
      this.setState({tabKey: 2})
    }, 4500);
  }
  
  // Used to communicate between Tabs.container and SwipeableViews
  // to show current tab depeding on tab key
  handleTabClick(key) {
    key = parseInt(key);
    this.setState({tabKey: key});
  }
  
  handlePlayLive() {
    console.log('clicked live button')
  }
  
  render() {
    const {tabKey, isLive, liveVideoId} = this.state;
    const {t} = this.props;
    return (
        <div className="MapSection">
          {/* tabs section */}
          {/* Tab.Container was used for switching between SwipeableViews(different library from bootstrap)*/}
          <div className="tabs">
            <Tab.Container
                id="controlled-tab-example"
                defaultActiveKey="0"
                activeKey={tabKey}
                onSelect={(key) => this.handleTabClick(key)}
            >
             <Row>
               <Col>
                 <Row sm={3}>
                   <Nav>
                     <Nav.Item>
                       <Nav.Link eventKey="0">{t('NEWS_TAB_MAP')}</Nav.Link>
                     </Nav.Item>
                     <Nav.Item>
                       <Nav.Link eventKey="1">{t('NEWS_TAB_CALENDER')}</Nav.Link>
                     </Nav.Item>
                     <Nav.Item>
                       <Nav.Link eventKey="2" onClick={() => this.handlePlayLive()}>
                         <div className="liveButtonContainer">
                           <div>{t('NEWS_TAB_LIVE')}</div>
                           <LiveBulb isLive={isLive}/>
                         </div>
                       </Nav.Link>
                     </Nav.Item>
                   </Nav>
                 </Row>
               </Col>
             </Row>
            </Tab.Container>
          </div>
          {/* Swipable section */}
          {/* SwipeableViews is added so user can use touch screen and mouse to switch between views */}
          <SwipeableViews index={tabKey}>
            <div className="slide firstSlide">
              <GoogleMap/>
            </div>
            <div className="slide secondSlide">
              <MapCalendar/>
            </div>
            <div className="slide thirdSlide">
              <YoutubeLive liveId={liveVideoId}/>
            </div>
          </SwipeableViews>
        </div>
    );
  }
}

export default withTranslation()(MapSection)

/**
 * function that handles rendering light bulb component
 * @prop {bool} isLive
 */
function LiveBulb({isLive = false}) {
  // console.log(isLive)
  const renderLiveBulb = () => {
    return (
        <div className="ring-container">
          <div className="ringring"/>
          <div className="circle"/>
        </div>
    );
  }
  
  return isLive ? renderLiveBulb() : '';
}
