'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CreateInvoiceSheet } from '@/components/payments/CreateInvoiceSheet';
import { RecordTransactionDialog } from '@/components/payments/RecordTransactionDialog';
import { useInvoicePaymentsQuery, type PaymentStatus } from '@/services';

function centsToMoney(value: number, currency: string) {
  return `${(value / 100).toFixed(2)} ${currency}`;
}

const statusFilters: Array<PaymentStatus | 'ALL'> = ['ALL', 'PENDING', 'PARTIAL', 'PAID'];

export default function PaymentsPage() {
  const [status, setStatus] = useState<PaymentStatus | 'ALL'>('ALL');
  const [page, setPage] = useState(1);

  const queryStatus = useMemo(() => (status === 'ALL' ? undefined : status), [status]);

  const { data: payments = [], isLoading, isError } = useInvoicePaymentsQuery({
    page,
    limit: 20,
    status: queryStatus,
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Payments</h2>
          <p className="text-muted-foreground">Manage invoices and payment transactions.</p>
        </div>
        <CreateInvoiceSheet />
      </div>

      <div className="flex items-center justify-between gap-3">
        <Select
          value={status}
          onValueChange={(value) => {
            setPage(1);
            setStatus(value as PaymentStatus | 'ALL');
          }}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            {statusFilters.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading payments...</div>
      ) : isError ? (
        <div className="text-sm text-destructive">Failed to load payments.</div>
      ) : payments.length === 0 ? (
        <div className="text-sm text-muted-foreground">No invoices found.</div>
      ) : (
        <div className="overflow-x-auto border border-border">
          <table className="w-full min-w-175 text-sm">
            <thead className="bg-muted/40">
              <tr className="text-left text-muted-foreground">
                <th className="px-4 py-3 font-medium">Project</th>
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Paid</th>
                <th className="px-4 py-3 font-medium">Outstanding</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Due Date</th>
                <th className="px-4 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-t border-border">
                  <td className="px-4 py-3">{payment.projectName || payment.projectId}</td>
                  <td className="px-4 py-3">{payment.clientName || payment.clientId}</td>
                  <td className="px-4 py-3">{centsToMoney(payment.amountCents, payment.currency)}</td>
                  <td className="px-4 py-3">{centsToMoney(payment.paidCents, payment.currency)}</td>
                  <td className="px-4 py-3">{centsToMoney(payment.outstandingCents, payment.currency)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={payment.status === 'PAID' ? 'secondary' : 'outline'}>
                      {payment.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {payment.dueDate ? new Date(payment.dueDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/payments/${payment.id}`}
                        className="text-xs underline text-muted-foreground hover:text-foreground"
                      >
                        View
                      </Link>
                      {payment.status !== 'PAID' ? (
                        <RecordTransactionDialog payment={payment} />
                      ) : (
                        <span className="text-xs text-muted-foreground">Settled</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          className="border border-border px-3 py-1 text-sm disabled:opacity-50"
          disabled={page <= 1}
          onClick={() => setPage((current) => Math.max(1, current - 1))}
        >
          Previous
        </button>
        <button
          type="button"
          className="border border-border px-3 py-1 text-sm"
          onClick={() => setPage((current) => current + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
