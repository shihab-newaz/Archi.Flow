'use client';

import { Button } from '@/components/ui/button';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { createProject } from '@/app/actions/project';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function NewProjectSheet() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function onSubmit(formData: FormData) {
    const name = formData.get('name') as string;
    const address = formData.get('address') as string;
    const budget = Number(formData.get('budget'));
    const startDate = formData.get('startDate') as string;
    const phase = formData.get('phase') as any;
    const status = 'Active'; // Default status

    try {
      await createProject({
        name,
        address,
        budget,
        startDate,
        phase,
        status,
        clientId: '1', // Hardcoded for now, ideally select from clients
      });
      setOpen(false);
      toast.success('Project created successfully');
      router.refresh();
    } catch (error) {
      toast.error('Failed to create project');
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[540px]">
        <SheetHeader>
          <SheetTitle>Create New Project</SheetTitle>
          <SheetDescription>
            Add a new architectural project to your portfolio.
          </SheetDescription>
        </SheetHeader>
        <form action={onSubmit} className="space-y-6 mt-8">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input id="name" name="name" placeholder="e.g. Modern Loft Renovation" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Site Address</Label>
            <Input id="address" name="address" placeholder="123 Main St, City" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Budget ($)</Label>
              <Input id="budget" name="budget" type="number" placeholder="150000" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" name="startDate" type="date" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phase">Initial Phase</Label>
            <Select name="phase" defaultValue="Concept" required>
              <SelectTrigger>
                <SelectValue placeholder="Select phase" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Concept">Concept</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Permitting">Permitting</SelectItem>
                <SelectItem value="Construction">Construction</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit">Create Project</Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
