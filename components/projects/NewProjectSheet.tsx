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
import type { ProjectPhase, ProjectStatus } from '@/types'

// Define a type for project phases to replace 'any'
export function NewProjectSheet() {
  const [open, setOpen] = useState(false)
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
    const address = formData.get('address') as string
    const budget = Number(formData.get('budget'))
    const startDate = formData.get('startDate') as string
    const phaseValue = formData.get('phase') as string
    const phase = phaseValue as ProjectPhase
    const status: ProjectStatus = 'Active'

    createProjectMutation.mutate({
      name,
      address,
      budget,
      startDate,
      phase,
      status,
      clientId: '1',
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
      <SheetContent className="sm:max-w-[540px]">
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
            <Label htmlFor="address">Site Address</Label>
            <Input
              id="address"
              name="address"
              placeholder="123 Main St, City"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Budget ($)</Label>
              <Input
                id="budget"
                name="budget"
                type="number"
                placeholder="150000"
                required
              />
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
