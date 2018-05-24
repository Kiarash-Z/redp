import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';

import './SongsList.css';

const Song = inject('appStore')(observer(class Song extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
  }

  componentDidUpdate() {
    const { playingSong } = this.props.appStore;
    if (!playingSong.isPlaying || playingSong.id !== this.props.id) return;
    this.animateCanvas();
  }

  animateCanvas = () => {
    const audio = this.props.audio;
    this.audioContext = this.audioContext || new AudioContext();
    this.source = this.source || this.audioContext.createMediaElementSource(audio);
    const analyser = this.audioContext.createAnalyser();
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext('2d');
    this.source.connect(analyser);
    analyser.connect(this.audioContext.destination);
    frameLooper();

    function frameLooper() {
      window.requestAnimationFrame(frameLooper);
      const fbc_array = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(fbc_array);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const grd = ctx.createLinearGradient(0,0,0,canvas.height - 20);
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
    const { appStore, title, artist, picture, id, index } = this.props;
    const { index: playingIndex, id: playingId } = appStore.playingSong;
    return (
      <div
        className={classNames('song', { '-scaled': (index < playingIndex) || (index > playingIndex) })}
        id={id === playingId ? 'activeSong' : ''}
      >
        <div className="song__titles-container">
          <h2 className="song__title">{title}&nbsp;</h2>
          <h3 className="song__title -secondary">{artist}&nbsp;</h3>
        </div>
        {picture ? (
          <figure className="song__image-container">
            <img className="song__image" draggable={false} src={picture} />
          </figure>
        ) : (
          <div className="song__image-container">
            <i className="a-music song__image-icon"/>
          </div>
        )}
        <canvas className="song__bars" id="bars" ref={this.canvasRef} />
      </div>
    );
  }
}))

export default Song;
