import { NextResponse } from 'next/server';
import { Trouble, TroubleHistory } from '@/types/tickets/trouble';
import { troubleSchema } from '@/schemas/tickets/trouble';

let tickets: Trouble[] = [];

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

  // Sort by newest
  const sortedTickets = [...tickets].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  return NextResponse.json(sortedTickets);
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();

    // Validasi Zod
    const validation = troubleSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: 'Data tidak valid', errors: validation.error.format() },
        { status: 400 },
      );
    }

    const data = validation.data;
    const now = new Date().toISOString();

    // Construct Data Baru
    const newTicket: Trouble = {
      id: Date.now(), // Simple ID generation
      title: data.title,
      siteId: data.siteId,
      description: data.description || '',
      status: 'open', // status open saat create
      priority: data.priority,
      startTime: data.startTime,
      runHours: data.runHours,
      statusTx: data.statusTx,
      duration: data.duration,
      reporters: data.reporters,
      images: data.images || [],
      createdAt: now,
      updatedAt: now,
      updates: [], // Array kosong saat inisiasi
    };

    tickets.push(newTicket);

    return NextResponse.json(
      { message: 'Tiket berhasil dibuat', data: newTicket },
      { status: 201 },
    );
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
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

    // Validasi Zod
    const validation = troubleSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          message: 'Data update tidak valid',
          errors: validation.error.format(),
        },
        { status: 400 },
      );
    }

    const data = validation.data;
    const index = tickets.findIndex((t) => t.id.toString() === id.toString());

    if (index !== -1) {
      const currentTicket = tickets[index];
      const now = new Date().toISOString();

      // Logic History Update
      // Jika user mengirimkan updateDescription, kita anggap ini progress update
      const newUpdates = [...currentTicket.updates];

      if (data.status !== 'open' && data.updateDescription) {
        const historyItem: TroubleHistory = {
          id: `upd-${Date.now()}`,
          date: now,
          description: data.updateDescription,
          reporters: data.updateReporters || [],
          images: data.updateImages || [],
          status: data.status,
        };
        newUpdates.push(historyItem);
      }

      // Update Data Utama
      // Update field yang boleh berubah (Dynamic fields)
      tickets[index] = {
        ...currentTicket,
        status: data.status,
        runHours: data.runHours || currentTicket.runHours,
        statusTx: data.statusTx || currentTicket.statusTx,
        duration: data.duration || currentTicket.duration,
        updatedAt: now,
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
      { message: 'Gagal memproses update' },
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
