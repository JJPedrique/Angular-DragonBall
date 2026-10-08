import { TestBed } from '@angular/core/testing';
import { FavoritosService } from './favoritos.service';

describe('FavoritosService', () => {
  // [E80] Cada prueba arranca sin favoritos
  beforeEach(() => localStorage.clear());

  it('agrega y quita un favorito Personaje', () => {
    const favs = TestBed.inject(FavoritosService);
    favs.alternarPersonaje(1);
    expect(favs.esPersonajeFavorito(1)).toBe(true);
    expect(favs.personajesTotal()).toBe(1);
    favs.alternarPersonaje(1);
    expect(favs.esPersonajeFavorito(1)).toBe(false);
  });

  it('agrega y quita un favorito Planeta', () => {
    const favs = TestBed.inject(FavoritosService);
    favs.alternarPlanetas(1);
    expect(favs.esPlanetasFavorito(1)).toBe(true);
    expect(favs.planetasTotal()).toBe(1);
    favs.alternarPlanetas(1);
    expect(favs.esPlanetasFavorito(1)).toBe(false);
  });
});
