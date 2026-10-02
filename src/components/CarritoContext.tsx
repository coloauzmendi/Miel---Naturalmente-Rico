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
import { createClient } from "@/lib/supabase/client";

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
  // Mensaje si al abrir la página hubo que corregir el carrito (precio
  // nuevo, producto agotado, etc.). null si no cambió nada.
  avisoCarrito: string | null;
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

// El carrito guarda una copia de cada producto del momento en que se
// agregó. Al abrir la página la comparamos con los datos reales de la
// tienda: así el precio que se ve es el que se cobra, y los productos
// ocultos o agotados (stock 0) salen solos. Devuelve el carrito corregido
// y qué cambió, o null si no se pudo consultar.
async function refrescarCarrito(
  guardados: ItemCarrito[],
): Promise<{ items: ItemCarrito[]; cambios: string[] } | null> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return null;
  }

  const { data, error } = await createClient()
    .from("productos")
    .select("*")
    .in("id", [...new Set(guardados.map((i) => i.producto.id))])
    .eq("activo", true);
  if (error || !data) return null;

  const actuales = data as Producto[];
  const cambios: string[] = [];
  const items = guardados.flatMap((item) => {
    const producto = actuales.find((p) => p.id === item.producto.id);
    const sabores = producto?.sabores ?? [];
    const sabor = item.sabor
      ? sabores.find((s) => s.nombre === item.sabor)
      : undefined;

    if (!producto || producto.stock <= 0 || (sabores.length > 0 && !sabor)) {
      cambios.push(`${item.producto.nombre} ya no está disponible`);
      return [];
    }

    const precio = sabor ? sabor.precio : producto.precio;
    if (precio !== item.producto.precio) {
      cambios.push(`${producto.nombre} cambió de precio`);
    }
    return [
      {
        ...item,
        producto: { ...producto, precio },
        cantidad: Math.min(item.cantidad, producto.stock),
      },
    ];
  });

  return { items, cambios };
}

export function CarritoProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ItemCarrito[]>([]);
  const [cargado, setCargado] = useState(false);
  const [avisoCarrito, setAvisoCarrito] = useState<string | null>(null);

  // Cargar carrito guardado al montar
  useEffect(() => {
    try {
      const guardado = localStorage.getItem(CLAVE_STORAGE);
      if (guardado) {
        const itemsGuardados: ItemCarrito[] = JSON.parse(guardado);
        // Compatibilidad con carritos guardados antes de que existiera "sabor".
        const normalizados = itemsGuardados.map((i) => ({
          ...i,
          sabor: i.sabor ?? null,
        }));
        // eslint-disable-next-line react-hooks/set-state-in-effect -- hidratación intencional de estado persistido, se ejecuta una sola vez al montar
        setItems(normalizados);

        if (normalizados.length > 0) {
          refrescarCarrito(normalizados).then((resultado) => {
            if (!resultado || resultado.cambios.length === 0) return;
            // Solo reemplazamos las líneas que venían guardadas: si mientras
            // tanto la persona agregó algo nuevo, lo conservamos.
            setItems((actuales) => [
              ...resultado.items,
              ...actuales.filter(
                (a) =>
                  !normalizados.some((n) => mismoItem(n, a.producto.id, a.sabor)),
              ),
            ]);
            setAvisoCarrito(
              `Actualizamos tu carrito: ${resultado.cambios.join(", ")}.`,
            );
          });
        }
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
    // Borramos también lo guardado: si vaciar() corre antes de que el
    // provider termine de cargar el storage, el carrito viejo volvería.
    try {
      localStorage.removeItem(CLAVE_STORAGE);
    } catch {
      // storage no disponible: alcanza con el estado vacío
    }
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
      value={{
        items,
        agregar,
        quitar,
        actualizarCantidad,
        vaciar,
        avisoCarrito,
        total,
        cantidadTotal,
      }}
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
