import PropTypes from 'prop-types'
import React from 'react'
import { Button } from 'semantic-ui-react'
import CreateItem from '../Components/CRUD/CreateItem/CreateItem'
import DisplayTable from '../Components/CRUD/DisplayTable/DisplayTable'
import EditItem from '../Components/CRUD/EditItem/EditItem'
import ViewItem from '../Components/CRUD/ViewItem/ViewItem'

import API from '../Utils/api'

class AdminContainer extends React.Component {
  
  constructor (props) {
    super(props)
    
    this.state = {
      items: [],
      title: '',
      fields: [],
      fieldsValues: {
        add: {},
        edit: null,
        view: null,
      },
      apiBaseURL: null,
      getParameters: [],
      addModalTitle: null,
      editModalTitle: null,
      viewModalTitle: null,
      addModalOpen: false,
      editModalOpen: false,
      viewModalOpen: false,
    }
  }
  
  componentDidMount () {
    
    const new_fields = this.props.fields.map(field => {
      if (['text', 'link', 'email', 'password'].includes(field.inputProps.type)) {
        field.onChange = this.handleInputChange
      }
      if (field.inputProps.type === 'image') {
        field.onChange = this.handleImageChange
      }
      if (field.inputProps.type === 'file') {
        field.onChange = this.handleFileInputChange
      }
      if (field.inputProps.type === 'wysiwyg') {
        field.onChange = this.handleWysiwygEditor
      }
      return field
    })
    const addFieldsValues = this.getInitialAddFields(new_fields)
    this.setState({
      title: this.props.title,
      fields: new_fields,
      fieldsValues: {
        ...this.state.fieldsValues,
        add: {
          ...this.state.fieldsValues.add,
          ...addFieldsValues,
        },
      },
      apiBaseURL: this.props.apiBaseURL,
      getParameters: this.props.getParameters,
      viewModalTitle: this.props.viewModalTitle,
      addModalTitle: this.props.addModalTitle,
      editModalTitle: this.props.editModalTitle,
    }, () => {
      this.getAllData()
    })
    
  }
  
  getInitialAddFields = (new_fields) => {
    const addFieldsValues = {}
    
    new_fields.forEach(field => {
      if (field.type === 'image') {
        addFieldsValues[field.inputProps.name + '_preview'] = ''
      }
      if (field.inputProps.defaultValue !== undefined) {
        addFieldsValues[field.inputProps.name] = field.inputProps.defaultValue
      } else {
        addFieldsValues[field.inputProps.name] = ''
      }
    })
    
    return addFieldsValues
  }
  
  addModalHandleOpen = () => this.setState({ addModalOpen: true })
  
  addModalHandleClose = () => this.setState({ addModalOpen: false })
  
  editModalHandleOpen = (item) => {
    const values = {}
    values.id = item.id
    this.state.fields.forEach(field => {
      values[field.inputProps.name] = item[field.key]
      
      if (field.inputProps.type === 'image') {
        values[field.inputProps.name + '_preview'] = item[field.key]
        
      }
    })
    this.setState({
      fieldsValues: {
        ...this.state.fieldsValues,
        edit: values,
      },
      editModalOpen: true,
    })
  }
  
  editModalHandleClose = () => this.setState({
    editModalOpen: false, fieldsValues: {
      ...this.state.fieldsValues,
      edit: null,
    },
  })
  
  viewModalHandleOpen = (item) => {
    
    const values = {}
    values.id = item.id
    this.state.fields.forEach(field => {
      values[field.inputProps.name] = item[field.key]
      
      if (field.inputProps.type === 'image') {
        values[field.inputProps.name + '_preview'] = item[field.key]
        
      }
    })
    this.setState({
      fieldsValues: {
        ...this.state.fieldsValues,
        view: values,
      },
      viewModalOpen: true,
    })
    
  }
  
  viewModalHandleClose = () => this.setState({ viewModalOpen: false, activeViewItem: null })
  
  callAPI = async ({ apiURL, method, data, headers }) => {
    switch (method.toLowerCase()) {
      case 'get':
        return await API().get(apiURL)
      case 'post':
        return await API().post(apiURL, data, {
          headers,
        })
      case 'delete':
        return await API().delete(apiURL)
      case 'put':
        return await API().put(apiURL, data, {
          headers,
        })
      case 'patch':
        return await API().patch(apiURL, data, {
          headers,
        })
      default:
        return await API().get(apiURL)
    }
  }
  
  getAllData = async () => {
    try {
      let getParameters = ''
      
      this.state.getParameters.map((param, index) => {
        if (index !== 0 && index !== (this.state.getParameters.length - 1)) {
          getParameters += '&'
        }
        getParameters += `${param.key}=${param.value}`
        
      })
      // const response = await API().get('newspaper');
      const response = await this.callAPI({
        apiURL: `${this.state.apiBaseURL}?${getParameters}`,
        method: 'GET',
      })
      
      if (response.data.status.code === 200) {
        this.setState({
          items: response.data.data,
        })
      } else {
        alert('Something went wrong please try to refresh the page')
      }
    } catch (e) {
      alert('Something went wrong please try to refresh the page')
    }
  }
  
