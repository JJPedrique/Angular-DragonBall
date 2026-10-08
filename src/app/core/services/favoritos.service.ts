import { Injectable, computed, effect, signal } from '@angular/core';

// Estado global de la app: lo usan el header y varias features, por eso vive en core.
// Cualquier componente que inyecte este servicio ve los mismos favoritos.
@Injectable({ providedIn: 'root' })
export class FavoritosService {
  // [E12] signal privado: arranca con lo guardado en localStorage
  private readonly personajesIds = signal<number[]>(leerPersonajes());

  // Solo lectura hacia afuera: nadie puede hacer .set() desde un componente
  // [E13] asReadonly(): afuera se puede leer, pero no hacer .set()
  readonly personajesFavoritos = this.personajesIds.asReadonly();
  // [E14] computed: se recalcula solo cuando cambia ids
  readonly personajesTotal = computed(() => this.personajesIds().length);

  private readonly planetasIds = signal<number[]>(leerPlanetas());
  readonly planetasFavoritos = this.planetasIds.asReadonly();
  readonly planetasTotal = computed(() => this.planetasIds().length);

  constructor() {
    // [E15] effect: corre cada vez que cambia ids y lo guarda
    effect(() => localStorage.setItem('personajes-favoritos', JSON.stringify(this.personajesIds())));
    effect(() => localStorage.setItem('planetas-favoritos', JSON.stringify(this.planetasIds())));
  }

  esPersonajeFavorito(id: number) {
    return this.personajesIds().includes(id);
  }

  esPlanetasFavorito(id: number) {
    return this.planetasIds().includes(id);
  }

  alternarPersonaje(id: number) {
    // [E16] update() inmutable: siempre un arreglo nuevo, nunca push()
    this.personajesIds.update((personajesIds) => (personajesIds.includes(id) ? personajesIds.filter((x) => x !== id) : [...personajesIds, id]));
  }

  alternarPlanetas(id: number) {
    // [E16] update() inmutable: siempre un arreglo nuevo, nunca push()
    this.planetasIds.update((planetasIds) => (planetasIds.includes(id) ? planetasIds.filter((x) => x !== id) : [...planetasIds, id]));
  }
}

function leerPersonajes(): number[] {
  try {return JSON.parse(localStorage.getItem('personajes-favoritos') ?? '[]');
  } catch {return [];}
}

function leerPlanetas(): number[] {
  try {return JSON.parse(localStorage.getItem('planetas-favoritos') ?? '[]');
  } catch {return [];}
}