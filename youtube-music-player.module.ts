import { NgModule } from '@angular/core';
import { YoutubeMusicPlayerComponent } from './youtube-music-player.component';
import { YoutubeMusicPlayerService } from './youtube-music-player.service';

@NgModule({
  declarations: [YoutubeMusicPlayerComponent],
  exports: [YoutubeMusicPlayerComponent],
  providers: [YoutubeMusicPlayerService]
})
export class YoutubeMusicPlayerModule { }
