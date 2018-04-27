# youtube-music-player
Create a music player with youtube links and control it (Angular5 module).

<img src="https://github.com/neoski/youtube-music-player/blob/master/ymp.png"/>

**Usage :**

1. Run `npm install youtube-music-player --save` in the root of your application

2. `import { YoutubeMusicPlayerModule } from 'youtube-music-player';` in your module

3. Add it to the imports of NgModule : `@NgModule({[...], imports: [[...], YoutubeMusicPlayerModule], [...]})`

4. Integrate the youtube music player `<app-youtube-music-player [playlist]="playlist"></app-youtube-music-player>` in your HTML

The `playlist` has to be an array of video ids (example : `['cTn288M5Mak', '3dm_5qWWDV8']`).

You can convert an array of youtube links to an array of videos ids using the `YoutubeMusicPlayerService` method `urlsToIds(playlist: string[])`.

Example : 

`let playlist = this.ympService.urlsToIds(['https://www.youtube.com/watch?v=cTn288M5Mak', 'https://www.youtube.com/watch?v=3dm_5qWWDV8']);`

**To use the Service :**

1. `import { YoutubeMusicPlayerService } from 'youtube-music-player';` in your component using it

2. Assign the service in your component : `constructor([...], private ympService: YoutubeMusicPlayerService)`

3. You can now interact with the youtube music player (e.g : `this.ympService.setPlaylist(playlist);`)

**Possible Inputs on `<app youtube-music-player></app-youtube-music-player>` :**

`playlist` : the array of strings containing your video ids (default : [])

`autoplay` : autostart the playlist ? (default : `0`, can be set to `1`)

`index` : position on the playlist (default : `0`)

`youtubeApiLink` : youtube api link (default : 'https://www.youtube.com/iframe_api')

**Methods on `YoutubeMusicPlayerService` to control the player :**

`getReadySub()` : returns a `BehaviorSubject` that you should subscribe, it will set the value `true` when the youtube player is ready. 

`getErrorSub()` : returns a `BehaviorSubject` that you should subscribe, it will set a value `> 0` if an error occurs describing the error flag on youtube's API.

`setPlaylist(playlist: string[])` : change the current playlist

`setIndex(index: number)` : change the current position on the array of musics

`public play()` : play the playlist

`public pause()` : pause the playlist

`urlsToIds(playlist: string[])` : converts an array of youtube links to an array of youtube video ids

**Example :**

Add to your component HTML :

`<app-youtube-music-player></app-youtube-music-player>`

Then in the component class method (with `private ympService : YoutubeMusicPlayerService` on the constructor's params) :

```

const youtubeLinks = ['https://www.youtube.com/watch?v=cTn288M5Mak', 'https://www.youtube.com/watch?v=3dm_5qWWDV8'];

const playlist = this.ympService.urlsToIds(youtubeLinks); // extract the ids from the youtube links

this.ympService.getReadySub().subscribe((val) => {

    if (val === true) { // when player is ready
    
       this.ympService.setPlaylist(playlist);
       
       this.ympService.play();
       
    }

});

```




**Notes :**

If you have troubles with the player :

- Make sure you interact with the player when it is ready, subscribe on `getReadySub()` and make sure it holds the value `true` before any interaction with the player.

- Make sure you are not trying to play an empty playlist.

Author : Sebastien S.

Github repository : https://github.com/neoski/youtube-music-player
