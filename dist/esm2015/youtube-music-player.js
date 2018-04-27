import { Injectable, Component, ViewChild, Input, NgModule } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class YoutubeMusicPlayerService {
    constructor() {
        this.playlistSub = new BehaviorSubject([]);
        this.indexSub = new BehaviorSubject(0);
        this.errorSub = new BehaviorSubject(0);
        this.playSub = new BehaviorSubject(false);
        this.pauseSub = new BehaviorSubject(false);
        this.readySub = new BehaviorSubject(false);
        this.scriptLoaded = false;
    }
    /**
     * @return {?}
     */
    getReadySub() {
        return this.readySub;
    }
    /**
     * @return {?}
     */
    getErrorSub() {
        return this.errorSub;
    }
    /**
     * @param {?} data
     * @return {?}
     */
    setError(data) {
        this.errorSub.next(data);
    }
    /**
     * @param {?} playlist
     * @return {?}
     */
    setPlaylist(playlist) {
        this.playlistSub.next(playlist);
    }
    /**
     * @return {?}
     */
    getPlaylistSub() {
        return this.playlistSub;
    }
    /**
     * @param {?} index
     * @return {?}
     */
    setIndex(index) {
        this.indexSub.next(index);
    }
    /**
     * @return {?}
     */
    getIndexSub() {
        return this.indexSub;
    }
    /**
     * @return {?}
     */
    getPlaySub() {
        return this.playSub;
    }
    /**
     * @return {?}
     */
    getPauseSub() {
        return this.pauseSub;
    }
    /**
     * @return {?}
     */
    play() {
        this.playSub.next(true);
    }
    /**
     * @return {?}
     */
    pause() {
        this.pauseSub.next(true);
    }
    /**
     * @param {?} playlist
     * @return {?}
     */
    urlsToIds(playlist) {
        playlist.map((url, i) => {
            const /** @type {?} */ res = /\?v=([^\/|\?|\=]+)/.exec(url);
            if (res) {
                playlist[i] = res[1];
            }
        });
        return playlist;
    }
    /**
     * @return {?}
     */
    isScriptLoaded() {
        return this.scriptLoaded;
    }
    /**
     * @param {?=} value
     * @return {?}
     */
    scriptIsLoaded(value = /** @type {?} */ (true)) {
        this.scriptLoaded = true;
    }
    /**
     * @return {?}
     */
    resetSubscribers() {
        this.playlistSub.unsubscribe();
        this.indexSub.unsubscribe();
        this.errorSub.unsubscribe();
        this.playSub.unsubscribe();
        this.pauseSub.unsubscribe();
        this.readySub.unsubscribe();
        this.playlistSub = new BehaviorSubject([]);
        this.indexSub = new BehaviorSubject(0);
        this.errorSub = new BehaviorSubject(0);
        this.playSub = new BehaviorSubject(false);
        this.pauseSub = new BehaviorSubject(false);
        this.readySub = new BehaviorSubject(false);
    }
}
YoutubeMusicPlayerService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
YoutubeMusicPlayerService.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class YoutubeMusicPlayerComponent {
    /**
     * @param {?} ympService
     */
    constructor(ympService) {
        this.ympService = ympService;
        this.player = /** @type {?} */ (null);
        this.durationInterval = /** @type {?} */ (null);
        this.playlist = /** @type {?} */ ([]);
        this.autoplay = 0;
        this.index = 0;
        this.youtubeApiLink = 'https://www.youtube.com/iframe_api';
    }
    /**
     * @return {?}
     */
    loadScript() {
        const /** @type {?} */ node = document.createElement('script');
        node.src = this.youtubeApiLink;
        node.type = 'text/javascript';
        document.getElementsByTagName('head')[0].appendChild(node);
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (!this.ympService.isScriptLoaded()) {
            // load script once
            this.loadScript();
            this.ympService.scriptIsLoaded();
            (/** @type {?} */ (window)).onYouTubeIframeAPIReady = () => {
                this.createPlayer();
            };
        }
        else {
            this.createPlayer();
        }
    }
    /**
     * @return {?}
     */
    createPlayer() {
        this.player = new YT.Player('youtubeVideo', {
            height: '0',
            width: '0',
            playerVars: { 'autoplay': 1, 'controls': 0, 'autohide': 0 },
            events: {
                'onReady': () => {
                    this.player.setVolume(50);
                    if (this.index !== 0) {
                        this.ympService.setIndex(this.index);
                    }
                    this.ympService.getIndexSub().subscribe((index) => {
                        this.index = index;
                        if (this.player.getPlayerState() !== 5) {
                            // if player has been launched
                            this.startNewVideo(); // start at new index
                        }
                    });
                    if (this.playlist !== []) {
                        this.ympService.setPlaylist(this.playlist);
                    }
                    this.ympService.getPlaylistSub().subscribe((playlist) => {
                        this.playlist = playlist;
                        if (!this.autoplay) {
                            this.showButtonsAfterLoad(true);
                        }
                        else {
                            this.startNewVideo();
                        }
                    });
                    this.ympService.getPlaySub().subscribe((val) => {
                        if (val && this.player) {
                            this.playVideo();
                        }
                    });
                    this.ympService.getPauseSub().subscribe((val) => {
                        if (val) {
                            this.pauseVideo();
                        }
                    });
                    this.ympService.getReadySub().next(true);
                },
                'onStateChange': (e) => {
                    if (e.data === 0) {
                        // if video finished
                        this.nextSong();
                    }
                    if (e.data === 1) {
                        // if video just started or played after pause
                        const /** @type {?} */ videoData = this.player.getVideoData();
                        this.ympTitle.nativeElement.innerHTML =
                            (videoData.title.length > 30 ? videoData.title.substr(0, 27) + '...' : videoData.title);
                        this.showButtonsAfterLoad();
                    }
                    if (e.data === 2) {
                        this.showButtonsAfterLoad(true);
                    }
                },
                'onError': (e) => {
                    this.ympLoading.nativeElement.className = 'hidden';
                    this.ympError.nativeElement.className = '';
                    this.ympError.nativeElement.innerHTML =
                        ('Error at loading video (index ' +
                            this.index + ')');
                    this.ympService.setError(e.data);
                }
            }
        });
    }
    /**
     * @return {?}
     */
    setVolume() {
        this.player.setVolume(this.soundBar.nativeElement.value);
    }
    /**
     * @return {?}
     */
    nextSong() {
        this.index = (this.index >= this.playlist.length - 1 ? 0 : this.index + 1);
        this.ympTitle.nativeElement.innerHTML = '';
        this.hideButtonsForLoad();
        this.player.loadVideoById(this.playlist[this.index]);
    }
    /**
     * @return {?}
     */
    previousSong() {
        this.index = (this.index <= 0 ? this.playlist.length - 1 : this.index - 1);
        this.ympTitle.nativeElement.innerHTML = '';
        this.hideButtonsForLoad();
        this.player.loadVideoById(this.playlist[this.index]);
    }
    /**
     * @param {?} current
     * @param {?} total
     * @return {?}
     */
    updateTime(current, total) {
        const /** @type {?} */ currentMin = Math.floor(current / 60);
        const /** @type {?} */ currentSec = Math.floor(current % 60);
        const /** @type {?} */ totalMin = Math.floor(total / 60);
        const /** @type {?} */ totalSec = Math.floor(total % 60);
        this.ympTime.nativeElement.innerHTML =
            (currentMin < 10 ? '0' + currentMin : currentMin) + ':' +
                (currentSec < 10 ? '0' + currentSec : currentSec) + '|' +
                (totalMin < 10 ? '0' + totalMin : totalMin) + ':' +
                (totalSec < 10 ? '0' + totalSec : totalSec);
    }
    /**
     * @return {?}
     */
    updateBar() {
        const /** @type {?} */ currentTime = this.player.getCurrentTime();
        this.duration = this.player.getDuration();
        const /** @type {?} */ buffered = this.player.getVideoLoadedFraction();
        this.updateTime(currentTime, this.duration);
        this.ympProgress.nativeElement.style.left = ((currentTime * 100) / this.duration) + '%';
        this.ympBuffered.nativeElement.style.width = buffered * 100 + '%';
    }
    /**
     * @param {?} e
     * @return {?}
     */
    changePosition(e) {
        const /** @type {?} */ positionleft = (e.offsetX * 100) / this.ympBar.nativeElement.offsetWidth;
        this.player.seekTo((positionleft * this.duration) / 100, true);
        this.updateBar();
    }
    /**
     * @return {?}
     */
    startNewVideo() {
        this.ympError.nativeElement.className = 'hidden';
        this.hideButtonsForLoad();
        this.player.loadVideoById(this.playlist[this.index]);
    }
    /**
     * @return {?}
     */
    playVideo() {
        if (this.player.getPlayerState() === 2) {
            //if paused
            this.player.playVideo();
        }
        else if (this.player) {
            this.startNewVideo();
        }
    }
    /**
     * @return {?}
     */
    pauseVideo() {
        this.player.pauseVideo();
    }
    /**
     * @return {?}
     */
    hideButtonsForLoad() {
        this.buttonPlay.nativeElement.className = 'hidden';
        this.buttonPause.nativeElement.className = 'hidden';
        this.ympPrevious.nativeElement.className = 'hidden';
        this.ympNext.nativeElement.className = 'hidden';
        this.ympLoading.nativeElement.className = '';
        if (this.durationInterval) {
            clearInterval(this.durationInterval);
            this.durationInterval = false;
        }
    }
    /**
     * @param {?=} pause
     * @return {?}
     */
    showButtonsAfterLoad(pause = false) {
        if (pause) {
            this.buttonPause.nativeElement.className = 'hidden';
            this.buttonPlay.nativeElement.className = '';
        }
        else {
            this.buttonPause.nativeElement.className = '';
            this.buttonPlay.nativeElement.className = 'hidden';
        }
        this.ympLoading.nativeElement.className = 'hidden';
        this.ympPrevious.nativeElement.className = '';
        this.ympNext.nativeElement.className = '';
        if (!this.durationInterval) {
            this.durationInterval = setInterval(() => this.updateBar(), 100);
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.player.destroy();
        this.ympService.resetSubscribers();
        if (this.durationInterval) {
            clearInterval(this.durationInterval);
            this.durationInterval = null;
        }
    }
}
YoutubeMusicPlayerComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-youtube-music-player',
                template: `<div id="ymp" #ymp>
  <div id="ympLeftPart">
    <div id="ympPrevious" class="hidden" #ympPrevious (click)="previousSong()">↩</div>
    <div id="ympLoading" #ympLoading>
      ...
    </div>
    <div id="ympPlay">
      <div id="buttonPause" class="hidden" (click)="pauseVideo()" #buttonPause>◼</div>
      <div id="buttonPlay" class="hidden" (click)="playVideo()" #buttonPlay>▶</div>
    </div>
    <div id="ympNext" class="hidden" #ympNext (click)="nextSong()">↪</div>
    <div id="ympTitle" #ympTitle></div>
    <div id="ympError" class="hidden" #ympError></div>
  </div>
  <div id="ympBar" #ympBar (click)="changePosition($event)">
      <div id="ympProgress" #ympProgress></div>
      <div id="ympBuffered" #ympBuffered></div>
  </div>
  <div id="ympRightPart">
      <div id="ympTime" #ympTime>00:00|00:00</div>
      <input type="range" id="soundBar" #soundBar (change)=setVolume()/>
      <div class="hidden" id="youtubeVideo"></div>
  </div>
</div>
`,
                styles: [`div#ymp .hidden{visibility:hidden;display:none!important}div#ymp{font-family:"Trebuchet MS",Helvetica,sans-serif;width:100%;height:17px;background-color:#000;color:#fff;line-height:14px;font-size:10px;padding-bottom:4px;display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex}div#ymp div#ympNext,div#ymp div#ympPrevious{position:relative;top:2px;font-size:12px;cursor:pointer;font-weight:700;padding-left:4px}div#ympLeftPart{padding-top:3px;padding-left:2px;display:-webkit-box;display:-ms-flexbox;display:flex}div#ympRightPart{padding-left:10px;padding-right:10px;float:right;display:-webkit-box;display:-ms-flexbox;display:flex}div#ymp #ympPlay div{font-size:10px;position:relative;top:0;cursor:pointer;padding-top:1px}div#ymp #ympPlay{margin-left:5px;display:inline-block;width:9px}div#ymp #ympLoading{position:relative;top:2px;left:14px}div#ymp #ympLoading img{height:15px;width:15px}div#ymp div#ympError,div#ymp div#ympTitle{margin-left:5px;margin-right:5px;margin-top:1px;display:inline-block;white-space:nowrap}div#ympBar{position:relative;width:100%;border:1px solid #fff;height:5px;background-color:#333;overflow:hidden;margin-top:6.5px;display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex}div#ymp div.ympBuffered{z-index:1;position:absolute;background-color:#666;width:0%;height:5px}div#ymp #ympProgress{z-index:2;position:absolute;width:2px;height:4px;border:1px solid #fff;background-color:#fff}div#ymp #soundBar{z-index:1;position:relative;display:inline-block;width:100px;background-color:#000;overflow:hidden;top:2px;margin-left:5px}div#ymp #soundValue{z-index:2;left:50%;position:absolute;width:3px;height:4px;border:1px solid #fff;border-radius:50%;background-color:#fff}div#ymp div#ympTime{padding-top:4px;padding-right:4px}`]
            },] },
];
/** @nocollapse */
YoutubeMusicPlayerComponent.ctorParameters = () => [
    { type: YoutubeMusicPlayerService, },
];
YoutubeMusicPlayerComponent.propDecorators = {
    "ymp": [{ type: ViewChild, args: ['ymp',] },],
    "buttonPlay": [{ type: ViewChild, args: ['buttonPlay',] },],
    "buttonPause": [{ type: ViewChild, args: ['buttonPause',] },],
    "ympBar": [{ type: ViewChild, args: ['ympBar',] },],
    "soundBar": [{ type: ViewChild, args: ['soundBar',] },],
    "ympProgress": [{ type: ViewChild, args: ['ympProgress',] },],
    "ympBuffered": [{ type: ViewChild, args: ['ympBuffered',] },],
    "ympTime": [{ type: ViewChild, args: ['ympTime',] },],
    "ympPrevious": [{ type: ViewChild, args: ['ympPrevious',] },],
    "ympNext": [{ type: ViewChild, args: ['ympNext',] },],
    "ympLoading": [{ type: ViewChild, args: ['ympLoading',] },],
    "ympTitle": [{ type: ViewChild, args: ['ympTitle',] },],
    "ympError": [{ type: ViewChild, args: ['ympError',] },],
    "playlist": [{ type: Input },],
    "autoplay": [{ type: Input },],
    "index": [{ type: Input },],
    "youtubeApiLink": [{ type: Input },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class YoutubeMusicPlayerModule {
}
YoutubeMusicPlayerModule.decorators = [
    { type: NgModule, args: [{
                declarations: [YoutubeMusicPlayerComponent],
                exports: [YoutubeMusicPlayerComponent],
                providers: [YoutubeMusicPlayerService]
            },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { YoutubeMusicPlayerModule, YoutubeMusicPlayerService, YoutubeMusicPlayerComponent as ɵa };
//# sourceMappingURL=youtube-music-player.js.map
