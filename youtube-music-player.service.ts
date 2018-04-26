import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class YoutubeMusicPlayerService {

  public playlistSub = new BehaviorSubject<Array<string>>([]);
  public indexSub = new BehaviorSubject<number>(0);
  public errorSub = new BehaviorSubject<number>(0);
  public playSub = new BehaviorSubject<boolean>(false);
  public pauseSub = new BehaviorSubject<boolean>(false);
  constructor() { }


  public getErrorSub() {
    return this.errorSub;
  }

  public setError(data: number) {
    this.errorSub.next(data);
  }

  public setPlaylist(playlist: string[]) {
    this.playlistSub.next(playlist);
  }

  public getPlaylistSub() {
    return this.playlistSub;
  }

  public setIndex(index: number) {
    this.indexSub.next(index);
  }

  public getIndexSub() {
    return this.indexSub;
  }

  public getPlaySub() {
    return this.playSub;
  }

  public getPauseSub() {
    return this.pauseSub;
  }

  public play() {
    this.playSub.next(true);
  }

  public pause() {
    this.pauseSub.next(true);
  }

  public urlsToIds(playlist: string[]) {
    playlist.map((url, i) => {
      const res = /\?v=([^\/|\?|\=]+)/.exec(url);
      if (res) {
        playlist[i] = res[1];
      }
    });
    return playlist;
  }
}
