import React, { Component } from 'react';

class PlayerControls extends Component {
  render() {
    return (
      <div className="player-controls">
        <div className="player-progress-container">
          <div className="player-progress">
            <div className="player-progress__bar">
              <div className="player-progress__dragger" />
            </div>
          </div>
        </div>

        <div className="player-controls-container">
          <button className="player-controls__button">
            <i className="a-previous" />
          </button>

          <button className="player-controls__button -play">
            <i className="a-play player-controls__play" />
          </button>

          <button className="player-controls__button">
            <i className="a-next" />
          </button>
        </div>
      </div>
    );
  }
}

export default PlayerControls;
