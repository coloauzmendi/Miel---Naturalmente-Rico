"use client";

import { useState } from "react";
import { Producto, Categoria } from "@/types";
import { formatearPrecio } from "@/lib/formato";
import { Pencil, Trash2, Plus } from "lucide-react";

const VACIO = {
  nombre: "",
  descripcion: "",
  precio: 0,
  categoria: "cocidos" as Categoria,
  imagen_url: "",
  stock: 0,
  activo: true,
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
  const [error, setError] = useState<string | null>(null);

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
      imagen_url: p.imagen_url ?? "",
      stock: p.stock,
      activo: p.activo,
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
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
            <option value="cocidos">Cocidos</option>
            <option value="congelados">Congelados</option>
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
          <input
            placeholder="URL de imagen (opcional)"
            value={form.imagen_url}
            onChange={(e) => setForm({ ...form, imagen_url: e.target.value })}
            className="rounded-lg border border-linea bg-white px-3 py-2 text-sm outline-none focus:border-oliva sm:col-span-2"
          />
          <label className="flex items-center gap-2 text-sm text-tinta">
            <input
              type="checkbox"
              checked={form.activo}
              onChange={(e) => setForm({ ...form, activo: e.target.checked })}
            />
            Visible en la tienda
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
              </p>
              <p className="text-sm text-tinta/60">
                {formatearPrecio(p.precio)} · Stock: {p.stock} · {p.categoria}
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
