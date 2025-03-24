"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { type Task, TaskCategory, TaskPriority } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { DatePicker } from "@/components/date-picker"

interface TaskEditDialogProps {
  task: Task
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (task: Task) => void
}

export function TaskEditDialog({ task, open, onOpenChange, onSave }: TaskEditDialogProps) {
  const [title, setTitle] = useState(task.title)
  const [date, setDate] = useState<Date | undefined>(new Date(task.dueDate))
  const [category, setCategory] = useState<TaskCategory>(task.category)
  const [priority, setPriority] = useState<TaskPriority>(task.priority)
  const [dateError, setDateError] = useState<string | null>(null)

  // Update state when task changes
  useEffect(() => {
    setTitle(task.title)
    setDate(new Date(task.dueDate))
    setCategory(task.category)
    setPriority(task.priority)
    setDateError(null)
  }, [task])

  const validateDate = (selectedDate: Date | undefined): boolean => {
    if (!selectedDate) {
      setDateError("Date is required")
      return false
    }

    // Check if the date can be converted to ISO string
    try {
      selectedDate.toISOString()
    } catch (error) {
      setDateError("Invalid date value")
      return false
    }

    setDateError(null)
    return true
  }

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate)
    validateDate(newDate)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) return
    if (!validateDate(date)) return

    let isoDate: string
    try {
      isoDate = date!.toISOString()
    } catch (error) {
      setDateError("Invalid date. Please select a valid date.")
      return
    }

    const updatedTask: Task = {
      ...task,
      title,
      description: "", // Empty string instead of using the description state
      dueDate: isoDate,
      category,
      priority,
    }

    onSave(updatedTask)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-[500px] mx-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className={cn("focus-visible:ring-0 focus-visible:ring-offset-0")}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-due-date">Due Date</Label>
                <DatePicker date={date} onDateChange={handleDateChange} error={dateError} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select value={category} onValueChange={(value) => setCategory(value as TaskCategory)}>
                  <SelectTrigger id="edit-category" className="focus-visible:ring-0 focus-visible:ring-offset-0">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(TaskCategory).map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="edit-priority">Priority</Label>
                <Select value={priority} onValueChange={(value) => setPriority(value as TaskPriority)}>
                  <SelectTrigger id="edit-priority" className="focus-visible:ring-0 focus-visible:ring-offset-0">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(TaskPriority).map((pri) => (
                      <SelectItem key={pri} value={pri}>
                        {pri}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter className="py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button type="submit" className="w-full sm:w-auto">
                Save Changes
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

