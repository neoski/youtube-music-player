# youtube-music-player
Angular5 module. Create a music player with youtube links and control it.

**Usage :**

1. Add youtube API `<script src="https://www.youtube.com/iframe_api"></script>` in your `index.html`.

2. Run `npm install youtube-music-player --save` in the root of your application

3. `import { YoutubeMusicPlayerModule } from 'youtube-music-player';` in your module

4. Add it to the imports of NgModule : `@NgModule({[...], imports: [[...], YoutubeMusicPlayerModule], [...]})`

5. Integrate the youtube music player `<app-youtube-music-player [playlist]="myPlaylist"></app-youtube-music-player>` in your HTML

**To use the Service :**

1. `import { YoutubeMusicPlayerService } from 'youtube-music-player';` in your component using it

2. Assign the service in your component : `constructor([...], private ympService: YoutubeMusicPlayerService) [...]`

3. You can now interact with the youtube music player (e.g : `this.ympService.setPlaylist(playlist);`)


The `playlist` has to be an array of video ids (example : `['cTn288M5Mak', '3dm_5qWWDV8']`).

You can convert an array of youtube links to an array of videos ids using the `YoutubeMusicPlayerService` method `urlsToIds(playlist: string[])`.

Example : 

`let playlist = this.ympService.urlsToIds(['https://www.youtube.com/watch?v=cTn288M5Mak', 'https://www.youtube.com/watch?v=3dm_5qWWDV8']);`

**Possible Inputs on `<app youtube-music-player></app-youtube-music-player>` : **

`playlist` : the array of strings containing your video ids

`autoplay` : autostart the playlist ? (default : `0`, can be set to `1`)

`index` : position on the playlist (default : `0`)

**Methods on `YoutubeMusicPlayerService` to control the player :**

`getErrorSub()` : returns a `BehaviorSubject` that you should subscribe, it will set a value `> 0` if an error occurs describing the error flag on youtube's API.

`setPlaylist(playlist: string[])` : change the current playlist

`setIndex(index: number)` : change the current position on the array of musics

`public play()` : play the playlist

`public pause()` : pause the playlist

`urlsToIds(playlist: string[])` : converts an array of youtube links to an array of youtube video ids

**Notes :**

If you have troubles with the player because it stays in a loading state. 

1. Make sure you have correctly included the youtube API `<script src="https://www.youtube.com/iframe_api"></script>` in your `index.html` 

2. Reload manually the page.

Author : Sebastien S.

Github repository : https://github.com/neoski/youtube-music-player
