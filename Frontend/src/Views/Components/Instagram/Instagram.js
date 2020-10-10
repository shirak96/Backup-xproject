import axios from 'axios'
import React from 'react'
import InstagramEmbed from 'react-instagram-embed'
import { Controller as SettingController } from '../../../Controllers/settingController'
import './Instagram.scss'

class Instagram extends React.Component {
  state = {
    images: [],
  };
  
  async componentDidMount () {
    try {
      const instagramSetting = await SettingController.getSettingByKey('instagram_token')
      const instagram_token = instagramSetting.data[0].value;
      axios.get(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink&access_token=${instagram_token}`)
        .then(res => {
          this.setState({images: res.data.data});
        })
        .catch(err => {
          console.log(err)
        })
    } catch (e) {
    
    }
    
  }
  
  render() {
    return (
        <div className="instagram">
          <div className="grid">
            {this.state.images.map((image, key) => {
              return <InstagramEmbed
                  key={key}
                  url={image.permalink}
                  hideCaption={false}
                  containerTagName='div'
                  protocol=''
                  injectScript
                  onLoading={() => {}}
                  onSuccess={() => {}}
                  onAfterRender={() => {}}
                  onFailure={() => {}}
              />
            })}
          </div>
        
        </div>
    )
  }
}

export default Instagram;
