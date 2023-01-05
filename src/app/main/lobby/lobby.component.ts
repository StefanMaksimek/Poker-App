import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss'],
})
export class LobbyComponent {
  @Input() type: 'success' | 'info' | 'warn' | 'none' = 'none';

  @HostBinding('class')
  get hostClass() {
    if (this.type !== 'none') {
      return `app-lobby-${this.type}`;
    }
  }
}
