import React, { Component } from 'react';

import PlayerCover from './components/PlayerCover';
import PlayerControls from './components/PlayerControls';
import './player.css';

class Player extends Component {
  render() {
    return (
      <section className="player">
        <PlayerCover />
        <PlayerControls />
      </section>
    );
  }
}

export default Player;