  addNewData = async () => {
    try {
      const isFormData = this.state.fields.some(field => {
        return field.inputProps.type === 'image' || field.inputProps.type === 'file'
      })
      
      const apiDataHeaders = {}
      if (isFormData) {
        
        const formData = new FormData()
        this.state.fields.forEach(field => {
          formData.append(field.key, this.state.fieldsValues.add[field.inputProps.name])
        })
        apiDataHeaders.data = formData
        apiDataHeaders.headers = {
          'Content-Type': 'multipart/form-data',
        }
      } else {
        apiDataHeaders.data = {}
        this.state.fields.forEach(field => {
          apiDataHeaders.data[field.key] = this.state.fieldsValues.add[field.inputProps.name]
        })
      }
      
      let getParameters = ''
      this.state.getParameters.map((param, index) => {
        if (index !== 0 && index !== (this.state.getParameters.length - 1)) {
          getParameters += '&'
        }
        getParameters += `${param.key}=${param.value}`
        
      })
      
      const response = await this.callAPI({
        apiURL: `${this.state.apiBaseURL}?${getParameters}`,
        method: 'POST',
        ...apiDataHeaders,
      })
      console.log('llll', response)
      if (response.data.status.code === 201) {
        const addFieldsValues = this.getInitialAddFields(this.state.fields)
        this.setState({
          fieldsValues: {
            ...this.state.fieldsValues,
            add: {
              ...this.state.fieldsValues.add,
              ...addFieldsValues,
            },
          },
          addModalOpen: false,
          
        })
        await this.getAllData()
      }
    } catch (e) {
      alert(e.message)
    }
  }
  
  deleteData = async ({ id }) => {
    try {
      // const response = await API().delete(`newspaper/${id}`);
      const response = await this.callAPI({
        apiURL: `${this.state.apiBaseURL}/${id}`,
        method: 'DELETE',
      })
      
      if (response.data.status.code === 202) {
        alert('deleted')
        await this.getAllData()
      }
    } catch (e) {
      alert(e.message)
    }
  }
  
  updateData = async ({ id }) => {
    try {
      const isFormData = this.state.fields.some(field => {
        return field.inputProps.type === 'image' || field.inputProps.type === 'file'
      })
      const apiDataHeaders = {}
      if (isFormData) {
        const formData = new FormData()
        this.state.fields.forEach(field => {
          formData.append(field.key, this.state.fieldsValues.edit[field.inputProps.name])
        })
        formData.append('id', id)
        apiDataHeaders.data = formData
        apiDataHeaders.headers = {
          'Content-Type': 'multipart/form-data',
        }
      } else {
        apiDataHeaders.data = {}
        this.state.fields.forEach(field => {
          apiDataHeaders.data[field.key] = this.state.fieldsValues.edit[field.inputProps.name]
        })
        apiDataHeaders.data.id = id
      }
      const response = await this.callAPI({
        apiURL: `${this.state.apiBaseURL}/${id}`,
        method: 'PUT',
        ...apiDataHeaders,
      })
      if (response.data.status.code === 202) {
        this.setState({
          editModalOpen: false,
          fieldsValues: {
            ...this.state.fieldsValues,
            edit: null,
          },
        })
        await this.getAllData()
      }
    } catch (e) {
      alert(e.message)
    }
  }
  
  handleInputChange = ({ event, mode }) => {
    this.setState({
      fieldsValues: {
        ...this.state.fieldsValues,
        [mode]: {
          ...this.state.fieldsValues[mode],
          [event.target.name]: event.target.value,
        },
      },
    })
  }
  
  handleSelectChange = ({ name, value, mode }) => {
    this.setState({
      fieldsValues: {
        ...this.state.fieldsValues,
        [mode]: {
          ...this.state.fieldsValues[mode],
          [name]: value,
        },
      },
    })
  }
  
  handleFileInputChange = ({ event, mode }) => {
    this.setState({
      fieldsValues: {
        ...this.state.fieldsValues,
        [mode]: {
          ...this.state.fieldsValues[mode],
          [event.target.name]: event.target.files.length > 0 ? event.target.files[0] : null,
        },
      },
    })
  }
  
  handleWysiwygEditor = ({ data, name, mode }) => {
    
    this.setState({
      fieldsValues: {
        ...this.state.fieldsValues,
        [mode]: {
          ...this.state.fieldsValues[mode],
          [name]: data,
        },
      },
    })
  }
  
  handleImageChange = ({ file, imagePreviewUrl, name, mode }) => {
    this.setState({
      fieldsValues: {
        ...this.state.fieldsValues,
        [mode]: {
          ...this.state.fieldsValues[mode],
          [name + '_preview']: imagePreviewUrl,
          [name]: file,
        },
      },
    })
  }
  
  render () {
    const { items, fields, fieldsValues, title } = this.state
    return (
      <>
        <div className="header">
          <h1>{title}</h1>
          <div className="action">
            <Button onClick={this.addModalHandleOpen}>Add new</Button>
          </div>
        </div>
        <DisplayTable fields={fields} items={items} onDelete={this.deleteData}
                      onEdit={this.editModalHandleOpen}
                      onView={this.viewModalHandleOpen}/>
        <CreateItem addModalTitle={this.state.addModalTitle} fields={fields} fieldsValues={fieldsValues.add}
                    open={this.state.addModalOpen}
                    onSubmit={this.addNewData}
                    onClose={this.addModalHandleClose}/>
        {
          fieldsValues.edit !== null ? <EditItem open={this.state.editModalOpen}
                                                 editModalTitle={this.state.editModalTitle}
                                                 fields={fields} fieldsValues={fieldsValues.edit}
                                                 onSubmit={this.updateData}
                                                 onClose={this.editModalHandleClose}/> : null
        }
        {
          fieldsValues.view !== null ? <ViewItem open={this.state.viewModalOpen}
                                                 viewModalTitle={this.state.viewModalTitle}
                                                 fields={fields} fieldsValues={fieldsValues.view}
                                                 onClose={this.viewModalHandleClose}/> : null
        }
      
      
      </>
    )
  }
  
}

AdminContainer.propTypes = {
  fields: PropTypes.array,
  getParameters: PropTypes.array,
}
AdminContainer.defaultProps = {
  fields: [],
  getParameters: [],
}

export default AdminContainer
