import React, { Component } from 'react';
import { Container } from 'react-bootstrap';


//Custom Components
import Instagram from '../../Components/Instagram/Instagram.js';

//scss
import './InstagramPage.scss';

class InstagramPage extends Component {
  
  render() {
    
    return (
        <div className="InstagramPage">
          <Container>
            <Instagram/>
          </Container>
        </div>
    );
  }
}

export default InstagramPage;
