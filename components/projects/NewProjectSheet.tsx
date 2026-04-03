'use client'

import { Button } from '@/components/custom/Button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useCreateProjectMutation } from '@/services'
import { toast } from 'sonner'
import type { ProjectStatus } from '@/services'

// Define a type for project phases to replace 'any'
export function NewProjectSheet() {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<ProjectStatus>('PLANNING')
  const createProjectMutation = useCreateProjectMutation({
    onSuccess: () => {
      setOpen(false)
      toast.success('Project created successfully')
    },
    onError: (error) => {
      toast.error(
        'Failed to create project' +
          (error instanceof Error ? `: ${error.message}` : '.')
      )
    },
  })

  function onSubmit(formData: FormData) {
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const startDate = formData.get('startDate') as string
    const endDate = formData.get('endDate') as string

    createProjectMutation.mutate({
      name,
      description: description || undefined,
      status,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    })
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    onSubmit(formData)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button color="cyan">
          <Button.Icon><Plus className="h-4 w-4" /></Button.Icon>
          <Button.Label>New Project</Button.Label>
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-135">
        <SheetHeader>
          <SheetTitle>Create New Project</SheetTitle>
          <SheetDescription>
            Add a new architectural project to your portfolio.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Modern Loft Renovation"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              placeholder="e.g. Residential high-rise renovation"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" name="startDate" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input id="endDate" name="endDate" type="date" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as ProjectStatus)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PLANNING">PLANNING</SelectItem>
                <SelectItem value="IN_PROGRESS">IN_PROGRESS</SelectItem>
                <SelectItem value="COMPLETED">COMPLETED</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" color="pink" isLoading={createProjectMutation.isPending}>
              <Button.Spinner />
              <Button.Label>Create Project</Button.Label>
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
