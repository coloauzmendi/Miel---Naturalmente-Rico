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
  agregar: (producto: Producto, cantidad?: number) => void;
  quitar: (productoId: string) => void;
  actualizarCantidad: (productoId: string, cantidad: number) => void;
  vaciar: () => void;
  total: number;
  cantidadTotal: number;
}

const CarritoContext = createContext<CarritoContextValor | undefined>(undefined);
const CLAVE_STORAGE = "miel-carrito";

export function CarritoProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ItemCarrito[]>([]);
  const [cargado, setCargado] = useState(false);

  // Cargar carrito guardado al montar
  useEffect(() => {
    try {
      const guardado = localStorage.getItem(CLAVE_STORAGE);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hidratación intencional de estado persistido, se ejecuta una sola vez al montar
      if (guardado) setItems(JSON.parse(guardado));
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

  function agregar(producto: Producto, cantidad = 1) {
    setItems((prev) => {
      const existente = prev.find((i) => i.producto.id === producto.id);
      if (existente) {
        return prev.map((i) =>
          i.producto.id === producto.id
            ? { ...i, cantidad: Math.min(i.cantidad + cantidad, producto.stock) }
            : i
        );
      }
      return [...prev, { producto, cantidad: Math.min(cantidad, producto.stock) }];
    });
  }

  function quitar(productoId: string) {
    setItems((prev) => prev.filter((i) => i.producto.id !== productoId));
  }

  function actualizarCantidad(productoId: string, cantidad: number) {
    setItems((prev) =>
      prev
        .map((i) =>
          i.producto.id === productoId
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
