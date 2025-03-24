"use client"

import type React from "react"
import { useState } from "react"
import { type Task, TaskCategory, TaskPriority } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { DatePicker } from "@/components/date-picker"

interface TaskModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddTask: (task: Task) => void
}

export function TaskModal({ open, onOpenChange, onAddTask }: TaskModalProps) {
  const [title, setTitle] = useState("")
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [category, setCategory] = useState<TaskCategory>(TaskCategory.PERSONAL)
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM)
  const [dateError, setDateError] = useState<string | null>(null)

  const validateDate = (selectedDate: Date | undefined): boolean => {
    if (!selectedDate) {
      setDateError("Date is required")
      return false
    }

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

  const resetForm = () => {
    setTitle("")
    setDate(new Date())
    setCategory(TaskCategory.PERSONAL)
    setPriority(TaskPriority.MEDIUM)
    setDateError(null)
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm()
    }
    onOpenChange(open)
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

    const newTask: Task = {
      id: "",
      title,
      description: "", // Empty string instead of using the description state
      dueDate: isoDate,
      category,
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
    }

    onAddTask(newTask)
    resetForm()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-[500px] mx-auto" aria-describedby={undefined}>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className={cn("focus-visible:ring-0 focus-visible:ring-offset-0")}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="due-date">Due Date</Label>
                <DatePicker date={date} onDateChange={handleDateChange} error={dateError} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={(value) => setCategory(value as TaskCategory)}>
                  <SelectTrigger id="category" className="focus-visible:ring-0 focus-visible:ring-offset-0">
                    <SelectValue placeholder="Select category" />
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
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={(value) => setPriority(value as TaskPriority)}>
                  <SelectTrigger id="priority" className="focus-visible:ring-0 focus-visible:ring-offset-0">
                    <SelectValue placeholder="Select priority" />
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
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button type="submit" className="w-full sm:w-auto">
                Add Task
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

