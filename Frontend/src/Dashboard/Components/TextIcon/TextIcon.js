import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';


class TextIcon extends Component {
  
  style = {
    alignSelf: 'center',
    paddingLeft: '4px',
  };
  
  static propTypes = {
    name: PropTypes.string.isRequired,
    hideText: PropTypes.bool.isRequired,
    color: PropTypes.string,
  };
  
  render() {
    return (
        <div style={{whiteSpace: 'nowrap', display: 'inline-flex'}}>
          <Icon size='large'
                color={this.props.color}
                name={this.props.name}/>
          <div style={this.style} hidden={this.props.hideText}>
            {this.props.children}
          </div>
        </div>
    );
  }
}

TextIcon.propTypes = {
  color: PropTypes.string,
  name: PropTypes.string,
  hideText: PropTypes.bool,
  
};

TextIcon.defaultProps = {
  color: 'red',
  name: 'dashboard',
  hideText: false
}

export default TextIcon;
