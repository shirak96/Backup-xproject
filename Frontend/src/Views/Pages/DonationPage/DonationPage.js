import React, { Component } from 'react'
//Custom Components
import Donation from '../../Components/Donation/Donation.js'
//scss
import './DonationPage.scss'

class DonationPage extends Component {
    
    render () {
        return (
          <div className="DonationPage">
              <Donation {...this.props}/>
          </div>
        )
    }
}

export default DonationPage



