import lottie from 'lottie-web';
import React from 'react';

import { EventEmitter, Signals } from '../../../utils/EventEmitter.js'

import animationData from './data.json';
//scss
import './Splash.scss';

/**
 * @class Splash - Intro page component
 * @extends {React.Component}
 * @prop {function} showSplash --- deals with switching to the home page
 */
class Splash extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      popup: this.props.showSplash,
      animationFinished: false
    };
  }
  animObj = null;
  //giving animation name for referncing the name
  animationName = "LogoAnimation";
  
  componentDidMount() {
    this.loadAnimation();
    if (this.props.showSplash) {
      this.playAnimation();
      
    }
  }
  
  //handles rendering home page after animation finishes
  playAnimation() {
    
    document.body.classList.add('splash');
    this.animObj.addEventListener("complete", () => {
      //handles switching fadeIn and fadeOut className to Logo
      this.setState({ animationFinished: true })
      EventEmitter.emit(Signals.splashIsDone);
      //delay so we don't jump directly to home page after animation finishes
      setTimeout(() => {
        this.setState({ popup: false });
        console.log("finished animation")
        document.body.classList.remove('splash');
        this.props.handleSplashDone();
      }, 2000);
    });
    
    //added delay so animation can load a bit properly
    setTimeout(() => {
      this.animObj.play(this.animationName);
    }, 2000);
  }
  
  //handles loading and playing the animation after loading finishes
  loadAnimation() {
    this.animObj = lottie.loadAnimation({
      container: this.animBox, // the dom element that will contain the animation
      renderer: "svg",
      loop: false,
      autoplay: false,
      animationData: animationData, // the data to the animation json
      name: this.animationName,
      rendererSettings: {
        progressiveLoad: true, // Boolean, only svg renderer, loads dom elements when needed. Might speed up initialization for large number of elements.
      }
    });
    
    this.animObj.addEventListener("DOMLoaded", () => {
      this.playAnimation();
    })
  }
  
  render() {
    const { animationFinished } = this.state;
    return (
      <div className="popup">
        {this.state.popup ? (
          <div className="popup2">
            <div className="contentpopup">
              <div className="border_arc"/>
              <div
                className={`lottie ${animationFinished ? "elementToFadeOut" : "elementToFadeIn"}`}
                style={{ margin: "0 auto" }}
                ref={ref => (this.animBox = ref)}
              />
              <div className="border_arc2"/>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default Splash;
