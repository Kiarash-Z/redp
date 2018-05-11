import { decorate, observable, computed, action } from 'mobx';
var fs = window.require('fs');
var mm = window.require('musicmetadata');

class AppStore {
  songs = [];

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
          if (index === 0) {
            const audio = new Audio();
            audio.src = song.filePath;
            audio.play();
            song.isPlaying = true;
            song.isActive = true;
          }
          return song;
        });
      });
    });
  }

  get playingSong() {
    return this.songs.find(song => song.isActive) || {};
  }
}

decorate(AppStore, {
  songs : observable,

  openFile: action.bound,

  playingSong: computed,
});

const appStore = new AppStore();

export { appStore };
