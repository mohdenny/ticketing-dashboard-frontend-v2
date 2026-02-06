import TicketForm from '@/components/TicketForm';
import TicketList from '@/components/TicketList';

export default function TicketsPage() {
  return (
    <section>
      <h1 className="text-2xl font-bold mb-6">Dashboard Ticket</h1>

      <TicketForm />
      <TicketList />
    </section>
  );
}
