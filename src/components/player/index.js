import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import PlayerCover from './components/PlayerCover';
import PlayerControls from './components/PlayerControls';
import './player.css';

const { ipcRenderer } = window.require('electron');

const Player = inject('appStore')(observer(class PlayerClass extends Component {
  componentDidMount() {
    ipcRenderer.on('files:open', (e, filePaths) => {
      this.props.appStore.openFile(filePaths);
    })
  }
  render() {
    return (
      <section className="player">
        <PlayerCover />
        <PlayerControls />
      </section>
    );
  }
}));

export default Player;
