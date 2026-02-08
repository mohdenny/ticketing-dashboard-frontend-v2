import { NextResponse } from 'next/server';
import { Ticket } from '@/types/ticket';

// Simulasi database sementara di memori server
let tickets: Ticket[] = [];

/**
 * ROUTE HANDLERS
 */

// --- AMBIL DATA (GET) ---
export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    const ticket = tickets.find((t) => t.id?.toString() === id);
    if (ticket) return NextResponse.json(ticket);
    return NextResponse.json(
      { message: 'Tiket tidak ditemukan' },
      { status: 404 },
    );
  }
  return NextResponse.json(tickets);
};

// --- TAMBAH DATA (POST) ---
export const POST = async (request: Request) => {
  const body = await request.json();
  const now = new Date().toISOString();

  const newTicket: Ticket = {
    id: Date.now(),
    title: body.title,
    description: body.description,
    image: body.image,
    status: 'open', // Tiket baru selalu otomatis 'open'
    createdAt: now,
  };

  tickets.push(newTicket);
  return NextResponse.json(
    { message: 'Tiket berhasil dibuat', data: newTicket },
    { status: 201 },
  );
};

// --- UBAH DATA (PUT) ---
export const PUT = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const body = await request.json();
  const index = tickets.findIndex((t) => t.id?.toString() === id);

  if (index !== -1) {
    const current = tickets[index];
    // Logika Status: Tidak bisa balik ke Open jika sudah Process/Closed
    if (current.status !== 'open' && body.status === 'open') {
      return NextResponse.json(
        { message: 'Status tidak bisa kembali ke Open' },
        { status: 400 },
      );
    }
    if (current.status === 'closed' && body.status !== 'closed') {
      return NextResponse.json(
        { message: 'Tiket Closed tidak bisa diubah' },
        { status: 400 },
      );
    }

    tickets[index] = {
      ...current,
      ...body,
      updatedAt: new Date().toISOString(),
    };
    return NextResponse.json({ message: 'Tiket berhasil diperbarui' });
  }
  return NextResponse.json({ message: 'Gagal' }, { status: 404 });
};

// --- HAPUS DATA (DELETE) ---
export const DELETE = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  tickets = tickets.filter((t) => t.id?.toString() !== id);
  return NextResponse.json({ message: 'Tiket berhasil dihapus' });
};
