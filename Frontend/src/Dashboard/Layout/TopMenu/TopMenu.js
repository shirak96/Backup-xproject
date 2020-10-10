import React, { Component } from 'react'
import { Dropdown, Icon, Image, Label, Menu } from 'semantic-ui-react'
import { get_gravatar } from '../../Utils'

import './TopMenu.scss'
// import PropTypes from 'prop-types';

const countryOptions = [
  { key: 'en', value: 'en', flag: 'us', text: 'English' },
  { key: 'ar', value: 'ar', flag: 'sa', text: 'Arabic' },
  { key: 'fr', value: 'fr', flag: 'fr', text: 'French' },
  { key: 'es', value: 'es', flag: 'es', text: 'Spanish' },
]


class TopMenu extends Component {
    state = {};

    handleItemClick = (e, {name}) => this.setState({activeItem: name});

    doSearch(event) {
        // this.props.actions.search(event.target.value);
    }

    render() {
        return (
            <Menu fixed="top" className="top-menu">
                <Menu.Item className={`logo-space-menu-item ${this.props.sideMenu.open ? 'small-side ' : ''}`}>
                    <div className="display-inline logo-space">
                        <Image src="/Logoimg.png"/>
                    </div>
                </Menu.Item>

                <Menu.Item
                    className="no-border"
                    style={{
                        marginLeft: this.props.sideMenu.open ? '10em' : '0'
                    }}
                    onClick={this.props.sideMenu.toggleSideMenu}>

                    <Icon style={{fontSize: '2.5em'}} name="bars"/>
                </Menu.Item>

                <Menu.Item className="no-border drop-left-padding">
                  <Dropdown
                    placeholder='Select Country'
                    fluid
                    search
                    selection
                    defaultValue={this.props.language.value}
                    options={countryOptions}
                    onChange={(event, data) => {
                      this.props.language.handleChange(data.value)
                    }}
                  />
                </Menu.Item>

                <Menu.Menu position="right">
                   
                    <Menu.Item className="no-border" position="right">
                        <div className="display-inline">
                            <Image
                              circular
                              size={'mini'}
                              src={get_gravatar('gkaramgk94@gmail.com', 50)}
                            />
                            Gaby
                        </div>
                      &nbsp;
                      &nbsp;
                      &nbsp;
                      &nbsp;
                    </Menu.Item>
                  
                </Menu.Menu>
            </Menu>
        );
    }
}

TopMenu.propTypes = {};

export default TopMenu;

