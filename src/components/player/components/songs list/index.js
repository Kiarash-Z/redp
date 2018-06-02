import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import Song from './Song';

const audioContext = new AudioContext();
const SongsList = inject('appStore')(observer(class SongsListClass extends Component {
  renderSongs = () => {
    if (!this.props.appStore.songs.length) return <Song />;
    return this.props.appStore.songs.map(song => <Song audioContext={audioContext} key={song.id} {...song} />);
  }
  render() {
    return (
      <div
        id="songsList"
        className="songs-list" style={{ width: `${this.props.appStore.songs.length * 100 || 100}vw` }}
      >
        {this.renderSongs()}
      </div>
    )
  }
}));

export default SongsList;
