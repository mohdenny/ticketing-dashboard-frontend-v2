import { Ticket } from '@/types/ticket';

const getTickets = async (query: string): Promise<Ticket[]> => {
  // Mengambil data dari API Route kita sendiri
  const res = await fetch('http://localhost:3000/api/tickets', {
    cache: 'no-store',
  });

  if (!res.ok) return [];
  const data: Ticket[] = await res.json();

  // Logika Filtering: Cari berdasarkan ID atau Judul
  if (query) {
    return data.filter(
      (t) =>
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.id?.toString().includes(query),
    );
  }

  return data;
};

interface TicketListProps {
  query: string;
}

export default async function TicketList({ query }: TicketListProps) {
  const tickets = await getTickets(query);

  return (
    <div className="mt-6">
      {query && (
        <p className="mb-4 text-sm text-gray-500 italic">
          Menampilkan hasil pencarian untuk:{' '}
          <span className="font-bold text-black">"{query}"</span>
        </p>
      )}

      {tickets.length > 0 ? (
        <ul className="space-y-4">
          {tickets.map((ticket) => (
            <li
              key={ticket.id}
              className="border p-5 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-gray-800">
                  {ticket.title}
                </h3>
                <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  #{ticket.id}
                </span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {ticket.description}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-20 bg-white border-2 border-dashed rounded-2xl text-gray-400">
          Tidak ada tiket ditemukan.
        </div>
      )}
    </div>
  );
}
