import React, { PureComponent } from 'react';
import { inject, observer } from 'mobx-react';

import Song from './Song';

const SongsList = inject('appStore')(observer(class SongsListClass extends PureComponent {
  renderSongs = () => {
    if (!this.props.appStore.songs.length) return <Song />;
    return this.props.appStore.songs.map(song => <Song {...song} />);
  }
  render() {
    return (
      <div>
        {this.renderSongs()}
      </div>
    )
  }
}));

export default SongsList;
