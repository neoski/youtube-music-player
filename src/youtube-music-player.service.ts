import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class YoutubeMusicPlayerService {

  private playlistSub = new BehaviorSubject<Array<string>>([]);
  private indexSub = new BehaviorSubject<number>(0);
  private errorSub = new BehaviorSubject<number>(0);
  private playSub = new BehaviorSubject<boolean>(false);
  private pauseSub = new BehaviorSubject<boolean>(false);
  private readySub = new BehaviorSubject<boolean>(false);
  private scriptLoaded = false;
  constructor() { }

  public getReadySub() {
    return this.readySub;
  }

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

  public isScriptLoaded() {
    return this.scriptLoaded;
  }

  public scriptIsLoaded(value = true as boolean) {
    this.scriptLoaded = true;
  }

  public resetSubscribers() {
    this.playlistSub.unsubscribe();
    this.indexSub.unsubscribe();
    this.errorSub.unsubscribe();
    this.playSub.unsubscribe();
    this.pauseSub.unsubscribe();
    this.readySub.unsubscribe();
    this.playlistSub = new BehaviorSubject<Array<string>>([]);
    this.indexSub = new BehaviorSubject<number>(0);
    this.errorSub = new BehaviorSubject<number>(0);
    this.playSub = new BehaviorSubject<boolean>(false);
    this.pauseSub = new BehaviorSubject<boolean>(false);
    this.readySub = new BehaviorSubject<boolean>(false);
  }
}
