import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      // [E82] El header usa routerLink: le damos un router vacío
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('se crea el componente raíz', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('muestra el título', async () => {
    const fixture = TestBed.createComponent(App);
    // [E83] Esperar a que la vista termine de pintarse
    await fixture.whenStable();
    const html = fixture.nativeElement as HTMLElement;
    expect(html.querySelector('h1')?.textContent).toContain('Directorio de Personajes');
  });
});
