import React, { Component } from 'react';

import coverSrc from '../../../assets/images/do-be-shak.jpg';
import musicSrc from '../../../assets/music/ax.mp3'

class PlayerCover extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
  }
  componentDidMount() {
    const audio = new Audio();
    audio.src = musicSrc;
    audio.play();
    const context = new AudioContext();
    const analyser = context.createAnalyser();
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext('2d');
    const source = context.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(context.destination);
    frameLooper();

    function frameLooper() {
      window.webkitRequestAnimationFrame(frameLooper);
      const fbc_array = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(fbc_array);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var grd=ctx.createLinearGradient(0,0,0,canvas.height - 20);
      grd.addColorStop(0,'rgba(230, 51, 84, 0.2)');
      grd.addColorStop(1,'white');
      ctx.fillStyle = grd;
      const bars = 150;
      for (var i = 0; i < bars; i++) {
        const bar_x = i * 3;
        const bar_width = 2;
        const bar_height = -(fbc_array[i] / 3);
        //  fillRect( x, y, width, height ) // Explanation of the parameters below
        ctx.fillRect(bar_x, canvas.height, bar_width, bar_height);
      }
    }
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
