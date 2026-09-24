"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { ItemCarrito, Producto } from "@/types";

interface CarritoContextValor {
  items: ItemCarrito[];
  agregar: (producto: Producto, cantidad?: number, sabor?: string | null) => void;
  quitar: (productoId: string, sabor?: string | null) => void;
  actualizarCantidad: (
    productoId: string,
    cantidad: number,
    sabor?: string | null,
  ) => void;
  vaciar: () => void;
  total: number;
  cantidadTotal: number;
}

const CarritoContext = createContext<CarritoContextValor | undefined>(undefined);
const CLAVE_STORAGE = "miel-carrito";

// Dos líneas son "la misma" solo si coinciden producto Y sabor: así "Tarta
// (acelga)" y "Tarta (caprese)" quedan como renglones separados en el carrito.
function mismoItem(item: ItemCarrito, productoId: string, sabor: string | null) {
  return item.producto.id === productoId && (item.sabor ?? null) === (sabor ?? null);
}

export function CarritoProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ItemCarrito[]>([]);
  const [cargado, setCargado] = useState(false);

  // Cargar carrito guardado al montar
  useEffect(() => {
    try {
      const guardado = localStorage.getItem(CLAVE_STORAGE);
      if (guardado) {
        const itemsGuardados: ItemCarrito[] = JSON.parse(guardado);
        // Compatibilidad con carritos guardados antes de que existiera "sabor".
        // eslint-disable-next-line react-hooks/set-state-in-effect -- hidratación intencional de estado persistido, se ejecuta una sola vez al montar
        setItems(itemsGuardados.map((i) => ({ ...i, sabor: i.sabor ?? null })));
      }
    } catch {
      // si el storage está corrupto, arrancamos con carrito vacío
    } finally {
      setCargado(true);
    }
  }, []);

  // Persistir cada cambio
  useEffect(() => {
    if (!cargado) return;
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(items));
  }, [items, cargado]);

  function agregar(producto: Producto, cantidad = 1, sabor: string | null = null) {
    setItems((prev) => {
      const existente = prev.find((i) => mismoItem(i, producto.id, sabor));
      if (existente) {
        return prev.map((i) =>
          mismoItem(i, producto.id, sabor)
            ? { ...i, cantidad: Math.min(i.cantidad + cantidad, producto.stock) }
            : i
        );
      }
      return [
        ...prev,
        { producto, cantidad: Math.min(cantidad, producto.stock), sabor },
      ];
    });
  }

  function quitar(productoId: string, sabor: string | null = null) {
    setItems((prev) => prev.filter((i) => !mismoItem(i, productoId, sabor)));
  }

  function actualizarCantidad(
    productoId: string,
    cantidad: number,
    sabor: string | null = null,
  ) {
    setItems((prev) =>
      prev
        .map((i) =>
          mismoItem(i, productoId, sabor)
            ? { ...i, cantidad: Math.max(1, Math.min(cantidad, i.producto.stock)) }
            : i
        )
        .filter((i) => i.cantidad > 0)
    );
  }

  function vaciar() {
    setItems([]);
  }

  const total = useMemo(
    () => items.reduce((acc, i) => acc + i.producto.precio * i.cantidad, 0),
    [items]
  );

  const cantidadTotal = useMemo(
    () => items.reduce((acc, i) => acc + i.cantidad, 0),
    [items]
  );

  return (
    <CarritoContext.Provider
      value={{ items, agregar, quitar, actualizarCantidad, vaciar, total, cantidadTotal }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  const ctx = useContext(CarritoContext);
  if (!ctx) throw new Error("useCarrito debe usarse dentro de CarritoProvider");
  return ctx;
}
