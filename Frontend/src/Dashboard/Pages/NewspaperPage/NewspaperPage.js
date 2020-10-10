import React from 'react'
import CrudContainer from '../../Containers/CrudContainer'
// containers
import DashBoarLayout from '../../Layout/DashBoarLayout'

import './NewspaperPage.scss'

export default class NewspaperPage extends React.Component {
  
  render() {
    const selectedLanguage = localStorage.getItem('dashboard_lang')
    const defaultLanguage = 'fr'
    const currentLanguage = selectedLanguage !== null ? selectedLanguage : defaultLanguage
    const fields = [
      {
        key: 'title',
        labelProps: {
          label: 'Image alt test',
        },
        inputProps: {
          type: 'text',
          name: 'image_alt',
          placeholder: 'Image alt',
        },
      }, {
        key: 'help',
        labelProps: {
          label: 'Image alt',
        },
        inputProps: {
          type: 'text',
          name: 'image_alt2',
          placeholder: 'Image alt',
        },
      },
      {
        key: 'alternative',
        labelProps: {
          label: 'Image title',
        },
        inputProps: {
          type: 'text',
          name: 'image_title',
          placeholder: 'Image title',
        },
      },
      {
        key: 'image',
        labelProps: {
          label: 'Newsletter Image',
        },
        inputProps: {
          type: 'image',
          name: 'image_file',
          required: true,
        },
      },
      {
        key: 'lang',
        showInTable: false,
        labelProps: {
          label: 'Language',
        },
        inputProps: {
          type: 'hidden',
          name: 'lang',
          required: true,
          defaultValue: currentLanguage,
          placeholder: 'Hero card link',
        },
      },
    ]
    
    return (
        <div className="newsletter-page">
          <DashBoarLayout {...this.props}>
            <CrudContainer fields={fields} title={`Newspapers control`} apiBaseURL={'newspaper'}
                           getParameters={[{ key: 'lang', value: currentLanguage }]} viewModalTitle={'View newspaper'}
                           editModalTitle="Update newspaper" addModalTitle="Add new newspaper"/>
          </DashBoarLayout>
        </div>
    )
  }
}
