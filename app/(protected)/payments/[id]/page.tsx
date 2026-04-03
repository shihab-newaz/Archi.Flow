'use client';

import Link from 'next/link';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useEffect } from 'react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RecordTransactionDialog } from '@/components/payments/RecordTransactionDialog';
import {
  type PaymentMethod,
  useInvoicePaymentQuery,
  usePaymentTransactionsQuery,
  useProjectPaymentSummaryQuery,
} from '@/services';

function centsToMoney(value: number, currency: string) {
  return `${(value / 100).toFixed(2)} ${currency}`;
}

function normalizeDate(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

export default function PaymentDetailPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [methodFilter, setMethodFilter] = useState<PaymentMethod | 'ALL'>(() => {
    const method = searchParams.get('method');
    if (method === 'CASH' || method === 'BANK' || method === 'MOBILE') {
      return method;
    }
    return 'ALL';
  });
  const [dateFrom, setDateFrom] = useState(() => searchParams.get('from') ?? '');
  const [dateTo, setDateTo] = useState(() => searchParams.get('to') ?? '');

  const params = useParams<{ id: string }>();
  const paymentId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const {
    data: payment,
    isLoading: isPaymentLoading,
    isError: isPaymentError,
  } = useInvoicePaymentQuery(paymentId ?? '', Boolean(paymentId));

  const {
    data: transactions = [],
    isLoading: isTransactionsLoading,
    isError: isTransactionsError,
  } = usePaymentTransactionsQuery(paymentId ?? '', Boolean(paymentId));

  const {
    data: projectSummary,
    isLoading: isSummaryLoading,
  } = useProjectPaymentSummaryQuery(payment?.projectId ?? '', Boolean(payment?.projectId));

  useEffect(() => {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (methodFilter === 'ALL') {
      nextParams.delete('method');
    } else {
      nextParams.set('method', methodFilter);
    }

    if (dateFrom) {
      nextParams.set('from', dateFrom);
    } else {
      nextParams.delete('from');
    }

    if (dateTo) {
      nextParams.set('to', dateTo);
    } else {
      nextParams.delete('to');
    }

    const query = nextParams.toString();
    const nextUrl = query ? `${pathname}?${query}` : pathname;
    router.replace(nextUrl, { scroll: false });
  }, [methodFilter, dateFrom, dateTo, router, pathname, searchParams]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      if (methodFilter !== 'ALL' && transaction.method !== methodFilter) {
        return false;
      }

      const transactionDate = new Date(transaction.recordedAt);
      const transactionDay = normalizeDate(transactionDate);

      if (dateFrom) {
        const fromDay = normalizeDate(new Date(dateFrom));
        if (transactionDay < fromDay) {
          return false;
        }
      }

      if (dateTo) {
        const toDay = normalizeDate(new Date(dateTo));
        if (transactionDay > toDay) {
          return false;
        }
      }

      return true;
    });
  }, [transactions, methodFilter, dateFrom, dateTo]);

  if (isPaymentLoading) {
    return <div className="text-sm text-muted-foreground">Loading invoice...</div>;
  }

  if (isPaymentError || !payment) {
    return <div className="text-sm text-destructive">Invoice not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Invoice Details</h2>
          <p className="text-muted-foreground">
            Review invoice status, transaction history, and project payment totals.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {payment.status !== 'PAID' && <RecordTransactionDialog payment={payment} />}
          <Link href="/payments" className="text-sm underline text-muted-foreground hover:text-foreground">
            Back to Payments
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Project</p>
            <p className="font-medium">{payment.projectName || payment.projectId}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Client</p>
            <p className="font-medium">{payment.clientName || payment.clientId}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge variant={payment.status === 'PAID' ? 'secondary' : 'outline'}>{payment.status}</Badge>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Due Date</p>
            <p className="font-medium">
              {payment.dueDate ? new Date(payment.dueDate).toLocaleDateString() : '-'}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="font-medium">{centsToMoney(payment.amountCents, payment.currency)}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Paid</p>
            <p className="font-medium">{centsToMoney(payment.paidCents, payment.currency)}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Outstanding</p>
            <p className="font-medium">{centsToMoney(payment.outstandingCents, payment.currency)}</p>
          </div>
          <div className="space-y-2 md:col-span-2">
            <p className="text-sm text-muted-foreground">Description</p>
            <p className="font-medium">{payment.description || '-'}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Project Payment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {isSummaryLoading || !projectSummary ? (
            <div className="text-sm text-muted-foreground">Loading project summary...</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground">Invoice Total</p>
                <p className="font-medium">{centsToMoney(projectSummary.invoiceTotal, projectSummary.currency)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Paid Total</p>
                <p className="font-medium">{centsToMoney(projectSummary.paidTotal, projectSummary.currency)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Outstanding</p>
                <p className="font-medium">{centsToMoney(projectSummary.outstanding, projectSummary.currency)}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-4">
            <Select value={methodFilter} onValueChange={(value) => setMethodFilter(value as PaymentMethod | 'ALL')}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">ALL METHODS</SelectItem>
                <SelectItem value="CASH">CASH</SelectItem>
                <SelectItem value="BANK">BANK</SelectItem>
                <SelectItem value="MOBILE">MOBILE</SelectItem>
              </SelectContent>
            </Select>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">From</p>
              <Input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} />
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">To</p>
              <Input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} />
            </div>

            <div className="flex items-end">
              <p className="text-xs text-muted-foreground">
                Showing {filteredTransactions.length} of {transactions.length}
              </p>
            </div>
          </div>

          {isTransactionsLoading ? (
            <div className="text-sm text-muted-foreground">Loading transactions...</div>
          ) : isTransactionsError ? (
            <div className="text-sm text-destructive">Failed to load transactions.</div>
          ) : transactions.length === 0 ? (
            <div className="text-sm text-muted-foreground">No transactions recorded yet.</div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-sm text-muted-foreground">No transactions match the current filters.</div>
          ) : (
            <div className="overflow-x-auto border border-border">
              <table className="w-full min-w-160 text-sm">
                <thead className="bg-muted/40">
                  <tr className="text-left text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Method</th>
                    <th className="px-4 py-3 font-medium">Reference</th>
                    <th className="px-4 py-3 font-medium">Recorded By</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-t border-border">
                      <td className="px-4 py-3">{new Date(transaction.recordedAt).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        {centsToMoney(transaction.amountCents, payment.currency)}
                      </td>
                      <td className="px-4 py-3">{transaction.method}</td>
                      <td className="px-4 py-3">{transaction.reference || '-'}</td>
                      <td className="px-4 py-3">{transaction.recorderName || transaction.recordedBy || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
