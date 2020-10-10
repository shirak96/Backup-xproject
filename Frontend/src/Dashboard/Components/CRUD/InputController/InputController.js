import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import CKEditor from '@ckeditor/ckeditor5-react'
import PropTypes from 'prop-types'
import React from 'react'
import { FaFile } from 'react-icons/fa'
import { UID } from 'react-uid'

import { Dropdown, Form, Input } from 'semantic-ui-react'
import ImageUploadInput from '../ImageUploadInput'

// import * as FontColor from '@solomoto/ckeditor5-font-color';

const InputController = ({labelProps, inputProps, onChange, fieldValue, mode}) => {
  
  const renderInput = ({id}) => {
    const element_id = inputProps.name + '_' + id;
    
    // const value =
    if (['text', 'link', 'email'].includes(inputProps.type)) {
      return (
          <Form.Field>
            <label htmlFor={element_id}>{labelProps.label}</label>
            <Input {...inputProps} type={inputProps.type} id={element_id} name={inputProps.name} onChange={event => {
              onChange({event})
            }}
                   value={fieldValue.value}/>
          </Form.Field>
      )
    } else if (inputProps.type === 'image') {
      
      return (
          <Form.Field>
            <label htmlFor={element_id}>{labelProps.label}</label>
            <ImageUploadInput {...inputProps} id={element_id} imagePreviewUrl={fieldValue.previewValue}
                              handleImageChange={onChange}/>
          </Form.Field>
      )
    } else if (inputProps.type === 'select') {
      
      return (
          <Form.Field>
            <label htmlFor={element_id}>{labelProps.label}</label>
            <Dropdown
                placeholder={inputProps.placeholder}
                fluid
                search
                selection
                options={inputProps.options}
                {...inputProps}
                onChange={(event, data) => {
                  onChange({name: data.name, value: data.value})
                }}
            />
          </Form.Field>
      )
    } else if (inputProps.type === 'file') {
      
      if (mode === 'view') {
        return (
            <Form.Field>
              <label htmlFor={element_id}>{labelProps.label}</label>
              <a href={fieldValue.value} download target="_blank"
                 rel="noopener noreferrer"><FaFile/>View {fieldValue.value}</a>
            </Form.Field>
        )
      } else {
        return (
            <Form.Field>
              <label htmlFor={element_id}>{labelProps.label}</label>
              <Input {...inputProps} type={inputProps.type} id={element_id} name={inputProps.name} onChange={event => {
                onChange({event})
              }}/>
            </Form.Field>
        )
      }
    
    } else if (inputProps.type === 'wysiwyg') {
      
      if (mode === 'view') {
        return (
            <Form.Field>
              <label htmlFor={element_id}>{labelProps.label}</label>
              <div className="wysiwyg-content" dangerouslySetInnerHTML={{
                __html: fieldValue.value,
              }}>
              </div>
            </Form.Field>
        )
      } else {
        return (
          <Form.Field>
            <label htmlFor={element_id}>{labelProps.label}</label>
            <CKEditor
              editor={ClassicEditor}
              config={{
                heading: {
                  options: [
                    { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                    { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                    { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                    { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
                    { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
                    { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
                    {
                      model: 'heading6',
                      view: 'h6',
                      title: 'Heading 6 - to be used for orange color',
                      class: 'ck-heading_heading6',
                    },
                  ],
                },
                alignment: {
                  options: ['left', 'right', 'center', 'justify'],
                },
                // plugins: [FontColor]
              }}
              data={fieldValue.value}
              onInit={editor => {
                // You can store the "editor" and use when it is needed.
                console.log('Editor is ready to use!', editor)
              }}
              onChange={(event, editor) => {
                const data = editor.getData()
                console.log({ event, editor, data })
                onChange({ event, data, name: inputProps.name })
              }}
              onBlur={(event, editor) => {
                console.log('Blur.', editor)
              }}
              onFocus={(event, editor) => {
                console.log('Focus.', editor)
              }}
            />
          </Form.Field>
        )
      }
    
    } else if (inputProps.type === 'hidden') {
      return (
        <Form.Field>
          <Input {...inputProps} type={inputProps.type} id={element_id} name={inputProps.name} onChange={event => {
            onChange({ event })
          }}/>
        </Form.Field>
      )
    }
    else if (inputProps.type === 'password') {
      return (
        <Form.Field>
          <label htmlFor={element_id}>{labelProps.label}</label>
          <Input {...inputProps} type={inputProps.type} id={element_id} name={inputProps.name} onChange={event => {
            onChange({event})
          }}
                 value={fieldValue.value}/>
        </Form.Field>
      )
    } else {
      return 'Input setting conflict'
    }
  }
  
  return (
      <UID>
        {id => (
            <React.Fragment>
              {renderInput({id})}
            </React.Fragment>
        )}
      </UID>
  )
  
}

InputController.prototype = {
  labelProps: PropTypes.shape({
    label: PropTypes.string.isRequired,
  }),
  inputProps: PropTypes.shape({
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    image_preview_url: PropTypes.string,
    id: PropTypes.string,
  }),
}
InputController.defaultProps = {
  labelProps: {
    label: 'Input Label',
  },
  inputProps: {
    type: 'text',
    name: 'input',
  },
  imagePreviewUrl: '',
  name: '',
  handleImageChange: ({imagePreviewUrl}) => {
    alert('Image src: ' + imagePreviewUrl)
  },
}

export default InputController;
