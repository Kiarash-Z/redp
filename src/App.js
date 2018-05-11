import React, { Component } from 'react';

import Nav from './components/Nav';
import Player from './components/player';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Nav />
        <Player />
      </div>
    );
  }
}

export default App;
