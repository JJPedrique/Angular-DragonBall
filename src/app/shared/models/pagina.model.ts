// Respuesta paginada de la API. Es genérica: sirve para personajes, planetas, etc.
// [E11] Genérico <T> en shared/: sirve para Pagina<Personaje>, Pagina<Planeta>...
export interface Pagina<T> {
  items: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

// Envuelve un arreglo simple como si fuera una página única
// [E65] Función genérica de shared/: arreglo -> Pagina<T>
export function unaSolaPagina<T>(items: T[]): Pagina<T> {
  return {
    items,
    meta: {
      totalItems: items.length,
      itemCount: items.length,
      itemsPerPage: items.length,
      totalPages: items.length ? 1 : 0,
      currentPage: 1,
    },
  };
}
