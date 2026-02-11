import { NextResponse } from 'next/server';
import { TicketTrouble, TicketTroubleUpdate } from '@/types/ticketTrouble';
import { ticketTroubleSchema } from '@/schemas/ticketTroubleSchema';

// Mock DB
let tickets: TicketTrouble[] = [];

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
    const validation = ticketTroubleSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: 'Data tidak valid', errors: validation.error.format() },
        { status: 400 },
      );
    }

    const now = new Date().toISOString();
    const newTicket: TicketTrouble = {
      id: Date.now(),
      title: body.title,
      siteId: body.siteId,
      description: body.description || '',
      status: 'open',
      priority: body.priority || 'Minor',
      images: body.images || [], // Foto Utama
      startTime: body.startTime,
      runHours: body.runHours || '',
      statusTx: body.statusTx || '',
      duration: body.duration || '',
      reporters: body.reporters || [],
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
      const now = new Date().toISOString();

      // Tentukan Status Baru
      const newStatus = body.status ? body.status : current.status;

      let newUpdates = [...current.updates];

      // Logic History Update
      // Cek field history yang baru (historyDescription, historyImages, dll)
      if (body.historyDescription && body.historyUser) {
        const updateItem: TicketTroubleUpdate = {
          id: `upd-${Date.now()}`,
          ticketId: current.id,
          description: body.historyDescription,
          date: now,
          user: body.historyUser,
          // Ambil dari historyImages, BUKAN body.images
          images: body.historyImages || [],
          status: newStatus,
        };
        newUpdates.push(updateItem);
      }

      // Update Data Utama
      tickets[index] = {
        ...current,
        ...body, // Update field lain (runHours, statusTx, dll)
        status: newStatus,
        updatedAt: now,
        updates: newUpdates,
        // Pastikan images utama tetap mengambil body.images (jika diedit) atau tetap current.images
        // Karena logic di useTickets sudah dipisah, body.images sekarang MURNI foto utama
        images: body.images || current.images,
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
