import React, { Component } from 'react';

import coverSrc from '../../../assets/images/do-be-shak.jpg';

class PlayerCover extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
  }
  componentDidMount() {
    console.log(this.canvasRef.current);
  }
  render() {
    return (
      <div className="player-cover"v>
        <div className="player-cover__titles-container">
          <h2 className="player-cover__title">Ax</h2>
          <h3 className="player-cover__title -secondary">Do Be Shak</h3>
        </div>
        <figure className="player-cover__image-container">
          <img src={coverSrc} className="player-cover__image" />
        </figure>
        <canvas className="player-cover__bars" id="bars" ref={this.canvasRef} />
      </div>
    );
  }
}

export default PlayerCover;
