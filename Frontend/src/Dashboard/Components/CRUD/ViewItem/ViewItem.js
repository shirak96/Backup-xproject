import React from 'react';
import { Form, Modal } from 'semantic-ui-react'
import InputController from '../InputController'

import './ViewItem.scss'

const ViewItem = ({open, onClose, fields, fieldsValues, viewModalTitle}) => {
  return (
      <Modal className="view-modal" size={'fullscreen'} closeIcon open={open} onClose={onClose}>
        <Modal.Header>{viewModalTitle}</Modal.Header>
        <Modal.Content>
          <Form onSubmit={event => event.preventDefault()}>
            {
              fields.map((field, index) => {
                const fieldValue = {
                  value: fieldsValues[field.inputProps.name],
                  previewValue: field.inputProps.type === 'image' ? fieldsValues[field.inputProps.name + '_preview'] : fieldsValues[field.inputProps.name],
                };
                const new_field = {
                  ...field,
                  inputProps: {
                    ...field.inputProps,
                    disabled: true,
                  },
                }
                return <InputController {...new_field} mode="view" fieldValue={fieldValue} key={index}/>
              })
            }
          </Form>
        
        </Modal.Content>
      
      </Modal>
  )
}
export default ViewItem;
