import { NextResponse } from 'next/server';

// --- 1. DEFINISI TIPE DATA (DATABASE SCHEMA MOCK) ---
// Ini mencerminkan struktur data yang disimpan di database
export type MaintenanceTicket = {
  id: string;
  // Data Utama
  title: string;
  troubleSource: string;
  category: string;
  startTime: string;
  pic: string;
  siteId?: string;

  // Data Teknis
  networkElement?: string;
  statusTx?: string;
  impactTx?: string;
  estimasiDowntime?: string;
  probableCause?: string;
  broadcastExplanation?: string;
  impactCustomer?: string;
  runHours?: string;

  // Media
  images: string[];

  // System Status
  status: 'Scheduled' | 'open' | 'process' | 'closed' | 'pending';
  createdAt: string;
  updatedAt: string;

  // TIMELINE / RIWAYAT (Array of Logs)
  updates: TicketUpdateLog[];
};

export type TicketUpdateLog = {
  id: string;
  date: string;
  user: string;
  status: string;
  description: string;
  images: string[];
};

// --- 2. IN-MEMORY DATABASE (MOCK DATA STORE) ---
// Data ini akan reset setiap kali server Next.js restart (save file).
// Dalam production, ganti array ini dengan Database (Prisma/MySQL/Mongo).

let maintenanceTickets: MaintenanceTicket[] = [];

// --- 3. API HANDLERS ---

export const dynamic = 'force-dynamic'; // Mencegah caching statis

// [GET] AMBIL DATA (LIST & DETAIL)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  // A. DETAIL BY ID
  if (id) {
    const ticket = maintenanceTickets.find((t) => t.id === id);
    if (!ticket) {
      return NextResponse.json(
        { message: 'Tiket tidak ditemukan' },
        { status: 404 },
      );
    }
    // Urutkan updates dari terbaru ke terlama untuk Timeline
    const sortedTicket = {
      ...ticket,
      updates: ticket.updates.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    };
    return NextResponse.json(sortedTicket);
  }

  // B. LIST ALL
  // Urutkan tiket berdasarkan created terbaru
  const sortedList = [...maintenanceTickets].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  return NextResponse.json(sortedList);
}

// [POST] BUAT TIKET BARU
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const now = new Date().toISOString();
    const newId = `MT-${Date.now()}`; // Generate ID Unik

    const newTicket: MaintenanceTicket = {
      id: newId,
      ...body, // Data dari form (title, pic, dll)
      status: 'Scheduled', // Status default awal
      updates: [
        // Buat log pertama kali tiket dibuat
        {
          id: `LOG-${Date.now()}`,
          date: now,
          user: body.pic || 'System',
          status: 'Scheduled',
          description: 'Tiket Maintenance baru dibuat.',
          images: body.images || [],
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    maintenanceTickets.push(newTicket);

    return NextResponse.json(
      { message: 'Success', data: newTicket },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error creating ticket' },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json(); // Body berisi data form + history data

    if (!id)
      return NextResponse.json({ message: 'ID Required' }, { status: 400 });

    const index = maintenanceTickets.findIndex((t) => t.id === id);
    if (index === -1) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    const currentTicket = maintenanceTickets[index];
    const now = new Date().toISOString();

    // Ekstrak Data History dari Payload Frontend
    // Frontend kirim historyNote, historyUser, historyImages, dll.
    const {
      historyNote,
      historyUser,
      historyImages,
      status: newStatus, // Status baru yang dipilih di dropdown
      ...mainData // Sisa data update (title, networkElement, dll)
    } = body;

    // Logic Update Utama
    const updatedTicket: MaintenanceTicket = {
      ...currentTicket,
      ...mainData, // Update field teknis jika ada perubahan
      status: newStatus || currentTicket.status, // Update status utama
      updatedAt: now,
    };

    // Logic Tambah Timeline (Jika ada catatan atau perubahan status)
    if (historyNote || newStatus !== currentTicket.status) {
      const newLog: TicketUpdateLog = {
        id: `LOG-${Date.now()}`,
        date: now,
        user: historyUser || 'Current User', // Sebaiknya dari session
        status: newStatus || currentTicket.status,
        description: historyNote || `Update status menjadi ${newStatus}`,
        images: historyImages || [], // Foto update
      };

      // Tambahkan log baru ke array updates
      updatedTicket.updates = [newLog, ...currentTicket.updates];
    }

    // Simpan ke Mock DB
    maintenanceTickets[index] = updatedTicket;

    return NextResponse.json({ message: 'Updated', data: updatedTicket });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error updating' }, { status: 500 });
  }
}

// HAPUS TIKET
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id)
    return NextResponse.json({ message: 'ID Required' }, { status: 400 });

  const initialLength = maintenanceTickets.length;
  maintenanceTickets = maintenanceTickets.filter((t) => t.id !== id);

  if (maintenanceTickets.length === initialLength) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Deleted' });
}
