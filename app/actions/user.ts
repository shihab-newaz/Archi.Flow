'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function updateUsername(formData: FormData) {
  const name = formData.get('name') as string;

  if (!name) {
    throw new Error('Name is required');
  }

  db.updateUser({ name });
  revalidatePath('/settings');
  revalidatePath('/'); // Revalidate dashboard as well if name is shown there
}

export async function getUser() {
  return db.getUser();
}
