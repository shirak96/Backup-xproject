import React from 'react';
import CrudContainer from '../../Containers/CrudContainer'
import DashBoarLayout from '../../Layout/DashBoarLayout';
// containers

import './NewsPage.scss'
export default class NewspaperPage extends React.Component {
  render() {
    const selectedLanguage = localStorage.getItem('dashboard_lang')
    const defaultLanguage = 'fr'
    const currentLanguage = selectedLanguage !== null ? selectedLanguage : defaultLanguage
    const fields = [
      {
        key: 'name',
        labelProps: {
          label: 'Name',
        },
        inputProps: {
          type: 'text',
          name: 'name',
          placeholder: 'Name',
        },
      },
      {
        key: 'content',
        labelProps: {
          label: 'Content',
        },
        inputProps: {
          type: 'text',
          name: 'content',
          placeholder: 'Content',
        },
      },
      {
        key: 'date',
        labelProps: {
          label: 'Date',
        },
        inputProps: {
          type: 'text',
          name: 'date',
          required: false,
        },
      },
      {
        key: 'type',
        labelProps: {
          label: 'Sponsors or News',
        },
        inputProps: {
          type: 'select',
          name: 'type',
          required: true,
          options: [
            { key: 'news', value: 'news', text: 'News' },
            { key: 'sponsors', value: 'sponsors', text: 'Sponsors' },
          ]
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
        <div className="news-page">
          <DashBoarLayout {...this.props}>
            <CrudContainer fields={fields} title={`News control`} apiBaseURL={'news'} getParameters={[{ key: 'lang', value: currentLanguage }]}
                           viewModalTitle={'View' +
                           ' hero'}
                           editModalTitle="Update hero" addModalTitle="Add new hero"/>
          </DashBoarLayout>
        </div>
    )
  }
}
