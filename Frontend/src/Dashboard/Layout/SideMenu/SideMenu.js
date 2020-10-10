import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'
import TextIcon from '../../Components/TextIcon'
import './SideMenu.scss'

// import PropTypes from 'prop-types';

class SideMenu extends Component {
  state = {
    activeItem: 'dashboard',
    menu: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        icon: 'dashboard',
      },
      {
        path: '/dashboard/admin',
        name: 'Admin',
        icon: 'dashboard',
      },{
        path: '/dashboard/donation',
        name: 'Donation',
        icon: 'dashboard',
      },
      {
        path: '/dashboard/newsletter',
        name: 'Newsletter',
        icon: 'newspaper',
      }, {
        path: '/dashboard/hero',
        name: 'Hero',
        icon: 'newspaper',
      },
      {
        path: '/dashboard/news',
        name: 'News',
        icon: 'newspaper',
      },
      {
        path: '/dashboard/sponsors',
        name: 'Sponsors',
        icon: 'newspaper',
      },
      {
        path: '/dashboard/settings',
        name: 'Settings',
        icon: 'setting',
      },
      {
        path: '/dashboard/map-calendar',
        name: 'Map Calendar',
        icon: 'map',
      },
    ],
  };
  
  handleItemClick = (e, {name}) => this.setState({activeItem: name});
  
  getActiveItem = (item) => {
    return this.props.location.pathname === item
  }
  
  getMenu() {
    const {getActiveItem} = this;
    return (
        <Menu fixed='left' borderless className={(this.props.sideMenu.open ? '' : 'small-side') + ' side'} vertical>
          {
            this.state.menu.map((menuItem, index) => {
              const isActive = getActiveItem(menuItem.path);
              return (
                  <Menu.Item as={Link} key={index} to={menuItem.path} name={menuItem.name} active={isActive}
                             onClick={this.handleItemClick}>
                    <TextIcon hideText={!this.props.sideMenu.open} color={isActive ? 'teal' : null}
                              name={menuItem.icon}>
                      {menuItem.name}
                    </TextIcon>
                  </Menu.Item>
              )
            })
          }
  
  
          <Menu.Item name='log-out' className="log-out"
                     onClick={event => {
                       event.preventDefault();
                       this.props.logUserOut();
                     }}>
            <TextIcon hideText={!this.props.sideMenu.open} name='log out'>
              Log out
            </TextIcon>
          </Menu.Item>
        </Menu>
    )
  }
  
  render() {
    return (
        <div className='parent'>
          <div className={(!this.props.sideMenu.open ? 'small-side ' : '') + 'side'}>
            {this.getMenu()}
          </div>
          <div className={(!this.props.sideMenu.open ? 'small-content ' : '') + 'page-content'}>
            {this.props.children}
          </div>
        </div>
    )
  }
}

SideMenu.propTypes = {};

export default SideMenu;
