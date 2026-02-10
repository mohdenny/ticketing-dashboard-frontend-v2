import { NextResponse } from 'next/server';
import { Ticket, TicketUpdate } from '@/types/ticket';
import { ticketSchema } from '@/schemas/ticketSchema';

// Mock DB
let tickets: Ticket[] = [];

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    const ticket = tickets.find((t) => t.id.toString() === id.toString());
    if (ticket) return NextResponse.json(ticket);
    return NextResponse.json(
      { message: 'Tiket tidak ditemukan' },
      { status: 404 },
    );
  }
  return NextResponse.json(tickets);
};

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
      images: body.images || [],
      status: 'open', // Default status saat create
      createdAt: now,
      updatedAt: now,
      updates: [],
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

export const PUT = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();

    if (!id)
      return NextResponse.json({ message: 'ID diperlukan' }, { status: 400 });

    const index = tickets.findIndex((t) => t.id.toString() === id.toString());

    if (index !== -1) {
      const current = tickets[index];

      // [LOGIC FIX 1]: Ambil status baru dari body. Jika null/undefined, pakai status lama.
      // Form mengirim status di root body (via spread ...data di hook), jadi body.status pasti ada jika diubah.
      const newStatus = body.status ? body.status : current.status;

      let newUpdates = [...current.updates];

      // [LOGIC FIX 2]: Buat history item hanya jika ada deskripsi update
      if (body.description && body.user) {
        const updateItem: TicketUpdate = {
          id: `upd-${Date.now()}`,
          ticketId: current.id, // [BARU] Simpan Foreign Key
          description: body.description,
          date: new Date().toISOString(),
          user: body.user,
          images: body.images || [],
          status: newStatus, // Simpan snapshot status di history ini
        };
        newUpdates.push(updateItem);
      }

      // [LOGIC FIX 3]: Update Object Tiket Utama
      tickets[index] = {
        ...current,
        status: newStatus, // Update status utama agar tidak 'open' terus
        updatedAt: new Date().toISOString(),
        updates: newUpdates,
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
    console.error('PUT Error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan server' },
      { status: 500 },
    );
  }
};

export const DELETE = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id)
    return NextResponse.json({ message: 'ID diperlukan' }, { status: 400 });

  tickets = tickets.filter((t) => t.id.toString() !== id.toString());
  return NextResponse.json({ message: 'Tiket berhasil dihapus' });
};
