import { NextResponse } from 'next/server';
import { Ticket } from '@/types/ticket';
import { ticketSchema } from '@/schemas/ticketSchema';

// Mock db
let tickets: Ticket[] = [];

// AMBIL DATA (GET)
export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const ticket = tickets.find((t) => t.id?.toString() === id.toString());
      if (ticket) return NextResponse.json(ticket);
      return NextResponse.json(
        { message: 'Tiket tidak ditemukan' },
        { status: 404 },
      );
    }
    return NextResponse.json(tickets);
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
};

// TAMBAH DATA (POST)
export const POST = async (request: Request) => {
  try {
    const body = await request.json();

    const validation = ticketSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: 'Data tidak valid', errors: validation.error.format() },
        { status: 400 },
      );
    }

    const now = new Date().toISOString();

    const newTicket: Ticket = {
      id: Date.now(),
      title: body.title,
      description: body.description,
      image: body.image,
      status: 'open',
      createdAt: now,
    };

    tickets.push(newTicket);
    return NextResponse.json(
      { message: 'Tiket berhasil dibuat', data: newTicket },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Gagal memproses request' },
      { status: 500 },
    );
  }
};

// UBAH DATA (PUT)
export const PUT = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();

    if (!id)
      return NextResponse.json({ message: 'ID diperlukan' }, { status: 400 });

    const index = tickets.findIndex((t) => t.id?.toString() === id.toString());

    if (index !== -1) {
      const current = tickets[index];

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
        title: body.title ?? current.title,
        description: body.description ?? current.description,
        image: body.image ?? current.image,
        status: body.status ?? current.status,
        updatedAt: new Date().toISOString(),
      };

      return NextResponse.json({
        message: 'Tiket berhasil diperbarui',
        data: tickets[index],
      });
    }
    return NextResponse.json(
      { message: 'Tiket tidak ditemukan' },
      { status: 404 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Terjadi kesalahan server' },
      { status: 500 },
    );
  }
};

// HAPUS DATA (DELETE)
export const DELETE = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id)
    return NextResponse.json({ message: 'ID diperlukan' }, { status: 400 });

  const initialLength = tickets.length;
  tickets = tickets.filter((t) => t.id?.toString() !== id.toString());

  if (tickets.length === initialLength) {
    return NextResponse.json(
      { message: 'Tiket tidak ditemukan' },
      { status: 404 },
    );
  }

  return NextResponse.json({ message: 'Tiket berhasil dihapus' });
};
