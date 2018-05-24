import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import SongsList from './components/songs list';
import PlayerControls from './components/player controls';

const { ipcRenderer } = window.require('electron');

const Player = inject('appStore')(observer(class PlayerClass extends Component {
  componentDidMount() {
    ipcRenderer.on('files:open', (e, filePaths) => {
      this.props.appStore.openFile(filePaths);
    })
  }
  render() {
    return (
      <section style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: '1rem',
          flex: '1',
          justifyContent: 'flex-end'
        }}
      >
        <SongsList />
        <PlayerControls />
      </section>
    );
  }
}));

export default Player;
