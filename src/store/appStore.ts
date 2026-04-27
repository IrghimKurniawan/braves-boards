import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getBoards, createBoard as apiCreateBoard } from '../services/boardService'
import { getColumns, createColumn as apiCreateColumn } from '../services/columnService'
import { getTasks, createTask as apiCreateTask, deleteTask as apiDeleteTask } from '../services/taskService'

export const useAppStore = defineStore('app', () => {
  // ─── Boards ───────────────────────────────────────────
  const boards = ref<any[]>([])
  const boardsLoaded = ref(false)

  async function fetchBoards(force = false) {
    if (boardsLoaded.value && !force) return
    const res = await getBoards()
    boards.value = Array.isArray(res) ? res : res.items ?? res.data ?? []
    boardsLoaded.value = true
  }

  async function addBoard(title: string) {
    const board = await apiCreateBoard(title)
    boards.value.push(board)
    return board
  }

  // ─── Columns (per board) ──────────────────────────────
  const columnsByBoard = ref<Record<string, any[]>>({})

  async function fetchColumns(boardId: string, force = false) {
    if (columnsByBoard.value[boardId] && !force) return
    try {
      const cols = await getColumns(boardId)
      console.log('RAW cols dari API:', JSON.stringify(cols))  // log semua, bukan hanya cols[0]
      columnsByBoard.value[boardId] = cols.map((col: any) => ({
        id: col.id,
        title: col.title,
        tasks: (col.tasks ?? []).map((task: any) => ({
          id: task.id,
          title: task.title,
          checklist: task.checklist ?? [],
          members: task.members ?? [],
          activity: task.activity ?? [],
          attachments: task.attachments ?? [],
          time: task.time ?? '00:00:00',
          dueDate: task.due_date ?? task.dueDate ?? '-',
          label: task.label ?? null,
          labelClass: task.labelClass ?? null,
          description: task.description ?? '',
          status: task.status ?? 'To Do',
          completed: task.completed ?? false,
        })),
      }))
    } catch (e) {
      console.error('fetchColumns RAW error:', e)
      throw e
    }
  }

  async function addColumn(boardId: string, title: string) {
    const col = await apiCreateColumn(boardId, title)
    const newCol = { id: col.id, title: col.title, tasks: [] }
    if (!columnsByBoard.value[boardId]) columnsByBoard.value[boardId] = []
    columnsByBoard.value[boardId].push(newCol)
    return newCol
  }
  async function fetchTasks(columnId: string) {
    const tasks = await getTasks(columnId)
    // cari column di semua board dan update tasks-nya
    for (const boardId in columnsByBoard.value) {
      const col = columnsByBoard.value[boardId].find((c: any) => c.id === columnId)
      if (col) {
        col.tasks = tasks
        break
      }
    }
  }

  async function addTask(columnId: string, title: string) {
    const task = await apiCreateTask(columnId, title)

    // normalize task agar field tidak undefined
    const normalizedTask = {
      id: task.id,
      title: task.title,
      tasks: [],
      checklist: task.checklist ?? [],
      members: task.members ?? [],
      activity: task.activity ?? [],
      attachments: task.attachments ?? [],
      time: task.time ?? '00:00:00',
      dueDate: task.due_date ?? task.dueDate ?? '-',
      label: task.label ?? null,
      labelClass: task.labelClass ?? null,
      description: task.description ?? '',
      status: task.status ?? 'To Do',
      completed: task.completed ?? false,
    }

    for (const boardId in columnsByBoard.value) {
      const col = columnsByBoard.value[boardId].find((c: any) => c.id === columnId)
      if (col) {
        col.tasks.push(normalizedTask)
        break
      }
    }
    return normalizedTask
  }
  async function removeTask(taskId: string, columnId: string) {
    await apiDeleteTask(taskId)
    for (const boardId in columnsByBoard.value) {
      const col = columnsByBoard.value[boardId].find((c: any) => c.id === columnId)
      if (col) {
        col.tasks = col.tasks.filter((t: any) => t.id !== taskId)
        break
      }
    }
  }

  return {
    boards, boardsLoaded, fetchBoards, addBoard,
    columnsByBoard, fetchColumns, addColumn, fetchTasks, addTask, removeTask,
  }
}, {
  persist: true  // ← ini posisi yang benar
})