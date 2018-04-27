import { AfterViewInit, Component, OnInit, OnDestroy, ElementRef, ViewChild, Input} from '@angular/core';
import { YoutubeMusicPlayerService } from './youtube-music-player.service';

declare var YT: any; //coming from youtube script file

@Component({
  selector: 'app-youtube-music-player',
  templateUrl: './youtube-music-player.component.html',
  styleUrls: ['./youtube-music-player.component.css']
})

export class YoutubeMusicPlayerComponent implements OnInit {
  @ViewChild('ymp') ymp: ElementRef;
  @ViewChild('buttonPlay') buttonPlay: ElementRef;
  @ViewChild('buttonPause') buttonPause: ElementRef;
  @ViewChild('ympBar') ympBar: ElementRef;
  @ViewChild('soundBar') soundBar: ElementRef;
  @ViewChild('ympProgress') ympProgress: ElementRef;
  @ViewChild('ympBuffered') ympBuffered: ElementRef;
  @ViewChild('ympTime') ympTime: ElementRef;
  @ViewChild('ympPrevious') ympPrevious: ElementRef;
  @ViewChild('ympNext') ympNext: ElementRef;
  @ViewChild('ympLoading') ympLoading: ElementRef;
  @ViewChild('ympTitle') ympTitle: ElementRef;
  @ViewChild('ympError') ympError: ElementRef;
  player = null as any;
  duration: number;
  durationInterval = null as any;
  @Input() playlist = [] as string[];
  @Input() autoplay = 0;
  @Input() index = 0;
  @Input() youtubeApiLink = 'https://www.youtube.com/iframe_api';

  constructor(private ympService: YoutubeMusicPlayerService) {
  }

  loadScript() {
    const node = document.createElement('script');
    node.src = this.youtubeApiLink;
    node.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(node);
  }

  ngOnInit() {
    if (!this.ympService.isScriptLoaded()) { // load script once
      this.loadScript();
      this.ympService.scriptIsLoaded();
      (window as any).onYouTubeIframeAPIReady = () => {
          this.createPlayer();
        };
      } else {
        this.createPlayer();
      }
  }

  createPlayer () {
    this.player = new YT.Player('youtubeVideo', {
      height: '0',
      width: '0',
      playerVars: { 'autoplay': 1, 'controls': 0, 'autohide': 0},
      events: {
        'onReady': () => {
          this.player.setVolume(50);
          if (this.index !== 0) {
            this.ympService.setIndex(this.index);
          }
          this.ympService.getIndexSub().subscribe((index) => {
            this.index = index;
            if (this.player.getPlayerState() !== 5) { // if player has been launched
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
            } else {
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
        'onStateChange': (e: any) => {
          if (e.data === 0) { // if video finished
            this.nextSong();
          }
          if (e.data === 1) { // if video just started or played after pause
            const videoData = this.player.getVideoData();
            this.ympTitle.nativeElement.innerHTML =
            (videoData.title.length > 30 ? videoData.title.substr(0, 27) + '...' : videoData.title);
            this.showButtonsAfterLoad();
          }
          if (e.data === 2) {
            this.showButtonsAfterLoad(true);
          }
        },
        'onError': (e: any) => {
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

  setVolume() {
    this.player.setVolume(this.soundBar.nativeElement.value);
  }

  nextSong() {
    this.index = (this.index >= this.playlist.length - 1 ? 0 : this.index + 1);
    this.ympTitle.nativeElement.innerHTML = '';
    this.hideButtonsForLoad();
    this.player.loadVideoById(this.playlist[this.index]);
  }

  previousSong() {
    this.index = (this.index <= 0 ? this.playlist.length - 1 : this.index - 1);
    this.ympTitle.nativeElement.innerHTML = '';
    this.hideButtonsForLoad();
    this.player.loadVideoById(this.playlist[this.index]);
  }

  updateTime(current:number, total:number) {
    const currentMin = Math.floor(current / 60);
    const currentSec = Math.floor(current % 60);
    const totalMin = Math.floor(total / 60);
    const totalSec = Math.floor(total % 60);
    this.ympTime.nativeElement.innerHTML = 
    (currentMin < 10 ? '0' + currentMin : currentMin) + ':' +
    (currentSec < 10 ? '0' + currentSec : currentSec) + '|' +
    (totalMin < 10 ? '0' + totalMin : totalMin) + ':' +
    (totalSec < 10 ? '0' + totalSec : totalSec);
  }

  updateBar () {
    const currentTime = this.player.getCurrentTime();
    this.duration = this.player.getDuration();
    const buffered = this.player.getVideoLoadedFraction();
    this.updateTime(currentTime, this.duration);
    this.ympProgress.nativeElement.style.left = ((currentTime * 100) / this.duration) + '%';
    this.ympBuffered.nativeElement.style.width = buffered * 100 + '%';
  }

  changePosition(e: any) {
      const positionleft = (e.offsetX * 100) / this.ympBar.nativeElement.offsetWidth;
      this.player.seekTo((positionleft * this.duration) / 100, true);
      this.updateBar();
  }

  startNewVideo() {
    this.ympError.nativeElement.className = 'hidden';
    this.hideButtonsForLoad();
    this.player.loadVideoById(this.playlist[this.index]);
  }

  playVideo() {
    if (this.player.getPlayerState() === 2) { //if paused
      this.player.playVideo();
    } else if (this.player) {
      this.startNewVideo();
    }
  }

  pauseVideo() {
    this.player.pauseVideo();
  }

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

  showButtonsAfterLoad (pause = false) {
    if (pause) {
      this.buttonPause.nativeElement.className = 'hidden';
      this.buttonPlay.nativeElement.className = '';
    } else {
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

  ngOnDestroy() {
    this.player.destroy();
    this.ympService.resetSubscribers();
    if (this.durationInterval) {
      clearInterval(this.durationInterval);
      this.durationInterval = null;
    }
  }

}
