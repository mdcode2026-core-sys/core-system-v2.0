// src/domain/invoicing/invoicing.queries.ts
// React Query hooks: useInvoice, useInvoicesBySession, useUnpaidInvoices

import { useQuery } from '@tanstack/react-query';

export interface InvoiceRow {
  id: string;
  tenant_id: string;
  session_id: string;
  patient_id: string;
  invoice_number: string;
  subtotal_subunits: number;
  tax_subunits: number;
  discount_subunits: number;
  total_subunits: number;
  paid_subunits: number;
  balance_subunits: number;
  status: string;
  doctor_par_confirmed: boolean;
  collected_reception: boolean;
  match_triangulation: boolean;
}

const INVOICE_KEY = 'invoices';

export function useInvoice(invoiceId: string) {
  return useQuery({
    queryKey: [INVOICE_KEY, invoiceId],
    queryFn: async (): Promise<<InvoiceRow> => {
      throw new Error('Not implemented: wire to Supabase');
    },
    enabled: !!invoiceId,
  });
}

export function useInvoicesBySession(sessionId: string) {
  return useQuery({
    queryKey: [INVOICE_KEY, 'session', sessionId],
    queryFn: async (): Promise<<InvoiceRow[]> => {
      throw new Error('Not implemented: wire to Supabase');
    },
    enabled: !!sessionId,
  });
}

export function useUnpaidInvoicesByPatient(patientId: string) {
  return useQuery({
    queryKey: [INVOICE_KEY, 'unpaid', patientId],
    queryFn: async (): Promise<<InvoiceRow[]> => {
      throw new Error('Not implemented: wire to Supabase');
    },
    enabled: !!patientId,
  });
}
