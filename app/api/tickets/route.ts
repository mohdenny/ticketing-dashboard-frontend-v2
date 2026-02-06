import { NextResponse } from 'next/server';
import { Ticket } from '@/types/ticket';

// Simulasi database sementara di memori server
let tickets: Ticket[] = [];

/**
 * ROUTE HANDLERS
 * Tempat membuat API (Backend) di dalam Next.js.
 */

// --- AMBIL DATA (GET) ---
// Membuat API Endpoint untuk mendistribusikan data tickets dalam format JSON.
// GET: Fungsi penentu agar pintu ini hanya melayani permintaan AMBIL data.
// NextResponse: Objek pengantar (kurir) untuk mengirim balasan balik ke client.
// .json(tickets): Format paket kiriman agar data bisa dibaca aplikasi lain.
export const GET = async () => {
  // NextResponse tidak perlu pakai await karena hanya membungkus data yang sudah siap di tangan.
  return NextResponse.json(tickets);
};

// --- TAMBAH DATA (POST) ---
// Membuat API Endpoint untuk menerima dan menyimpan data ticket baru.
// POST: Fungsi penentu agar pintu ini melayani permintaan KIRIM/SETOR data.
// request: Objek yang membawa paket kiriman berisi data dari client (frontend).
export const POST = async (request: Request) => {
  // .json(): Proses "membongkar" isi paket (body).
  // Wajib pakai 'await' karena membaca data kiriman butuh waktu.
  const body = await request.json();

  const newTicket: Ticket = {
    id: Date.now(), // Memberikan ID unik berdasarkan stempel waktu saat ini.
    title: body.title,
    description: body.description,
  };

  // Memasukkan data baru ke dalam daftar tickets (simulasi simpan ke database).
  tickets.push(newTicket);

  // Mengirim balasan sukses dengan status 201 (Created), artinya data berhasil dibuat.
  return NextResponse.json(newTicket, { status: 201 });
};
