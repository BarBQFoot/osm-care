import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';
import { AuthStore } from './auth.store';

class LoggedInAuthStub {
  readonly ready = () => true;
  readonly user = () => ({ email: 'test@local' });
  readonly checking = () => false;
  readonly loginError = () => '';
}

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes), { provide: AuthStore, useClass: LoggedInAuthStub }],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the brand name', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.brand')?.textContent).toContain('My OSM');
  });

  it('should render main navigation links', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const navText = Array.from(compiled.querySelectorAll('nav')).map((n) => n.textContent ?? '').join(' ');
    expect(navText).toContain('หน้าหลัก');
    expect(navText).toContain('ครัวเรือน');
    expect(navText).toContain('พิมพ์เอกสาร');
    expect(navText).toContain('ตั้งค่า');
  });
});
