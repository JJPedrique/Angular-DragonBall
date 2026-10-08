import { TestBed } from '@angular/core/testing';
import { Paginador } from './paginador';

describe('Paginador', () => {
  it('desactiva "Anterior" en la primera página y avisa la siguiente', async () => {
    const fixture = TestBed.createComponent(Paginador);
    // [E81] setInput(): así se le pasan input() a un componente en una prueba
    fixture.componentRef.setInput('pagina', 1);
    fixture.componentRef.setInput('totalPaginas', 5);
    await fixture.whenStable();

    let pedida = 0;
    fixture.componentInstance.cambio.subscribe((p) => (pedida = p));
    const [anterior, siguiente] = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>('button'),
    );

    expect(anterior.disabled).toBe(true);
    siguiente.click();
    expect(pedida).toBe(2);
  });

  it('no se muestra si hay una sola página', async () => {
    const fixture = TestBed.createComponent(Paginador);
    fixture.componentRef.setInput('pagina', 1);
    fixture.componentRef.setInput('totalPaginas', 1);
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).querySelector('nav')).toBeNull();
  });
});
