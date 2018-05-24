import React, { Component } from 'react';
import { Provider } from 'mobx-react';

import * as stores from './stores';
import Nav from './components/Nav';
import Player from './components/player';

class App extends Component {
  render() {
    return (
      <Provider {...stores}>
        <div className="App" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
          <Nav />
          <Player />
        </div>
      </Provider>
    );
  }
}

export default App;
