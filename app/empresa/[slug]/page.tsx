"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Servicio {
  id: number;
  nombre: string;
  duracion: number;
  precio: number;
}

interface Empleado {
  id: number;
  nombre: string;
  servicios: { servicioId: number }[];
}

interface HorarioDisponible {
  fecha: string;
  horarios: { hora: string; empleadoId: number; empleadoNombre: string }[];
}

export default function ReservaPage() {
  const { slug } = useParams();
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [horarios, setHorarios] = useState<HorarioDisponible[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    servicioId: "",
    empleadoId: "",
    fecha: "",
    hora: "",
    clienteNombre: "",
    cedula: "",
    correo: "",
    telefono: "",
  });

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/empresa/${slug}/servicios`)
      .then(res => res.json())
      .then(data => {
        setServicios(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Error al cargar servicios");
        setLoading(false);
      });
  }, [slug]);

  useEffect(() => {
    if (!slug || !form.servicioId) return;

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/empresa/${slug}/empleados`)
      .then(res => res.json())
      .then(data => setEmpleados(data))
      .catch(() => setEmpleados([]));

    let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/empresa/${slug}/fechas-horarios?servicioId=${form.servicioId}`;
    if (form.empleadoId) {
      url += `&empleadoId=${form.empleadoId}`;
    }
    fetch(url)
      .then(res => res.json())
      .then(data => setHorarios(data))
      .catch(() => setHorarios([]));
  }, [slug, form.servicioId, form.empleadoId]);

  const empleadosFiltrados = empleados.filter(e =>
    e.servicios.some(s => s.servicioId === Number(form.servicioId))
  );

  const horariosDelDia = horarios.find(h => h.fecha === form.fecha)?.horarios || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug) return;
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/empresa/${slug}/reservar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          servicioId: Number(form.servicioId),
          empleadoId: form.empleadoId ? Number(form.empleadoId) : undefined,
        }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Error al reservar");
      }
      alert("Cita reservada exitosamente");
      setForm({
        servicioId: "",
        empleadoId: "",
        fecha: "",
        hora: "",
        clienteNombre: "",
        cedula: "",
        correo: "",
        telefono: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al reservar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Reserva de Cita</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <select
          required
          value={form.servicioId}
          onChange={e => setForm({ ...form, servicioId: e.target.value, empleadoId: "", fecha: "", hora: "" })}
          className="border p-2 rounded"
        >
          <option value="">Seleccionar servicio</option>
          {servicios.map(s => (
            <option key={s.id} value={s.id}>
              {s.nombre} - {s.duracion}min
            </option>
          ))}
        </select>

        {form.servicioId && (
          <select
            value={form.empleadoId}
            onChange={e => setForm({ ...form, empleadoId: e.target.value, fecha: "", hora: "" })}
            className="border p-2 rounded"
          >
            <option value="">Cualquier empleado</option>
            {empleadosFiltrados.map(e => (
              <option key={e.id} value={e.id}>{e.nombre}</option>
            ))}
          </select>
        )}

        {form.servicioId && (
          <select
            required
            value={form.fecha}
            onChange={e => setForm({ ...form, fecha: e.target.value, hora: "" })}
            className="border p-2 rounded"
          >
            <option value="">Seleccionar fecha</option>
            {horarios.map(h => (
              <option key={h.fecha} value={h.fecha}>{h.fecha}</option>
            ))}
          </select>
        )}

        {form.fecha && (
          <div className="flex flex-wrap gap-2 my-4">
            {horariosDelDia.length === 0 ? (
              <p>No hay horarios disponibles para esta fecha</p>
            ) : (
              horariosDelDia.map(h => (
                <button
                  type="button"
                  key={`${h.hora}-${h.empleadoId}`}
                  className={`px-3 py-2 rounded border ${form.hora === h.hora ? 'bg-blue-500 text-white' : 'bg-white text-blue-700 border-blue-500'}`}
                  onClick={() => setForm({ ...form, hora: h.hora, empleadoId: form.empleadoId || String(h.empleadoId) })}
                >
                  {h.hora} {form.empleadoId ? '' : `- ${h.empleadoNombre}`}
                </button>
              ))
            )}
          </div>
        )}

        <input
          placeholder="Nombre completo"
          required
          value={form.clienteNombre}
          onChange={e => setForm({ ...form, clienteNombre: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          placeholder="Cédula"
          required
          value={form.cedula}
          onChange={e => setForm({ ...form, cedula: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          placeholder="Correo"
          type="email"
          required
          value={form.correo}
          onChange={e => setForm({ ...form, correo: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          placeholder="Teléfono"
          required
          value={form.telefono}
          onChange={e => setForm({ ...form, telefono: e.target.value })}
          className="border p-2 rounded"
        />

        <button type="submit" disabled={loading} className={`bg-blue-500 text-white py-3 rounded ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}>
          {loading ? "Reservando..." : "Reservar Cita"}
        </button>
      </form>
    </div>
  );
}