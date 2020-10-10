import React from 'react'
import { withTranslation } from 'react-i18next'
import ReactPlayer from 'react-player'

import { EventEmitter, Signals } from '../../../../utils/EventEmitter'

/**
 * - Component that handles display youtube iframe
 * @function YoutubeLive
 * @prop {string} liveId
 */
class YoutubeLive extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shouldPlay: false
        }
    }
    
    playYoutubeLive () {
        setTimeout(() => {
            this.setState({ shouldPlay: true });
        }, 8000);
    }
    
    renderYoutubeVideoPlayer() {
        const { liveId } = this.props;
        return (<ReactPlayer
          width="100%"
          height="100%"
          url={`https://www.youtube.com/watch?v=${liveId}`}
          onError={() => EventEmitter.emit(Signals.errorInReactPlayer)}
          controls
          playing={this.state.shouldPlay}
          onReady={() => {
              if (this.props.isLive) {
                  this.playYoutubeLive()
              }
          }}
        />)
    }
    
    renderVideoPlayerIssue() {
        
        return (
          <div className="VideoPlayer-error-container">
              <p>{this.props.t('YOUTUBE_LIVE_WAIT')}</p>
          </div>
        )
    }
    
    render() {
        const { liveId } = this.props;
        return liveId ? this.renderYoutubeVideoPlayer() : this.renderVideoPlayerIssue();
    }
}

export default withTranslation()(YoutubeLive)
