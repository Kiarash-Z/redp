import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import './PlayerControls.css';

let isMouseDown = false;

const PlayerControls = inject('appStore')(observer(class PlayerControlsClass extends Component {
  constructor(props) {
    super(props);
    this.barRef = React.createRef();
    this.progressRef = React.createRef();
  }

  componentDidMount() {
    const progressEl = this.progressRef.current
    progressEl.addEventListener('mousedown', () => { isMouseDown = true });
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', e => {
      if (!isMouseDown) return;
      isMouseDown = false;
      this.changeProgress(e);
    });
  }

  componentDidUpdate() {
    if (!this.props.appStore.playingSong.audio) return;
    this.props.appStore.playingSong.audio.removeEventListener('timeupdate', this.updateBar);
    this.props.appStore.playingSong.audio.addEventListener('timeupdate', this.updateBar);

    this.props.appStore.playingSong.audio.removeEventListener('loadedmetadata', this.props.appStore.setDuration);
    this.props.appStore.playingSong.audio.addEventListener('loadedmetadata', this.props.appStore.setDuration);
  }

  handleMouseMove = e => {
    if (!isMouseDown) return;
    const progressEl = this.progressRef.current
    const { offsetLeft: left } = progressEl;
    const right = progressEl.offsetWidth + left;
    if (e.clientX <= right && e.clientX >= left) {
      const bar = this.barRef.current;
      const progressed = (e.clientX - left) / progressEl.offsetWidth;
      this.props.appStore.updateCurrent(progressed * this.props.appStore.duration)
    }
  }

  changeProgress = e => {
    e.stopPropagation();
    const progressEl = this.progressRef.current;
    this.props.appStore.seek((e.clientX - progressEl.offsetLeft)  / progressEl.offsetWidth);
  }

  updateBar = ({ target: audio }) => {
    if (isMouseDown) return;
    this.props.appStore.updateCurrent();
  }
  render() {
    const { appStore } = this.props;
    return (
      <div className="player-controls">
        <div className="player-progress-container" ref={this.progressRef}>
          <div className="player-progress">
            <div className="player-progress__bar" ref={this.barRef} style={{ width: appStore.barWidth }}>
              <div className="player-progress__dragger" />
            </div>
          </div>
        </div>

        <div className="player-time">
          <span>{appStore.formattedCurrent}</span>
          <span>{appStore.formattedDuration}</span>
        </div>

        <div className="player-controls-container" disabled={appStore.isControlDisabled}>
          <button className="player-controls__button">
            <i className="a-previous" />
          </button>

          <button className="player-controls__button -play" onClick={appStore.togglePlay} disabled={appStore.isControlDisabled}>
            <i className={`a-${appStore.playingSong.isPlaying ? 'pause' : 'play player-controls__play'}`} />
          </button>

          <button className="player-controls__button" disabled={appStore.isControlDisabled}>
            <i className="a-next" />
          </button>
        </div>
      </div>
    );
  }
}));

export default PlayerControls;
