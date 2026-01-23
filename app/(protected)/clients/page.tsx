'use client'

import { useClientsQuery } from '@/services';
import { ClientCard } from '@/components/clients/ClientCard';
import { NewClientSheet } from '@/components/clients/NewClientSheet';

export default function ClientsPage() {
  const { data: clients = [], isLoading, isError } = useClientsQuery();

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading clients...</div>;
  }

  if (isError) {
    return <div className="text-sm text-destructive">Failed to load clients.</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Clients</h2>
          <p className="text-muted-foreground">Manage your client relationships.</p>
        </div>
        <NewClientSheet />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {clients.map((client, index) => (
          <ClientCard key={client.id} client={client} index={index} />
        ))}
      </div>
    </div>
  );
}
