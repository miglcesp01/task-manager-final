"use client"

import { useState } from "react"
import { format } from "date-fns"
import { motion } from "framer-motion"
import type { Task } from "@/lib/types"
import { getCategoryColor, getPriorityColor } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface TaskCardProps {
  task: Task
  onToggleComplete: (id: string) => void
  onEdit: () => void
  onDelete: (id: string) => void
}

export function TaskCard({ task, onToggleComplete, onEdit, onDelete }: TaskCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // Safe check for dueDate
  let isOverdue = false
  try {
    if (task.dueDate) {
      const taskDate = new Date(task.dueDate)
      taskDate.setHours(0, 0, 0, 0)
      const currentDate = new Date()
      currentDate.setHours(0, 0, 0, 0)
      isOverdue = taskDate < currentDate && !task.completed
    }
  } catch (error) {
    console.error("Error checking if task is overdue:", error)
  }

  const handleDelete = () => {
    setDeleteDialogOpen(false)
    onDelete(task.id)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      layout
    >
      <Card className={`transition-all ${task.completed ? "opacity-70" : ""}`}>
        <CardContent className="p-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => onToggleComplete(task.id)}
                  className="h-5 w-5 flex-shrink-0"
                />
                <h3 className={`font-medium truncate ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                  {task.title}
                </h3>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                <Button variant="ghost" size="icon" onClick={onEdit}>
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setDeleteDialogOpen(true)}>
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pl-8">
              <Badge variant="outline" className={getPriorityColor(task.priority)}>
                {task.priority}
              </Badge>

              <Badge variant="outline" className={getCategoryColor(task.category)}>
                {task.category}
              </Badge>

              {task.dueDate && (
                <Badge variant={isOverdue ? "destructive" : "outline"} className="ml-auto">
                  {isOverdue ? "Overdue" : format(new Date(task.dueDate), "MMM d")}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete the task "{task.title}".</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="py-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
}

