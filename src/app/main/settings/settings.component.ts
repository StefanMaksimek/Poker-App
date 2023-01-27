import { DOCUMENT } from '@angular/common';
import {
  Component,
  HostBinding,
  Inject,
  inject,
  Renderer2,
} from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  toggle: 'dark' | 'light' | 'neon' = 'dark';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2
  ) {}

  setThemeToggle({ source }: MatButtonToggleChange) {
    this.toggle = source.value;
    this.renderer.removeAttribute(this.document.body, 'class');
    this.renderer.addClass(this.document.body, this.toggle);
  }
}
