'use client';

import { Button } from '@/components/custom/Button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { createClient } from '@/app/actions/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function NewClientSheet() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function onSubmit(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const company = formData.get('company') as string;

    try {
      await createClient({
        name,
        email,
        phone,
        company,
      });
      setOpen(false);
      toast.success('Client added successfully');
      router.refresh();
    } catch (error) {
      toast.error('Failed to add client' + (error instanceof Error ? `: ${error.message}` : '.'));
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button color="cyan">
          <Button.Icon><Plus className="h-4 w-4" /></Button.Icon>
          <Button.Label>Add Client</Button.Label>
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[540px]">
        <SheetHeader>
          <SheetTitle>Add New Client</SheetTitle>
          <SheetDescription>
            Create a new client profile for your contacts.
          </SheetDescription>
        </SheetHeader>
        <form action={onSubmit} className="space-y-6 mt-8">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" placeholder="e.g. Alice Johnson" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" name="email" type="email" placeholder="alice@example.com" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" name="phone" placeholder="555-0123" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company (Optional)</Label>
            <Input id="company" name="company" placeholder="e.g. Tech Corp" />
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" color="pink">
              <Button.Label>Add Client</Button.Label>
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
