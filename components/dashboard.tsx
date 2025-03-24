"use client"

import { useState, useRef } from "react"
import { TaskList } from "@/components/task-list"
import { TaskModal } from "@/components/task-modal"
import { TaskStats } from "@/components/task-stats"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import type { Task } from "@/lib/types"
import { initialTasks } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"
import { Plus } from "lucide-react"

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { toast, dismiss } = useToast()
  const deletedTaskRef = useRef<Task | null>(null)

  const addTask = (task: Task) => {
    setTasks([...tasks, { ...task, id: Date.now().toString() }])
    toast({
      title: "Task added",
      description: "Your task has been successfully added.",
      duration: 1500,
    })
    setIsModalOpen(false)
  }

  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
    toast({
      title: "Task updated",
      description: "Your task has been successfully updated.",
      duration: 1500,
    })
  }

  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find((task) => task.id === id)
    if (!taskToDelete) return

    // Store the deleted task for potential undo
    deletedTaskRef.current = { ...taskToDelete }

    // Remove the task from the list
    setTasks(tasks.filter((task) => task.id !== id))

    // Show toast with undo button
    const { id: toastId } = toast({
      title: "Task deleted",
      description: "Your task has been removed.",
      duration: 3000,
      action: (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (deletedTaskRef.current) {
              // Make sure we're adding a complete task object
              setTasks((prev) => [...prev, deletedTaskRef.current!])
              deletedTaskRef.current = null

              // Dismiss the current toast
              dismiss(toastId)

              // Show a quick confirmation toast
              toast({
                title: "Task restored",
                description: "Your task has been restored successfully.",
                duration: 1500,
              })
            }
          }}
        >
          Undo
        </Button>
      ),
    })
  }

  const toggleComplete = (id: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          const newStatus = !task.completed
          toast({
            title: newStatus ? "Task completed" : "Task reopened",
            description: newStatus ? "Your task has been marked as complete." : "Your task has been reopened.",
            duration: 1500,
          })
          return { ...task, completed: newStatus }
        }
        return task
      }),
    )
  }

  // Safe filter functions with null checks
  const todayTasks = tasks.filter((task) => {
    if (!task || !task.dueDate) return false
    try {
      const today = new Date()
      const taskDate = new Date(task.dueDate)
      return taskDate.toDateString() === today.toDateString()
    } catch (error) {
      console.error("Error filtering today's tasks:", error)
      return false
    }
  })

  const upcomingTasks = tasks.filter((task) => {
    if (!task || !task.dueDate || task.completed) return false
    try {
      const today = new Date()
      const taskDate = new Date(task.dueDate)
      return taskDate > today
    } catch (error) {
      console.error("Error filtering upcoming tasks:", error)
      return false
    }
  })

  const completedTasks = tasks.filter((task) => task && task.completed)

  return (
    <div className="container mx-auto p-4 space-y-6">
      <header className="py-6">
        <h1 className="text-3xl font-bold tracking-tight">TaskFlow</h1>
        <p className="text-muted-foreground">Organize, prioritize, and track your tasks</p>
      </header>

      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1 w-full md:w-auto">
          <Plus className="h-4 w-4" /> Add Task
        </Button>
      </div>

      <TaskStats tasks={tasks} />

      <div className="space-y-6 mt-6">
        <Tabs defaultValue="all">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <TaskList
              tasks={tasks}
              onToggleComplete={toggleComplete}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
            />
          </TabsContent>

          <TabsContent value="today" className="space-y-4">
            <TaskList
              tasks={todayTasks}
              onToggleComplete={toggleComplete}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
            />
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            <TaskList
              tasks={upcomingTasks}
              onToggleComplete={toggleComplete}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
            />
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <TaskList
              tasks={completedTasks}
              onToggleComplete={toggleComplete}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
            />
          </TabsContent>
        </Tabs>
      </div>

      <TaskModal open={isModalOpen} onOpenChange={setIsModalOpen} onAddTask={addTask} />
    </div>
  )
}

