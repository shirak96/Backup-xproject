import PropTypes from 'prop-types';
import React from 'react';
import { Button, Header, Table } from 'semantic-ui-react'
import TextIcon from '../../TextIcon'


import './DisplayTable.scss'

const DisplayTable = ({items, onDelete, onEdit, onView, fields}) => {
  return (
      <div className='display-table'>
        <Table celled>
          <Table.Header>
            <Table.Row>
              {
                fields.filter(item => item.showInTable !== undefined ? item.showInTable : true).map((field, index) => {
                  return <Table.HeaderCell key={index} {...field.props}>{field.labelProps.label} </Table.HeaderCell>
                  
                })
              }
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          
          <Table.Body>
            {
              items.map(item => {
                return (
                    <Table.Row key={item.id}>
                      {
                        fields.filter(item => item.showInTable !== undefined ? item.showInTable : true).map((field, key) => {
                          if (field.inputProps.type === 'image') {
                            return (
                                <Table.Cell key={key}>
                                  <Header as='h2' textAlign='center'>
                                    <img src={item[field.key]} alt={'newsletter '}/>
                                  </Header>
                                </Table.Cell>
                            )
                          } else if (field.inputProps.type === 'wysiwyg') {
                            return (
                                <Table.Cell key={key}>
                                    <div dangerouslySetInnerHTML={{
                                      __html: item[field.key],
                                    }}/>
                                    
                                </Table.Cell>
                            )
                          } else {
                            return (
                                <Table.Cell key={key}>
                                  {item[field.key]}
                                </Table.Cell>
                            )
                          }
                          
                        })
                        
                      }
                      
                      <Table.Cell>
                        <Button onClick={event => {
                          event.preventDefault()
                          onView(item);
                        }}>
                          <TextIcon color={'red'} name={'eye'}>View</TextIcon>
                        </Button>
                        <Button onClick={event => {
                          event.preventDefault()
                          onEdit(item);
                        }}>
                          <TextIcon color={'red'} name={'edit'}>Edit</TextIcon>
                        </Button>
                        <Button type="button" onClick={event => {
                          event.preventDefault();
                          onDelete(item)
                        }}> <TextIcon color={'red'} name={'delete'}>Delete</TextIcon> </Button>
                      </Table.Cell>
                    </Table.Row>
                )
              })
            }
          
          </Table.Body>
        </Table>
      </div>
  );
}

DisplayTable.propTypes = {
  handleLogin: PropTypes.func,
  handleLoginInputChange: PropTypes.func,
};

DisplayTable.defaultProps = {
  handleLogin: () => {
    alert('User login')
  },
  handleLoginInputChange: (key, value) => {
    console.log(`Event target: ${key}, value: ${value}`)
  },
}

export default DisplayTable;
