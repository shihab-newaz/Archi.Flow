'use server';

import { db } from '@/lib/db';
import { Client } from '@/types';
import { revalidatePath } from 'next/cache';

export async function getClients() {
  return db.getClients();
}

export async function createClient(data: Omit<Client, 'id'>) {
  const newClient: Client = {
    ...data,
    id: Math.random().toString(36).substring(7),
  };
  db.createClient(newClient);
  revalidatePath('/clients');
  return newClient;
}
