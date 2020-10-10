import React, { Component } from 'react'
import { FacebookProvider, Page } from 'react-facebook'
import { withTranslation } from 'react-i18next'
import ReactPlayer from 'react-player'
import sizeMe from 'react-sizeme'

import { TwitterTimelineEmbed } from 'react-twitter-embed'
//scss
import './Footer.scss'

class Footer extends Component {
  constructor (props) {
    super(props)
    
    this.state = {
      loop: true,
      facebookSize: null,
    }
  }
  
  ref = player => {
    this.player = player
  }
  
  handleEnded = () => {
    console.log('onEnded')
    
    this.player.showPreview()
  }
  
  onSize = size => {
    this.setState({
      facebookSize: size,
    })
  }
  
  render () {
    
    const { youtubeVideos = [] } = this.props
    const youtubeVideo = youtubeVideos.length > 0 ? youtubeVideos[0] : null
    
    const t = this.props.t
    return (
      <footer>
        <div className="news">
          <div className="facebook-latest-posts">
            <div className="facebook-latest-posts__content">
              
              <FacebookEmbed onSize={this.onSize}
                             parentWidth={this.state.facebookSize !== null ? this.state.facebookSize.width : 340}
                             parentHeight={this.state.facebookSize !== null ? (this.state.facebookSize.height - 2) : 385}
              
              />
            </div>
          
          </div>
        </div>
        <div className="twitter">
          <TwitterTimelineEmbed
            sourceType="url"
            url="https://twitter.com/RQDB_64"
            noFooter
            options={{
              height: '100%',
            }}
          />
        </div>
        <div className="video">
          <div className="youtube-latest-videos">
            {
              youtubeVideo !== null ? (
                <ReactPlayer url={`https://www.youtube.com/watch?v=${youtubeVideo.videoId}`}
                             className={`react-youtube react-youtube-${youtubeVideo.videoId}`}
                             ref={this.ref} onEnded={this.handleEnded} width='100%' height='100%' playing light
                             controls/>
              ) : null
            }
          </div>
        </div>
        <div className="bottom_section">
          <div className="contact">
            {t('FOOTER_MAIL')} <a href="mailto:ops@garderlecap.global">ops@garderlecap.global</a>
          </div>
          <div className="contact">
            {t('FOOTER_MAIL')} <a href="mailto:com@garderlecap.global">com@garderlecap.global</a>
          </div>
          <div className="copyrights">
            {t('FOOTER_RIGHTS')}
          </div>
        </div>
      </footer>
    )
    
  }
}

const FacebookEmbed = sizeMe({ monitorHeight: true, refreshRate: '1000' })(({ parentWidth, parentHeight }) => {
  return (
    <FacebookProvider appId="257658278760639">
      
      <Page href="https://www.facebook.com/operationgarderlecap/" tabs="timeline" hideCover={true}
            width={parseInt(parentWidth)}
            height={parentHeight}
            adaptContainerWidth={true} smallHeader={true} showFacepile={false} lazy={true}/>
    </FacebookProvider>
  )
})
export default withTranslation()(Footer)
