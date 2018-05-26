import React, { PureComponent } from 'react';
import './Nav.css';

const { ipcRenderer } = window.require('electron');

class Nav extends PureComponent {
  sendOpenDialog = () => {
    ipcRenderer.send('dialog:open');
  }
  render() {
    return (
      <nav className="nav">
        <button className="nav__open-button"onClick={this.sendOpenDialog}>
          <i className="a-folder"/>
        </button>
      </nav>
    );
  }
}

export default Nav;