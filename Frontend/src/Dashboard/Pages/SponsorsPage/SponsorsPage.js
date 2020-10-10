import React from 'react'

import CrudContainer from '../../Containers/CrudContainer'
import DashBoarLayout from '../../Layout/DashBoarLayout'

import './SponsorsPage.scss'
// containers
export default class SponsorsPage extends React.Component {
  
  render() {
  
    const selectedLanguage = localStorage.getItem('dashboard_lang')
    const defaultLanguage = 'fr'
    const currentLanguage = selectedLanguage !== null ? selectedLanguage : defaultLanguage
    const fields = [
      {
        key: 'image_title',
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
        key: 'image_alternative',
        labelProps: {
          label: 'Image alt',
        },
        inputProps: {
          type: 'text',
          name: 'image_alt',
          placeholder: 'Image alt',
        },
      },
      {
        key: 'image',
        labelProps: {
          label: 'Hero Image',
        },
        inputProps: {
          type: 'image',
          name: 'image_file',
          required: true,
        },
      },
      {
        key: 'title',
        labelProps: {
          label: 'Title',
        },
        inputProps: {
          type: 'text',
          name: 'title',
          placeholder: 'Title',
        },
      },
      {
        key: 'content',
        showInTable: false,
        labelProps: {
          label: 'Content',
        },
        inputProps: {
          type: 'wysiwyg',
          name: 'content',
          required: true,
          placeholder: 'Hero card content',
        },
      },
      {
        key: 'link',
        showInTable: false,
        labelProps: {
          label: 'Link',
        },
        inputProps: {
          type: 'link',
          name: 'link',
          required: true,
          placeholder: 'Hero card link',
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
        <div className="sponsors-page">
          <DashBoarLayout {...this.props}>
            <CrudContainer fields={fields} title={`Sponsors control`} apiBaseURL={'sponsor'}
                           getParameters={[{ key: 'lang', value: currentLanguage }]} viewModalTitle={'View sponsor'}
                           editModalTitle="Update sponsor" addModalTitle="Add new sponsor"/>
          </DashBoarLayout>
        </div>
    )
  }
}
