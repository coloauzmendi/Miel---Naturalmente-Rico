import { Categoria } from "@/types";

export const CATEGORIAS: { valor: Categoria; etiqueta: string }[] = [
  { valor: "almuerzos-cenas", etiqueta: "Almuerzos y cenas" },
  { valor: "desayunos-meriendas", etiqueta: "Desayunos y meriendas" },
];

export function esCategoria(valor: unknown): valor is Categoria {
  return CATEGORIAS.some((c) => c.valor === valor);
}

export function etiquetaCategoria(categoria: Categoria) {
  return CATEGORIAS.find((c) => c.valor === categoria)?.etiqueta ?? categoria;
}
