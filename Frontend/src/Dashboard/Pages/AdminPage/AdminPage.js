import React from 'react'
import AdminContainer from '../../Containers/AdminContainer'
import DashBoarLayout from '../../Layout/DashBoarLayout'
import './AdminPage.scss'
// containers
export default class AdminPage extends React.Component {
  render () {
    const fields = [
      {
        key: 'full_name',
        labelProps: {
          label: 'Full name',
        },
        inputProps: {
          type: 'text',
          name: 'full_name',
          placeholder: 'Full Name',
          required: true,
        },
      },
      {
        key: 'username',
        labelProps: {
          label: 'Username',
        },
        inputProps: {
          type: 'text',
          name: 'username',
          placeholder: 'Username',
          required: true,
  
        },
      },
      {
        key: 'email',
        labelProps: {
          label: 'Email',
        },
        inputProps: {
          type: 'email',
          name: 'email',
          placeholder: 'Email address',
          required: true,
        },
      },
      {
        key: 'password',
        showInTable: false,
        labelProps: {
          label: 'password',
        },
        inputProps: {
          type: 'password',
          name: 'password',
          required: false,
        },
      },
    ]
    
    return (
      <div className="admin-page">
        <DashBoarLayout {...this.props}>
          <AdminContainer fields={fields} apiBaseURL={'admin'}
                          viewModalTitle={'View admin'}
                          editModalTitle="Update admin" addModalTitle="Add new admin"/>
        </DashBoarLayout>
      </div>
    )
  }
}
