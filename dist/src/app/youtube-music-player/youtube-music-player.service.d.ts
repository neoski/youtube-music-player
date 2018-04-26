import { BehaviorSubject } from 'rxjs/BehaviorSubject';
export declare class YoutubeMusicPlayerService {
    playlistSub: BehaviorSubject<string[]>;
    indexSub: BehaviorSubject<number>;
    errorSub: BehaviorSubject<number>;
    playSub: BehaviorSubject<boolean>;
    pauseSub: BehaviorSubject<boolean>;
    constructor();
    getErrorSub(): BehaviorSubject<number>;
    setError(data: number): void;
    setPlaylist(playlist: string[]): void;
    getPlaylistSub(): BehaviorSubject<string[]>;
    setIndex(index: number): void;
    getIndexSub(): BehaviorSubject<number>;
    getPlaySub(): BehaviorSubject<boolean>;
    getPauseSub(): BehaviorSubject<boolean>;
    play(): void;
    pause(): void;
    urlsToIds(playlist: string[]): string[];
}
