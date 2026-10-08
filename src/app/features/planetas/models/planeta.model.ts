export interface Planeta {
  id: number;
  name: string;
  isDestroyed: boolean;
  description: string;
  image: string;
}

export interface Filtro {
  pagina: number;
  nombre: string;
  estado: string;
}