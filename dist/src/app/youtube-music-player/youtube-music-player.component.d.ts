import { OnInit, ElementRef } from '@angular/core';
import { YoutubeMusicPlayerService } from './youtube-music-player.service';
export declare class YoutubeMusicPlayerComponent implements OnInit {
    private ympService;
    ymp: ElementRef;
    buttonPlay: ElementRef;
    buttonPause: ElementRef;
    ympBar: ElementRef;
    soundBar: ElementRef;
    ympProgress: ElementRef;
    ympBuffered: ElementRef;
    ympTime: ElementRef;
    ympPrevious: ElementRef;
    ympNext: ElementRef;
    ympLoading: ElementRef;
    ympTitle: ElementRef;
    ympError: ElementRef;
    player: any;
    duration: number;
    durationInterval: any;
    playlist: string[];
    autoplay: number;
    index: number;
    constructor(ympService: YoutubeMusicPlayerService);
    ngOnInit(): void;
    ngOnDestroy(): void;
    setVolume(): void;
    nextSong(): void;
    previousSong(): void;
    updateTime(current: number, total: number): void;
    updateBar(): void;
    changePosition($event: any): void;
    startNewVideo(): void;
    playVideo(): void;
    pauseVideo(): void;
    hideButtonsForLoad(): void;
    showButtonsAfterLoad(pause?: boolean): void;
}
