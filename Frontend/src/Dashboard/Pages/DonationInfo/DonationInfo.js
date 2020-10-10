import React from 'react'

import CrudContainer from '../../Containers/CrudContainer'
import DashBoarLayout from '../../Layout/DashBoarLayout'

import './DonationInfo.scss'
// containers

export default class DonationInfo extends React.Component {
  
  render () {
    const selectedLanguage = localStorage.getItem('dashboard_lang')
    const defaultLanguage = 'fr'
    const currentLanguage = selectedLanguage !== null ? selectedLanguage : defaultLanguage
    
    const fields = [
      {
        key: 'transaction_id',
        labelProps: {
          label: 'Transaction ID',
        },
        inputProps: {
          type: 'text',
          name: 'transaction_id',
          placeholder: 'Transaction ID',
        },
      },
      {
        key: 'type',
        labelProps: {
          label: 'Payment Type',
        },
        inputProps: {
          type: 'text',
          name: 'type',
          placeholder: 'Payment Type',
        },
      },
      {
        key: 'full_name',
        labelProps: {
          label: 'Full name',
        },
        inputProps: {
          type: 'text',
          name: 'full_name',
          placeholder: 'Full name',
        },
      },
      {
        key: 'email',
        labelProps: {
          label: 'Email',
        },
        inputProps: {
          type: 'text',
          name: 'email',
          placeholder: 'Email',
        },
      },
      {
        key: 'about',
        labelProps: {
          label: 'About',
        },
        inputProps: {
          type: 'text',
          name: 'about',
          placeholder: 'About',
        },
      },
    
    ]
    
    return (
      <div className="donation-info-page">
        <DashBoarLayout {...this.props}>
          <CrudContainer fields={fields}  title={`Donation control`} apiBaseURL={'donation'} getParameters={[]}
                         viewModalTitle={'View' +
                         ' hero'}
                         editModalTitle="Update hero" addModalTitle="Add new hero"/>
        </DashBoarLayout>
      </div>
    )
  }
}
