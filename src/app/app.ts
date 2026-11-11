import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthStore } from './auth.store';
import { LoginPage } from './features/login/login-page';
import { OSMStore } from './osm.store';
import { PreferencesStore } from './preferences.store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LoginPage],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly store = inject(OSMStore);
  protected readonly auth = inject(AuthStore);
  protected readonly preferences = inject(PreferencesStore);
  protected readonly navItems = [
    { label: 'หน้าหลัก', path: '/dashboard', icon: '◫', iconClass: 'ic-green' },
    { label: 'ครัวเรือน', path: '/households', icon: '⌂', iconClass: 'ic-blue' },
    { label: 'พิมพ์เอกสาร', path: '/print', icon: '▤', iconClass: 'ic-amber' },
    { label: 'ตั้งค่า', path: '/settings', icon: '⚙', iconClass: 'ic-violet' },
  ];
  protected readonly bottomItems = [
    { label: 'หน้าหลัก', path: '/dashboard', icon: '⌂', accent: 'c-green', add: false },
    { label: 'ครัวเรือน', path: '/households', icon: '⌂', accent: 'c-blue', add: false },
    { label: 'เพิ่มบ้าน', path: '/households/new', icon: '＋', accent: 'c-green', add: true },
    { label: 'พิมพ์เอกสาร', path: '/print', icon: '▤', accent: 'c-amber', add: false },
    { label: 'ตั้งค่า', path: '/settings', icon: '⚙', accent: 'c-violet', add: false },
  ];
}
