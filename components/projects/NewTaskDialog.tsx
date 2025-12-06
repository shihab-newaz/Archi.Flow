'use client'

import Button from '@/components/custom/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
import { useState } from 'react'
import { createTask } from '@/app/actions/task'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { TaskStatus } from '@/types'

interface NewTaskDialogProps {
  projectId: string
  defaultStatus?: TaskStatus
  trigger?: React.ReactNode
}

export function NewTaskDialog({
  projectId,
  defaultStatus = 'To Do',
  trigger,
}: NewTaskDialogProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  async function onSubmit(formData: FormData) {
    const title = formData.get('title') as string
    const dueDate = formData.get('dueDate') as string
    const assignee = formData.get('assignee') as string
    const status = formData.get('status') as TaskStatus

    try {
      await createTask({
        projectId,
        title,
        dueDate,
        assignee,
        status,
      })
      setOpen(false)
      toast.success('Task created successfully')
      router.refresh()
    } catch (error) {
      toast.error(
        'Failed to create task' +
          (error instanceof Error ? `: ${error.message}` : '.')
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            label="Add Task"
            icon={<Plus className="h-4 w-4" />}
            className="w-full scale-75 origin-left"
            color="pink"
          />
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            Create a task for this project phase.
          </DialogDescription>
        </DialogHeader>
        <form action={onSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g. Review structural drawings"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input id="dueDate" name="dueDate" type="date" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={defaultStatus} required>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignee">Assignee (Optional)</Label>
            <Input id="assignee" name="assignee" placeholder="e.g. John Doe" />
          </div>

          <DialogFooter>
            <Button type="submit" label="Create Task" color="cyan" />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
