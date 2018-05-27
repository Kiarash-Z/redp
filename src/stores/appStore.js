import { decorate, observable, computed, action, intercept } from 'mobx';
import { TweenLite } from 'gsap/all';
const jsmediatags = window.require('jsmediatags');

let isAnimating = false;

class AppStore {
  songs = [];
  duration = 0;
  current = 0;

  constructor() {
    intercept(this, 'songs', change => {
      console.log('newww',change.newValue)
      if (change.newValue.length === 0) change.newValue = [{ 'dsf': 'sdfsd' }];
      return change;
    })
  }

  openFile(filePaths) {
    const update = () => {
      this.songs = filePaths.map((path, index) => {
        const filePath = `file://${path}`
        const audio = new Audio();
        audio.src = filePath;
        return {
          index,
          filePath,
          audio,
          fsPath: path,
          id: path,
        }
      });
      this.playFirstSong();
      this.readSongsMetadata();
    }
    if (this.songs.length) this.resetPlayer().then(update);
    else update();
  }

  resetPlayer() {
    if (this.playingSong.audio) this.playingSong.audio.pause();
    const songsListEl = document.getElementById('songsList');
    TweenLite.set(songsListEl, { x: '0%' });
    this.songs = [];
    // allow [] to be sent to component
    return Promise.resolve();
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
    });
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
    // 0 is false
    this.current = value === undefined ? this.playingSong.audio.currentTime : value;
  }

  startSongChange(direction) {
    if (isAnimating) return;
    const songsListEl = document.getElementById('songsList');
    const prevSongEl = document.getElementById('activeSong');
    const prevSongTitleEl = prevSongEl.querySelector('.song__titles-container');
    const nextSongEl = prevSongEl[direction === 'next' ? 'nextElementSibling' : 'previousElementSibling'];
    const nextSongTitleEl = nextSongEl.querySelector('.song__titles-container');
    const movement = `${direction === 'next' ? '-' : '+' }=${(prevSongEl.offsetWidth / songsListEl.offsetWidth) * 100}%`;
    nextSongTitleEl.classList.remove('-hidden');
    const animationDuration = 0.4;
    isAnimating = true;
    TweenLite.to(prevSongEl, animationDuration, {
      scale: 0.85,
      x: 0,
    });
    TweenLite.to(nextSongEl, animationDuration, {
      scale: 1,
      x: 0,
    });
    TweenLite.to(nextSongTitleEl, animationDuration / 1.5, {
      opacity: 1,
      y: 0,
    })
    TweenLite.to(prevSongTitleEl, animationDuration / 1.5, {
      opacity: 0,
      y: 20,
    })
    TweenLite.to(songsListEl, animationDuration, {
      x: movement,
      onComplete: () => {
        isAnimating = false;
        this.changeSong(direction)
      },
    });
  }

  changeSong(direction) {
    this.resetCurrentSong();
    const nextSongId = this.songs
      .find(song => song.index === this.playingSong.index + (direction === 'next' ? 1 : -1)).id;
    this.songs = this.songs.map(song => {
      const condition = song.id === nextSongId;
      return {...song, isPlaying: condition, isActive: condition };
    });
    this.setDuration();
    this.updateCurrent();
    this.playingSong.audio.play();
  }

  resetCurrentSong() {
    this.playingSong.audio.pause();
    this.playingSong.audio.currentTime = 0;
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
  get isControlDisabled() {
    return !this.playingSong.audio;
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
  startSongChange: action.bound,
  changeSong: action.bound,
  resetCurrentSong: action.bound,
  resetPlayer: action.bound,

  playingSong: computed,
  formattedCurrent: computed,
  formattedDuration: computed,
  barWidth: computed,
  isControlDisabled: computed,
});

const appStore = new AppStore();

export { appStore };
