import React from 'react';
import AudioPlayer,  { RHAP_UI } from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

//scss
import "./Music.scss";

//assets
import Music from "./Music.mp3"


const Player = ({play}) => {
 return (
  <AudioPlayer
  src={Music}
  customProgressBarSection={[]}
  customControlsSection={[RHAP_UI.VOLUME_CONTROLS,]}
  preload='true'
  autoPlay
  loop
  volume="0.5"
/>
 )
};

export default Player;

