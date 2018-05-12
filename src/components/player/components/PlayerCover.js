import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

const PlayerCover = inject('appStore')(observer(class PlayerCoverClass extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.animateCanvas = this.animateCanvas.bind(this);
  }

  componentDidUpdate() {
    if (!this.props.appStore.playingSong.isPlaying) return;
    this.animateCanvas();
  }

  animateCanvas() {
    const audio = this.props.appStore.playingSong.audio;
    if (!audio) return;
    this.audioContext = this.audioContext || new AudioContext();
    this.source = this.source || this.audioContext.createMediaElementSource(audio);
    const analyser = this.audioContext.createAnalyser();
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext('2d');
    this.source.connect(analyser);
    analyser.connect(this.audioContext.destination);
    frameLooper();

    function frameLooper() {
      window.webkitRequestAnimationFrame(frameLooper);
      const fbc_array = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(fbc_array);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var grd=ctx.createLinearGradient(0,0,0,canvas.height - 20);
      grd.addColorStop(0,'rgba(230, 51, 84, 0.7)');
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
    const { appStore } = this.props;
    return (
      <div className="player-cover"v>
        <div className="player-cover__titles-container">
          <h2
            className="player-cover__title"
            style={{ color: appStore.playingSong.title ? '' : 'transparent' }}
          >
            {appStore.playingSong.title || 'blank'}
          </h2>
          <h3
            className="player-cover__title -secondary"
            style={{ color: appStore.playingSong.artist ? '' : 'transparent' }}
          >
            {appStore.playingSong.artist || 'blank'}
          </h3>
        </div>
        {appStore.playingSong.picture ? (
          <figure className="player-cover__image-container">
            <img draggable={false} src={appStore.playingSong.picture} className="player-cover__image" />
          </figure>
        ) : (
          <div className="player-cover__image-container">
            <i className="a-music player-cover__image-icon"/>
          </div>
        )}
        <canvas className="player-cover__bars" id="bars" ref={this.canvasRef} />
      </div>
    );
  }
}))

export default PlayerCover;
