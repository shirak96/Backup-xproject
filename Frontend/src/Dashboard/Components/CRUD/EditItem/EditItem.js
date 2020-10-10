import PropTypes from 'prop-types';
import React from 'react';
import { Button, Form, Modal } from 'semantic-ui-react'
import InputController from '../InputController'

import './EditItem.scss';

const EditItem = ({open, onClose, onSubmit, editModalTitle, fields, fieldsValues}) => {
  
  const onFormSubmit = (event) => {
    event.preventDefault();
    onSubmit(fieldsValues)
  }
  return (
      <Modal className="edit-modal" size='fullscreen' closeIcon open={open} onClose={onClose}>
        <Modal.Header>{editModalTitle}</Modal.Header>
        <Modal.Content>
          <Form onSubmit={onFormSubmit}>
            {
              fields.map((field, index) => {
                const fieldValue = {
                  value: fieldsValues[field.inputProps.name],
                  previewValue: field.inputProps.type === 'image' ? fieldsValues[field.inputProps.name + '_preview'] : fieldsValues[field.inputProps.name],
                };
                return <InputController {...field} mode="edit" fieldValue={fieldValue} onChange={(event) => {
                  field.onChange({...event, mode: 'edit'})
                }
                } key={index}/>
              })
            }
            <div className="actions">
              <Button negative onClick={onClose}>No</Button>
              <Button type='submit'
                      positive
                      icon='checkmark'
                      labelPosition='right'
                      content='Yes'
              />
            </div>
          </Form>
        
        </Modal.Content>
      
      </Modal>
  )
}
EditItem.prototype = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  initialFields: PropTypes.shape({
    image_alt: PropTypes.string,
    image_title: PropTypes.string,
    image_preview_url: PropTypes.string,
  }),
}
EditItem.defaultProps = {
  open: true,
  onClose: () => {
    console.log('Modal was closed')
  },
  onSubmit: (fields) => {
    alert('Modal was submited')
  },
  initialFields: {
    image_alt: '',
    image_title: '',
    image_file: '',
    image_preview_url: '',
  },
}
export default EditItem;
