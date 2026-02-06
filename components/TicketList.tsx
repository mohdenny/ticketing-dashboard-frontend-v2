import { Ticket } from '@/types/ticket';

// FUNGSI PENGAMBIL DATA (Data Fetching)
const getTickets = async (): Promise<Ticket[]> => {
  const res = await fetch('http://localhost:3000/api/tickets', {
    // no-store: Memberitahu browser/server untuk TIDAK menyimpan cache.
    // Data selalu diambil segar (fresh) dari API setiap kali halaman dibuka.
    cache: 'no-store',
  });

  return res.json();
};

// SERVER COMPONENT
// Karena fungsi ini 'async', Next.js tahu ini adalah Server Component.
export default async function TicketList() {
  const tickets = await getTickets();

  return (
    <ul className="space-y-4">
      {/* Jika data ada, kita gambar list-nya satu per satu menggunakan .map */}
      {tickets.map((ticket) => (
        <li
          key={ticket.id}
          className="border p-4 rounded-lg bg-white shadow-sm"
        >
          <h3 className="font-semibold text-black">{ticket.title}</h3>
          <p className="text-gray-600 text-sm">{ticket.description}</p>
        </li>
      ))}
    </ul>
  );
}
