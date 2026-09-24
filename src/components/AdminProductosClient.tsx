"use client";

import { useState } from "react";
import { Producto, Categoria } from "@/types";
import { formatearPrecio } from "@/lib/formato";
import { CATEGORIAS, etiquetaCategoria } from "@/lib/categorias";
import { Pencil, Trash2, Plus, X } from "lucide-react";

const VACIO = {
  nombre: "",
  descripcion: "",
  precio: 0,
  categoria: "almuerzos-cenas" as Categoria,
  imagenes: [] as string[],
  stock: 0,
  activo: true,
  destacado: false,
  // Se editan como texto separado por comas y se convierten a lista recién
  // al guardar (ver guardar()).
  saboresTexto: "",
};

export default function AdminProductosClient({
  productosIniciales,
}: {
  productosIniciales: Producto[];
}) {
  const [productos, setProductos] = useState<Producto[]>(productosIniciales);
  const [editando, setEditando] = useState<string | null>(null);
  const [form, setForm] = useState(VACIO);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function subirImagenes(archivos: FileList) {
    setSubiendoImagen(true);
    setError(null);
    try {
      for (const archivo of Array.from(archivos)) {
        const datosArchivo = new FormData();
        datosArchivo.append("archivo", archivo);
        const res = await fetch("/api/admin/upload-imagen", {
          method: "POST",
          body: datosArchivo,
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "No pudimos subir una de las imágenes.");
          continue;
        }
        setForm((f) => ({ ...f, imagenes: [...f.imagenes, data.url] }));
      }
    } catch {
      setError("Hubo un problema de conexión al subir las imágenes.");
    } finally {
      setSubiendoImagen(false);
    }
  }

  function quitarImagen(indice: number) {
    setForm((f) => ({
      ...f,
      imagenes: f.imagenes.filter((_, i) => i !== indice),
    }));
  }

  function abrirNuevo() {
    setForm(VACIO);
    setEditando(null);
    setMostrarForm(true);
    setError(null);
  }

  function abrirEdicion(p: Producto) {
    setForm({
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio: p.precio,
      categoria: p.categoria,
      imagenes: p.imagenes ?? (p.imagen_url ? [p.imagen_url] : []),
      stock: p.stock,
      activo: p.activo,
      destacado: p.destacado,
      saboresTexto: (p.sabores ?? []).join(", "),
    });
    setEditando(p.id);
    setMostrarForm(true);
    setError(null);
  }

  async function guardar() {
    setGuardando(true);
    setError(null);
    try {
      const url = editando
        ? `/api/admin/productos/${editando}`
        : "/api/admin/productos";
      const method = editando ? "PUT" : "POST";
      const { saboresTexto, ...resto } = form;
      const sabores = saboresTexto
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...resto, sabores }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "No pudimos guardar el producto.");
        return;
      }

      setProductos((prev) =>
        editando
          ? prev.map((p) => (p.id === editando ? data : p))
          : [data, ...prev],
      );
      setMostrarForm(false);
    } finally {
      setGuardando(false);
    }
  }

  async function eliminar(id: string) {
    if (!confirm("¿Eliminar este producto?")) return;
    const res = await fetch(`/api/admin/productos/${id}`, { method: "DELETE" });
    if (res.ok) setProductos((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="mt-6">
      <button
        onClick={abrirNuevo}
        className="mb-6 flex items-center gap-1.5 rounded-full bg-oliva px-4 py-2 text-sm text-crema-alta hover:bg-oliva-claro"
      >
        <Plus size={16} /> Nuevo producto
      </button>

      {mostrarForm && (
        <div className="mb-8 grid gap-3 rounded-2xl border border-linea bg-crema-alta p-5 sm:grid-cols-2">
          <input
            placeholder="Nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className="rounded-lg border border-linea bg-white px-3 py-2 text-sm outline-none focus:border-oliva"
          />
          <select
            value={form.categoria}
            onChange={(e) =>
              setForm({ ...form, categoria: e.target.value as Categoria })
            }
            className="rounded-lg border border-linea bg-white px-3 py-2 text-sm outline-none focus:border-oliva"
          >
            {CATEGORIAS.map((c) => (
              <option key={c.valor} value={c.valor}>
                {c.etiqueta}
              </option>
            ))}
          </select>
          <textarea
            placeholder="Descripción"
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            className="rounded-lg border border-linea bg-white px-3 py-2 text-sm outline-none focus:border-oliva sm:col-span-2"
          />
          <input
            type="number"
            placeholder="Precio (en pesos)"
            value={form.precio || ""}
            onChange={(e) =>
              setForm({ ...form, precio: Number(e.target.value) })
            }
            className="rounded-lg border border-linea bg-white px-3 py-2 text-sm outline-none focus:border-oliva"
          />
          <input
            type="number"
            placeholder="Cantidad disponible"
            value={form.stock || ""}
            onChange={(e) =>
              setForm({ ...form, stock: Number(e.target.value) })
            }
            className="rounded-lg border border-linea bg-white px-3 py-2 text-sm outline-none focus:border-oliva"
          />
          <div className="flex flex-col gap-2 sm:col-span-2">
            <label className="text-sm text-tinta">
              Fotos del producto (podés elegir varias)
              {form.imagenes.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {form.imagenes.map((url, indice) => (
                    <div key={url} className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt=""
                        className="h-16 w-16 rounded-lg border border-linea object-cover"
                      />
                      {indice === 0 && (
                        <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 rounded-full bg-marron px-1.5 py-0.5 text-[10px] text-crema-alta">
                          Portada
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => quitarImagen(indice)}
                        aria-label="Quitar esta foto"
                        className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ciruela text-crema-alta"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
                  onChange={(e) => {
                    const archivos = e.target.files;
                    if (archivos && archivos.length > 0) subirImagenes(archivos);
                    e.target.value = "";
                  }}
                  disabled={subiendoImagen}
                  className="text-sm text-tinta/70 file:mr-3 file:rounded-full file:border-0 file:bg-oliva file:px-4 file:py-2 file:text-sm file:text-crema-alta hover:file:bg-oliva-claro"
                />
                {subiendoImagen && (
                  <span className="text-sm text-tinta/50">Subiendo…</span>
                )}
              </div>
            </label>
            <span className="text-xs text-tinta/50">
              La primera foto de la lista es la que se usa como portada. Para
              cambiar el orden, quitá las que no correspondan y volvé a
              subirlas en el orden que quieras.
            </span>
          </div>
          <label className="text-sm text-tinta sm:col-span-2">
            Sabores u opciones (opcional, separados por coma)
            <input
              placeholder="Ej: Acelga, Caprese, Choclo"
              value={form.saboresTexto}
              onChange={(e) =>
                setForm({ ...form, saboresTexto: e.target.value })
              }
              className="mt-1 w-full rounded-lg border border-linea bg-white px-3 py-2 text-sm outline-none focus:border-oliva"
            />
            <span className="mt-1 block text-xs text-tinta/50">
              Si cargás al menos uno, el cliente va a tener que elegir una
              opción antes de agregarlo al carrito.
            </span>
          </label>
          <label className="flex items-center gap-2 text-sm text-tinta">
            <input
              type="checkbox"
              checked={form.activo}
              onChange={(e) => setForm({ ...form, activo: e.target.checked })}
            />
            Visible en la tienda
          </label>
          <label className="flex items-center gap-2 text-sm text-tinta">
            <input
              type="checkbox"
              checked={form.destacado}
              onChange={(e) =>
                setForm({ ...form, destacado: e.target.checked })
              }
            />
            Destacado en la página principal
          </label>
          {error && (
            <p className="text-sm text-ciruela sm:col-span-2">{error}</p>
          )}

          <div className="flex gap-2 sm:col-span-2">
            <button
              onClick={guardar}
              disabled={guardando}
              className="rounded-full bg-boton px-5 py-2 text-sm text-tinta hover:bg-boton-oscuro disabled:opacity-60"
            >
              {guardando ? "Guardando…" : "Guardar"}
            </button>
            <button
              onClick={() => setMostrarForm(false)}
              className="rounded-full border border-linea px-5 py-2 text-sm text-tinta/70 hover:bg-white"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="divide-y divide-linea rounded-2xl border border-linea bg-crema-alta">
        {productos.map((p) => (
          <div key={p.id} className="flex items-center gap-4 p-4">
            <div className="flex-1">
              <p className="font-medium text-tinta">
                {p.nombre}{" "}
                {!p.activo && (
                  <span className="ml-2 text-xs text-tinta/40">(oculto)</span>
                )}
                {p.destacado && (
                  <span className="ml-2 text-xs text-dorado-oscuro">
                    ★ destacado
                  </span>
                )}
              </p>
              <p className="text-sm text-tinta/60">
                {formatearPrecio(p.precio)} · Stock: {p.stock} ·{" "}
                {etiquetaCategoria(p.categoria)}
                {p.sabores && p.sabores.length > 0
                  ? ` · ${p.sabores.length} sabores`
                  : ""}
              </p>
            </div>
            <button
              onClick={() => abrirEdicion(p)}
              className="text-tinta/50 hover:text-oliva"
            >
              <Pencil size={18} />
            </button>
            <button
              onClick={() => eliminar(p.id)}
              className="text-tinta/50 hover:text-ciruela"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
