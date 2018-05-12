import { decorate, observable, computed, action } from 'mobx';
var jsmediatags = window.require('jsmediatags');

class AppStore {
  songs = [];
  duration = 0;
  current = 0;

  openFile(filePaths) {
    this.songs = filePaths.map(path => {
      const filePath = `file://${path}`
      const audio = new Audio();
      audio.src = filePath;
      return {
        filePath,
        audio,
        fsPath: path,
        id: path,
      }
    });
    this.playFirstSong();
    this.readSongsMetadata();
  }

  readSongsMetadata() {
    const that = this;
    this.songs.forEach(item => {
      new jsmediatags.Reader(item.fsPath)
        .setTagsToRead(['title', 'artist', 'picture'])
        .read({
          onSuccess({ tags }) {
            that.songs = that.songs.map(song => {
              if (song.id === item.id && !song.artist) {
              const imageData = tags.picture.data;
              let base64String = '';
              for (var i = 0; i < imageData.length; i++) {
                base64String += String.fromCharCode(imageData[i]);
              }
                song = {
                  ...song,
                  audio: song.audio,
                  title: tags.title,
                  artist: tags.artist,
                  picture: `data:${tags.picture.format};base64, ${window.btoa(base64String)}`,
                };
              }
              return song;
            });
          },
          onError(err) {
            console.log(err)
          }
        })
      });
  }

  playFirstSong() {
    this.songs = this.songs.map((song, index) => {
      if (!index) {
        song.audio.play();
        song.isPlaying = true;
        song.isActive = true;
      }
      return song;
    })
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

  updateCurrent(value) {
    this.current = value || this.playingSong.audio.currentTime;
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
  readSongsMetadata: action.bound,
  playFirstSong: action.bound,

  playingSong: computed,
  formattedCurrent: computed,
  formattedDuration: computed,
  barWidth: computed,
});

const appStore = new AppStore();

export { appStore };
