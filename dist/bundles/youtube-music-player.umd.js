(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs/BehaviorSubject')) :
	typeof define === 'function' && define.amd ? define('youtube-music-player', ['exports', '@angular/core', 'rxjs/BehaviorSubject'], factory) :
	(factory((global['youtube-music-player'] = {}),global.ng.core,global.Rx));
}(this, (function (exports,core,BehaviorSubject) { 'use strict';

var YoutubeMusicPlayerService = /** @class */ (function () {
    function YoutubeMusicPlayerService() {
        this.playlistSub = new BehaviorSubject.BehaviorSubject([]);
        this.indexSub = new BehaviorSubject.BehaviorSubject(0);
        this.errorSub = new BehaviorSubject.BehaviorSubject(0);
        this.playSub = new BehaviorSubject.BehaviorSubject(false);
        this.pauseSub = new BehaviorSubject.BehaviorSubject(false);
        this.readySub = new BehaviorSubject.BehaviorSubject(false);
        this.scriptLoaded = false;
    }
    YoutubeMusicPlayerService.prototype.getReadySub = function () {
        return this.readySub;
    };
    YoutubeMusicPlayerService.prototype.getErrorSub = function () {
        return this.errorSub;
    };
    YoutubeMusicPlayerService.prototype.setError = function (data) {
        this.errorSub.next(data);
    };
    YoutubeMusicPlayerService.prototype.setPlaylist = function (playlist) {
        this.playlistSub.next(playlist);
    };
    YoutubeMusicPlayerService.prototype.getPlaylistSub = function () {
        return this.playlistSub;
    };
    YoutubeMusicPlayerService.prototype.setIndex = function (index) {
        this.indexSub.next(index);
    };
    YoutubeMusicPlayerService.prototype.getIndexSub = function () {
        return this.indexSub;
    };
    YoutubeMusicPlayerService.prototype.getPlaySub = function () {
        return this.playSub;
    };
    YoutubeMusicPlayerService.prototype.getPauseSub = function () {
        return this.pauseSub;
    };
    YoutubeMusicPlayerService.prototype.play = function () {
        this.playSub.next(true);
    };
    YoutubeMusicPlayerService.prototype.pause = function () {
        this.pauseSub.next(true);
    };
    YoutubeMusicPlayerService.prototype.urlsToIds = function (playlist) {
        playlist.map(function (url, i) {
            var res = /\?v=([^\/|\?|\=]+)/.exec(url);
            if (res) {
                playlist[i] = res[1];
            }
        });
        return playlist;
    };
    YoutubeMusicPlayerService.prototype.isScriptLoaded = function () {
        return this.scriptLoaded;
    };
    YoutubeMusicPlayerService.prototype.scriptIsLoaded = function (value) {
        if (value === void 0) { value = (true); }
        this.scriptLoaded = true;
    };
    YoutubeMusicPlayerService.prototype.resetSubscribers = function () {
        this.playlistSub.unsubscribe();
        this.indexSub.unsubscribe();
        this.errorSub.unsubscribe();
        this.playSub.unsubscribe();
        this.pauseSub.unsubscribe();
        this.readySub.unsubscribe();
        this.playlistSub = new BehaviorSubject.BehaviorSubject([]);
        this.indexSub = new BehaviorSubject.BehaviorSubject(0);
        this.errorSub = new BehaviorSubject.BehaviorSubject(0);
        this.playSub = new BehaviorSubject.BehaviorSubject(false);
        this.pauseSub = new BehaviorSubject.BehaviorSubject(false);
        this.readySub = new BehaviorSubject.BehaviorSubject(false);
    };
    return YoutubeMusicPlayerService;
}());
YoutubeMusicPlayerService.decorators = [
    { type: core.Injectable },
];
YoutubeMusicPlayerService.ctorParameters = function () { return []; };
var YoutubeMusicPlayerComponent = /** @class */ (function () {
    function YoutubeMusicPlayerComponent(ympService) {
        this.ympService = ympService;
        this.player = (null);
        this.durationInterval = (null);
        this.playlist = ([]);
        this.autoplay = 0;
        this.index = 0;
        this.youtubeApiLink = 'https://www.youtube.com/iframe_api';
    }
    YoutubeMusicPlayerComponent.prototype.loadScript = function () {
        var node = document.createElement('script');
        node.src = this.youtubeApiLink;
        node.type = 'text/javascript';
        document.getElementsByTagName('head')[0].appendChild(node);
    };
    YoutubeMusicPlayerComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (!this.ympService.isScriptLoaded()) {
            this.loadScript();
            this.ympService.scriptIsLoaded();
            ((window)).onYouTubeIframeAPIReady = function () {
                _this.createPlayer();
            };
        }
        else {
            this.createPlayer();
        }
    };
    YoutubeMusicPlayerComponent.prototype.createPlayer = function () {
        var _this = this;
        this.player = new YT.Player('youtubeVideo', {
            height: '0',
            width: '0',
            playerVars: { 'autoplay': 1, 'controls': 0, 'autohide': 0 },
            events: {
                'onReady': function () {
                    _this.player.setVolume(50);
                    if (_this.index !== 0) {
                        _this.ympService.setIndex(_this.index);
                    }
                    _this.ympService.getIndexSub().subscribe(function (index) {
                        _this.index = index;
                        if (_this.player.getPlayerState() !== 5) {
                            _this.startNewVideo();
                        }
                    });
                    if (_this.playlist !== []) {
                        _this.ympService.setPlaylist(_this.playlist);
                    }
                    _this.ympService.getPlaylistSub().subscribe(function (playlist) {
                        _this.playlist = playlist;
                        if (!_this.autoplay) {
                            _this.showButtonsAfterLoad(true);
                        }
                        else {
                            _this.startNewVideo();
                        }
                    });
                    _this.ympService.getPlaySub().subscribe(function (val) {
                        if (val && _this.player) {
                            _this.playVideo();
                        }
                    });
                    _this.ympService.getPauseSub().subscribe(function (val) {
                        if (val) {
                            _this.pauseVideo();
                        }
                    });
                    _this.ympService.getReadySub().next(true);
                },
                'onStateChange': function (e) {
                    if (e.data === 0) {
                        _this.nextSong();
                    }
                    if (e.data === 1) {
                        var videoData = _this.player.getVideoData();
                        _this.ympTitle.nativeElement.innerHTML =
                            (videoData.title.length > 30 ? videoData.title.substr(0, 27) + '...' : videoData.title);
                        _this.showButtonsAfterLoad();
                    }
                    if (e.data === 2) {
                        _this.showButtonsAfterLoad(true);
                    }
                },
                'onError': function (e) {
                    _this.ympLoading.nativeElement.className = 'hidden';
                    _this.ympError.nativeElement.className = '';
                    _this.ympError.nativeElement.innerHTML =
                        ('Error at loading video (index ' +
                            _this.index + ')');
                    _this.ympService.setError(e.data);
                }
            }
        });
    };
    YoutubeMusicPlayerComponent.prototype.setVolume = function () {
        this.player.setVolume(this.soundBar.nativeElement.value);
    };
    YoutubeMusicPlayerComponent.prototype.nextSong = function () {
        this.index = (this.index >= this.playlist.length - 1 ? 0 : this.index + 1);
        this.ympTitle.nativeElement.innerHTML = '';
        this.hideButtonsForLoad();
        this.player.loadVideoById(this.playlist[this.index]);
    };
    YoutubeMusicPlayerComponent.prototype.previousSong = function () {
        this.index = (this.index <= 0 ? this.playlist.length - 1 : this.index - 1);
        this.ympTitle.nativeElement.innerHTML = '';
        this.hideButtonsForLoad();
        this.player.loadVideoById(this.playlist[this.index]);
    };
    YoutubeMusicPlayerComponent.prototype.updateTime = function (current, total) {
        var currentMin = Math.floor(current / 60);
        var currentSec = Math.floor(current % 60);
        var totalMin = Math.floor(total / 60);
        var totalSec = Math.floor(total % 60);
        this.ympTime.nativeElement.innerHTML =
            (currentMin < 10 ? '0' + currentMin : currentMin) + ':' +
                (currentSec < 10 ? '0' + currentSec : currentSec) + '|' +
                (totalMin < 10 ? '0' + totalMin : totalMin) + ':' +
                (totalSec < 10 ? '0' + totalSec : totalSec);
    };
    YoutubeMusicPlayerComponent.prototype.updateBar = function () {
        var currentTime = this.player.getCurrentTime();
        this.duration = this.player.getDuration();
        var buffered = this.player.getVideoLoadedFraction();
        this.updateTime(currentTime, this.duration);
        this.ympProgress.nativeElement.style.left = ((currentTime * 100) / this.duration) + '%';
        this.ympBuffered.nativeElement.style.width = buffered * 100 + '%';
    };
    YoutubeMusicPlayerComponent.prototype.changePosition = function (e) {
        var positionleft = (e.offsetX * 100) / this.ympBar.nativeElement.offsetWidth;
        this.player.seekTo((positionleft * this.duration) / 100, true);
        this.updateBar();
    };
    YoutubeMusicPlayerComponent.prototype.startNewVideo = function () {
        this.ympError.nativeElement.className = 'hidden';
        this.hideButtonsForLoad();
        this.player.loadVideoById(this.playlist[this.index]);
    };
    YoutubeMusicPlayerComponent.prototype.playVideo = function () {
        if (this.player.getPlayerState() === 2) {
            this.player.playVideo();
        }
        else if (this.player) {
            this.startNewVideo();
        }
    };
    YoutubeMusicPlayerComponent.prototype.pauseVideo = function () {
        this.player.pauseVideo();
    };
    YoutubeMusicPlayerComponent.prototype.hideButtonsForLoad = function () {
        this.buttonPlay.nativeElement.className = 'hidden';
        this.buttonPause.nativeElement.className = 'hidden';
        this.ympPrevious.nativeElement.className = 'hidden';
        this.ympNext.nativeElement.className = 'hidden';
        this.ympLoading.nativeElement.className = '';
        if (this.durationInterval) {
            clearInterval(this.durationInterval);
            this.durationInterval = false;
        }
    };
    YoutubeMusicPlayerComponent.prototype.showButtonsAfterLoad = function (pause) {
        var _this = this;
        if (pause === void 0) { pause = false; }
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
            this.durationInterval = setInterval(function () { return _this.updateBar(); }, 100);
        }
    };
    YoutubeMusicPlayerComponent.prototype.ngOnDestroy = function () {
        this.player.destroy();
        this.ympService.resetSubscribers();
        if (this.durationInterval) {
            clearInterval(this.durationInterval);
            this.durationInterval = null;
        }
    };
    return YoutubeMusicPlayerComponent;
}());
YoutubeMusicPlayerComponent.decorators = [
    { type: core.Component, args: [{
                selector: 'app-youtube-music-player',
                template: "<div id=\"ymp\" #ymp>\n  <div id=\"ympLeftPart\">\n    <div id=\"ympPrevious\" class=\"hidden\" #ympPrevious (click)=\"previousSong()\">\u21A9</div>\n    <div id=\"ympLoading\" #ympLoading>\n      ...\n    </div>\n    <div id=\"ympPlay\">\n      <div id=\"buttonPause\" class=\"hidden\" (click)=\"pauseVideo()\" #buttonPause>\u25FC</div>\n      <div id=\"buttonPlay\" class=\"hidden\" (click)=\"playVideo()\" #buttonPlay>\u25B6</div>\n    </div>\n    <div id=\"ympNext\" class=\"hidden\" #ympNext (click)=\"nextSong()\">\u21AA</div>\n    <div id=\"ympTitle\" #ympTitle></div>\n    <div id=\"ympError\" class=\"hidden\" #ympError></div>\n  </div>\n  <div id=\"ympBar\" #ympBar (click)=\"changePosition($event)\">\n      <div id=\"ympProgress\" #ympProgress></div>\n      <div id=\"ympBuffered\" #ympBuffered></div>\n  </div>\n  <div id=\"ympRightPart\">\n      <div id=\"ympTime\" #ympTime>00:00|00:00</div>\n      <input type=\"range\" id=\"soundBar\" #soundBar (change)=setVolume()/>\n      <div class=\"hidden\" id=\"youtubeVideo\"></div>\n  </div>\n</div>\n",
                styles: ["div#ymp .hidden{visibility:hidden;display:none!important}div#ymp{font-family:\"Trebuchet MS\",Helvetica,sans-serif;width:100%;height:17px;background-color:#000;color:#fff;line-height:14px;font-size:10px;padding-bottom:4px;display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex}div#ymp div#ympNext,div#ymp div#ympPrevious{position:relative;top:2px;font-size:12px;cursor:pointer;font-weight:700;padding-left:4px}div#ympLeftPart{padding-top:3px;padding-left:2px;display:-webkit-box;display:-ms-flexbox;display:flex}div#ympRightPart{padding-left:10px;padding-right:10px;float:right;display:-webkit-box;display:-ms-flexbox;display:flex}div#ymp #ympPlay div{font-size:10px;position:relative;top:0;cursor:pointer;padding-top:1px}div#ymp #ympPlay{margin-left:5px;display:inline-block;width:9px}div#ymp #ympLoading{position:relative;top:2px;left:14px}div#ymp #ympLoading img{height:15px;width:15px}div#ymp div#ympError,div#ymp div#ympTitle{margin-left:5px;margin-right:5px;margin-top:1px;display:inline-block;white-space:nowrap}div#ympBar{position:relative;width:100%;border:1px solid #fff;height:5px;background-color:#333;overflow:hidden;margin-top:6.5px;display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex}div#ymp div.ympBuffered{z-index:1;position:absolute;background-color:#666;width:0%;height:5px}div#ymp #ympProgress{z-index:2;position:absolute;width:2px;height:4px;border:1px solid #fff;background-color:#fff}div#ymp #soundBar{z-index:1;position:relative;display:inline-block;width:100px;background-color:#000;overflow:hidden;top:2px;margin-left:5px}div#ymp #soundValue{z-index:2;left:50%;position:absolute;width:3px;height:4px;border:1px solid #fff;border-radius:50%;background-color:#fff}div#ymp div#ympTime{padding-top:4px;padding-right:4px}"]
            },] },
];
YoutubeMusicPlayerComponent.ctorParameters = function () { return [
    { type: YoutubeMusicPlayerService, },
]; };
YoutubeMusicPlayerComponent.propDecorators = {
    "ymp": [{ type: core.ViewChild, args: ['ymp',] },],
    "buttonPlay": [{ type: core.ViewChild, args: ['buttonPlay',] },],
    "buttonPause": [{ type: core.ViewChild, args: ['buttonPause',] },],
    "ympBar": [{ type: core.ViewChild, args: ['ympBar',] },],
    "soundBar": [{ type: core.ViewChild, args: ['soundBar',] },],
    "ympProgress": [{ type: core.ViewChild, args: ['ympProgress',] },],
    "ympBuffered": [{ type: core.ViewChild, args: ['ympBuffered',] },],
    "ympTime": [{ type: core.ViewChild, args: ['ympTime',] },],
    "ympPrevious": [{ type: core.ViewChild, args: ['ympPrevious',] },],
    "ympNext": [{ type: core.ViewChild, args: ['ympNext',] },],
    "ympLoading": [{ type: core.ViewChild, args: ['ympLoading',] },],
    "ympTitle": [{ type: core.ViewChild, args: ['ympTitle',] },],
    "ympError": [{ type: core.ViewChild, args: ['ympError',] },],
    "playlist": [{ type: core.Input },],
    "autoplay": [{ type: core.Input },],
    "index": [{ type: core.Input },],
    "youtubeApiLink": [{ type: core.Input },],
};
var YoutubeMusicPlayerModule = /** @class */ (function () {
    function YoutubeMusicPlayerModule() {
    }
    return YoutubeMusicPlayerModule;
}());
YoutubeMusicPlayerModule.decorators = [
    { type: core.NgModule, args: [{
                declarations: [YoutubeMusicPlayerComponent],
                exports: [YoutubeMusicPlayerComponent],
                providers: [YoutubeMusicPlayerService]
            },] },
];

exports.YoutubeMusicPlayerModule = YoutubeMusicPlayerModule;
exports.YoutubeMusicPlayerService = YoutubeMusicPlayerService;
exports.ɵa = YoutubeMusicPlayerComponent;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=youtube-music-player.umd.js.map
