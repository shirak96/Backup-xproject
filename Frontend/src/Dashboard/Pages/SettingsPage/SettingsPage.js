import React from 'react'
import './SettingsPage.scss'

import CrudContainer from '../../Containers/CrudContainer'
import DashBoarLayout from '../../Layout/DashBoarLayout'

const required_settings = [
  {
    data: {
      label: 'Instagram Token',
      key: 'instagram_token',
      value: '',
    },
    search: [
      {
        key: 'key',
        value: 'instagram_token',
      },
    ],
  },
]

export default class SettingsPage extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      settings: [],
      loading: false,
    }
  }
  
  render() {
    const { loading } = this.state
  
    const fields = [
      {
        key: 'label',
        labelProps: {
          label: 'Setting Label',
        },
        inputProps: {
          type: 'text',
          name: 'label',
          required: true,
        },
      },
      {
        key: 'key',
        labelProps: {
          label: 'Setting Key (lowercase without spaces)',
        },
        inputProps: {
          type: 'text',
          name: 'key',
          placeholder: 'Setting Key',
          required: true,
        },
      },
      {
        key: 'value',
        labelProps: {
          label: 'Setting Value',
        },
        inputProps: {
          type: 'text',
          name: 'value',
          placeholder: 'Setting Value',
          required: true,
        },
      },
      
    ]
    return (
        <div className="instagram-page">
          <DashBoarLayout {...this.props}>
            {
              loading ? 'Loading ...' : (
                  <>
                    <CrudContainer fields={fields} title={`Settings control`} initialItems={required_settings}
                                   apiBaseURL={'setting'}
                                   viewModalTitle={'View setting'}
                                   editModalTitle="Update setting" addModalTitle="Add new setting"/>
                  </>
              )
            }
          
          </DashBoarLayout>
        </div>
    );
  }
}

