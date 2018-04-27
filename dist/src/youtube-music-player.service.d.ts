import { BehaviorSubject } from 'rxjs/BehaviorSubject';
export declare class YoutubeMusicPlayerService {
    private playlistSub;
    private indexSub;
    private errorSub;
    private playSub;
    private pauseSub;
    private readySub;
    private scriptLoaded;
    constructor();
    getReadySub(): BehaviorSubject<boolean>;
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
    isScriptLoaded(): boolean;
    scriptIsLoaded(value?: boolean): void;
    resetSubscribers(): void;
}
