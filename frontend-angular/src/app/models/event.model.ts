export interface EventModel {
  _id?: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  ubicacion: string;
  precio: number;
  fecha: string;
  esPublico: boolean;
  createdAt?: string;
  updatedAt?: string;
}
