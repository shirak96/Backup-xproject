import PropTypes from 'prop-types';
import React from 'react';
import { Button, Form, Modal } from 'semantic-ui-react'
import InputController from '../InputController'

import './CreateItem.scss';

const CreateItem = ({open, onClose, onSubmit, addModalTitle, fields, fieldsValues}) => {
  
  const onFormSubmit = (event) => {
    event.preventDefault();
    onSubmit(fieldsValues)
  }
  return (
      <Modal className="add-modal" scrolling="true" size='fullscreen' closeIcon open={open} onClose={onClose}>
        <Modal.Header>{addModalTitle}</Modal.Header>
        <Modal.Content>
          <Form onSubmit={onFormSubmit}>
            {
              fields.map((field, index) => {
                const fieldValue = {
                  value: fieldsValues[field.inputProps.name],
                  previewValue: field.inputProps.type === 'image' ? fieldsValues[field.inputProps.name + '_preview'] : fieldsValues[field.inputProps.name],
                };
                return <InputController {...field} mode="add" fieldValue={fieldValue} onChange={(event) => {
                  field.onChange({...event, mode: 'add'})
                }} key={index}/>
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
CreateItem.prototype = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
}
CreateItem.defaultProps = {
  open: true,
  onClose: () => {
    console.log('Modal was closed')
  },
  onSubmit: (fields) => {
    alert('Modal was submited')
  },
}
export default CreateItem;
