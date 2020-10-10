import React from 'react';
import { Input } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import './ImageUploadInput.scss'

const ImagePreview = ({imagePreviewUrl}) => {
  if (imagePreviewUrl) {
    return (<img src={imagePreviewUrl} alt="preview of uploaded file"/>);
  } else {
    return (<div className="previewText">Please select an Image for Preview</div>);
  }
}

const ImageUploadInput = ({imagePreviewUrl, handleImageChange, name,  required, ...rest}) => {
  const _handleImageChange = (event) => {
    event.preventDefault();
    
    let reader = new FileReader();
    let file = event.target.files[0];
    if (file !== undefined) {
      reader.onloadend = () => {
        handleImageChange({
          file: file,
          imagePreviewUrl: reader.result,
          name: name,
        });
      }
      
      reader.readAsDataURL(file)
    }else {
      handleImageChange({
        file: null,
        imagePreviewUrl: '',
        name: name,
      });
    }
    
  }
  return (
      <div className="image-upload-input">
        <Input className="file-input"
               {...rest}
               name={name}
               type="file"
               onChange={(event) => _handleImageChange(event)}/>
        <div className="img-preview">
          <ImagePreview imagePreviewUrl={imagePreviewUrl}/>
        </div>
      </div>
  )
}
ImageUploadInput.prototype = {
  imagePreviewUrl: PropTypes.string,
  name: PropTypes.string,
  handleImageChange: PropTypes.func,
  required: PropTypes.bool,
}
ImageUploadInput.defaultProps = {
  imagePreviewUrl: '',
  name: '',
  handleImageChange: ({imagePreviewUrl}) => {
    alert('Image src: ' + imagePreviewUrl)
  },
}

export default ImageUploadInput;
