import { decorate, observable, computed, action } from 'mobx';
var fs = window.require('fs');
var mm = window.require('musicmetadata');

class AppStore {
  songs = [];
  duration = 0;
  current = 0;

  openFile(filePaths) {
    this.songs = filePaths.map(path => {
      return {
        filePath: `file://${path}`,
        fsPath: path,
        id: path
      }
    });
    this.songs.forEach(item => {
      mm(fs.createReadStream(item.fsPath), (err, metadata) => {
        if (err) throw err;
        this.songs = this.songs.map((song, index) => {
          if (song.id === item.id) song = {
            ...song,
            ...metadata,
            picture: metadata.picture[0].data.toString('base64'),
            artist: metadata.artist[0],
          };
          const audio = new Audio();
          if (index === 0) {
            audio.src = song.filePath;
            audio.play();
            song.isPlaying = true;
            song.isActive = true;
          }
          return { ...song, audio };
        });
      });
    });
  }

  togglePlay() {
    const audio = this.playingSong.audio;
    if (audio.paused) audio.play();
    else audio.pause();
    this.songs = this.songs.map(song => {
      if (song.id === this.playingSong.id) song.isPlaying = !audio.paused;
      return song;
    })
  }

  seek(value) {
    this.songs = this.songs.map(song => {
      if (song.id === this.playingSong.id) {
        song.audio.currentTime = value * song.audio.duration;
        this.updateCurrent();
      }
      return song;
    });
  }

  setDuration() {
    this.duration = this.playingSong.audio.duration;
  }

  updateCurrent(value = this.playingSong.audio.currentTime) {
    this.current = value;
  }

  get playingSong() {
    return this.songs.find(song => song.isActive) || {};
  }

  get formattedCurrent() {
    if (!this.playingSong.audio) return '00:00';
    const min = Math.floor(this.current / 60);
    let sec = String(Math.floor(this.current - min * 60));
    if (sec.length < 2) sec = `0${sec}`;
    return `${min}:${sec}`;
  }
  get formattedDuration() {
    if (!this.playingSong.audio) return '00:00';
    const min = Math.floor(this.duration / 60);
    let sec = String(Math.floor(this.duration - min * 60));
    if (sec.length < 2) sec = `0${sec}`;
    return `${min}:${sec}`;
  }
  get barWidth() {
    return `${(this.current / this.duration) * 100}%`
  }
}

decorate(AppStore, {
  songs : observable,
  duration: observable,
  current: observable,

  openFile: action.bound,
  togglePlay: action.bound,
  seek: action.bound,
  setDuration: action.bound,
  updateCurrent: action.bound,

  playingSong: computed,
  formattedCurrent: computed,
  formattedDuration: computed,
  barWidth: computed,
});

const appStore = new AppStore();

export { appStore };
