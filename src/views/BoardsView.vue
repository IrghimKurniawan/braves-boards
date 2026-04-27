<template>
  <Layout>
    <div class="flex gap-3 overflow-x-auto pb-4 px-1">

      <!-- Column -->
      <div v-for="(board, index) in boards" :key="index"
        class="min-w-[260px] max-w-[260px] flex flex-col rounded-xl border border-gray-200 bg-gray-50"
        style="max-height: calc(100vh - 120px)">
        <!-- Column Header -->
        <div class="flex items-center justify-between px-3 py-2.5 border-b border-gray-200">
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium text-gray-700">{{ board.title }}</span>
            <span class="text-xs text-gray-400 bg-white border border-gray-200 rounded-full px-2 py-0.5 leading-none">
              {{ board.tasks.length }}
            </span>
          </div>
          <span class="text-gray-400 text-base cursor-pointer hover:text-gray-600 leading-none select-none">···</span>
        </div>

        <!-- Task Cards -->
        <div class="flex-1 overflow-y-auto px-2.5 py-2 flex flex-col gap-2">
          <div v-if="board.tasks.length === 0" class="text-xs text-gray-400 text-center py-8">
            No tasks
          </div>

          <div v-for="(task, i) in board.tasks" :key="i"
            class="bg-white rounded-lg border border-gray-200 p-3 cursor-pointer hover:border-gray-300 hover:shadow-sm transition-all"
            @click="openModal(task)">
            <!-- Label tag -->
            <span v-if="task.label" class="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full mb-2"
              :class="task.labelClass ?? 'bg-purple-50 text-purple-700'">{{ task.label }}</span>

            <!-- Title -->
            <p class="text-sm font-medium text-gray-800 leading-snug mb-2">{{ task.title }}</p>

            <!-- Checklist progress -->
            <div v-if="task.checklist.length > 0" class="flex items-center gap-2 mb-2.5">
              <div class="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full bg-emerald-500 rounded-full transition-all"
                  :style="{ width: Math.round((task.checklist.filter(c => c.done).length / task.checklist.length) * 100) + '%' }">
                </div>
              </div>
              <span class="text-[10px] text-gray-400 tabular-nums">
                {{task.checklist.filter(c => c.done).length}}/{{ task.checklist.length }}
              </span>
            </div>

            <!-- Bottom row: avatars + timer -->
            <div class="flex items-center justify-between">
              <!-- Avatars -->
              <div class="flex">
                <div v-for="(m, mi) in task.members.slice(0, 3)" :key="mi"
                  class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium border-2 border-white"
                  :class="m.color || 'bg-blue-100 text-blue-700'" :style="mi > 0 ? 'margin-left: -6px' : ''"
                  :title="m.name">{{ m.initial }}</div>
              </div>

              <!-- Timer -->
              <div class="flex items-center gap-1.5">
                <div class="flex items-center gap-1 text-[11px] tabular-nums"
                  :class="activeTimerTaskId === task.id ? 'text-emerald-600 font-medium' : 'text-gray-400'">
                  <span class="w-1.5 h-1.5 rounded-full"
                    :class="activeTimerTaskId === task.id ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'"></span>
                  {{ task.time || '00:00:00' }}
                </div>
                <button class="text-[11px] px-2 py-0.5 rounded-full border transition" :class="activeTimerTaskId === task.id
                  ? 'border-red-200 text-red-500 bg-red-50 hover:bg-red-100'
                  : 'border-gray-200 text-gray-500 hover:bg-gray-100'" @click.stop="handleTimerToggle(task)">
                  {{ activeTimerTaskId === task.id ? 'Stop' : 'Start' }}
                </button>
              </div>
            </div>

            <!-- Due date -->
            <div v-if="task.dueDate && task.dueDate !== '-'"
              class="mt-2 text-[10px] text-gray-400 flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {{ task.dueDate }}
            </div>
          </div>
        </div>

        <!-- Add Card button -->
        <button
          class="mx-2.5 mb-2.5 mt-1 text-left text-xs text-gray-400 border border-dashed border-gray-200 rounded-lg py-2 px-3 hover:bg-white hover:text-gray-600 hover:border-gray-300 transition">
          + Add card
        </button>
      </div>

      <!-- Add Board -->
      <div class="min-w-[240px] flex-shrink-0 pt-0.5">
        <div v-if="!showNewBoard">
          <button @click="showNewBoard = true"
            class="w-full text-sm text-gray-400 border border-dashed border-gray-300 rounded-xl py-3 hover:border-blue-400 hover:text-blue-500 transition">
            + Add board
          </button>
        </div>
        <div v-else class="bg-gray-50 rounded-xl border border-gray-200 p-3">
          <input v-model="newBoardTitle" @keyup.enter="handleCreateBoard"
            @keyup.esc="showNewBoard = false; newBoardTitle = ''" placeholder="Board title..." autofocus
            class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400 transition mb-2 bg-white" />
          <div class="flex gap-2">
            <button @click="handleCreateBoard" :disabled="boardCreating || !newBoardTitle.trim()"
              class="flex-1 bg-blue-500 text-white text-xs py-1.5 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition">
              {{ boardCreating ? 'Creating...' : 'Add board' }}
            </button>
            <button @click="showNewBoard = false; newBoardTitle = ''"
              class="text-xs text-gray-400 px-2 hover:text-gray-600">✕</button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL (tidak diubah) -->
    <Teleport to="body">
      <div v-if="selectedTask" class="fixed inset-0 z-50 flex items-center justify-center"
        style="background: rgba(0,0,0,0.65)" @click.self="closeModal">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 flex flex-col overflow-hidden"
          style="max-height: 90vh" @click="closeAllDropdowns">

          <!-- Top Bar -->
          <div class="flex items-center justify-between px-5 py-3 border-b border-gray-100 flex-shrink-0">
            <div class="relative">
              <button @click.stop="closeAllDropdowns(); statusOpen = !statusOpen"
                class="flex items-center gap-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition">
                {{ selectedTask.status }}
                <svg class="w-3 h-3" viewBox="0 0 10 6" fill="currentColor">
                  <path d="M0 0l5 6 5-6z" />
                </svg>
              </button>
              <div v-if="statusOpen"
                class="absolute left-0 top-10 bg-white border border-gray-200 rounded-xl shadow-xl z-20 py-1 min-w-[140px]">
                <button v-for="s in statuses" :key="s" @click.stop="selectedTask.status = s; statusOpen = false"
                  class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition"
                  :class="selectedTask.status === s ? 'text-blue-600 font-semibold' : 'text-gray-700'">{{ s }}</button>
              </div>
            </div>
            <div class="flex items-center gap-1">
              <button
                class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition">
                <font-awesome-icon icon="image" />
              </button>
              <button class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition"
                :class="selectedTask._watching ? 'text-blue-500' : 'text-gray-500'" @click.stop="toggleWatch">
                <font-awesome-icon icon="eye" />
              </button>
              <div class="relative">
                <button @click.stop="closeAllDropdowns(); ellipsisOpen = !ellipsisOpen"
                  class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition">
                  <font-awesome-icon icon="ellipsis-h" />
                </button>
                <div v-if="ellipsisOpen"
                  class="absolute right-0 top-10 bg-white border border-gray-200 rounded-xl shadow-xl z-20 w-52 py-1.5 overflow-hidden">
                  <template v-for="item in ellipsisMenuItems" :key="item.action">
                    <div v-if="item.action === 'share'" class="border-t border-gray-100 my-1"></div>
                    <button @click.stop="handleEllipsisAction(item.action)"
                      class="w-full flex items-center gap-3 px-4 py-2 text-sm transition"
                      :class="item.danger ? 'text-red-500 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-50'">
                      {{ item.label }}
                    </button>
                  </template>
                </div>
              </div>
              <button @click.stop="closeModal"
                class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition ml-1">
                <font-awesome-icon icon="times" />
              </button>
            </div>
          </div>

          <!-- Body -->
          <div class="flex flex-1 overflow-hidden">
            <!-- LEFT -->
            <div class="flex-1 overflow-y-auto px-6 py-5">
              <div class="flex items-start gap-3 mb-5">
                <button @click.stop="selectedTask.completed = !selectedTask.completed"
                  class="mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 transition"
                  :class="selectedTask.completed ? 'bg-blue-600 border-blue-600' : 'border-gray-400'">
                  <svg v-if="selectedTask.completed" class="w-full h-full text-white p-0.5" fill="none"
                    stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <h2 contenteditable="true" @blur="e => selectedTask.title = e.target.innerText"
                  class="text-xl font-bold text-gray-900 outline-none border-b-2 border-transparent focus:border-blue-400 flex-1 leading-tight">
                  {{ selectedTask.title }}</h2>
              </div>

              <div class="flex flex-wrap gap-2 mb-6">
                <div class="relative">
                  <button @click.stop="closeAllDropdowns(); addMenuOpen = !addMenuOpen"
                    class="flex items-center gap-1.5 text-xs border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-50 text-gray-600 transition font-medium">
                    <font-awesome-icon icon="plus" /> Add
                  </button>
                  <div v-if="addMenuOpen"
                    class="absolute left-0 top-9 bg-white border border-gray-200 rounded-xl shadow-xl z-20 w-64 overflow-hidden">
                    <div class="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
                      <span class="text-xs font-semibold text-gray-500">Add to card</span>
                      <button @click.stop="addMenuOpen = false" class="text-gray-400 hover:text-gray-600">✕</button>
                    </div>
                    <div class="py-1">
                      <button v-for="item in addMenuItems" :key="item.action" @click.stop="handleAddAction(item.action)"
                        class="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition text-left">
                        <div
                          class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-600 text-xs">
                          +</div>
                        <div>
                          <p class="text-sm font-medium text-gray-800">{{ item.label }}</p>
                          <p class="text-xs text-gray-400 mt-0.5">{{ item.desc }}</p>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  class="flex items-center gap-1.5 text-xs border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-50 text-gray-600 transition">
                  <font-awesome-icon icon="tag" /> Labels
                </button>
                <button @click.stop="closeAllDropdowns(); showAddChecklist = !showAddChecklist"
                  class="flex items-center gap-1.5 text-xs border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-50 text-gray-600 transition">
                  <font-awesome-icon icon="check-square" /> Checklist
                </button>
                <button @click.stop="showAttachPanel = !showAttachPanel; showTimerLogs = false"
                  class="flex items-center gap-1.5 text-xs border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-50 text-gray-600 transition"
                  :class="showAttachPanel ? 'bg-gray-100 border-gray-400' : ''">
                  <font-awesome-icon icon="paperclip" /> Attachment
                </button>
                <button @click.stop="handleFetchTimerLogs(selectedTask.id); showAttachPanel = false"
                  class="flex items-center gap-1.5 text-xs border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-50 text-gray-600 transition"
                  :class="showTimerLogs ? 'bg-gray-100 border-gray-400' : ''">
                  <font-awesome-icon icon="clock" /> Timer Logs
                </button>
              </div>

              <div class="flex gap-8 mb-6">
                <div>
                  <p class="text-xs text-gray-500 font-medium mb-2">Members</p>
                  <div class="flex items-center gap-1.5">
                    <div v-for="(m, i) in selectedTask.members" :key="i"
                      class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      :class="m.color" :title="m.name">{{ m.initial }}</div>
                    <button
                      class="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-blue-400 text-sm">+</button>
                  </div>
                </div>
                <div>
                  <p class="text-xs text-gray-500 font-medium mb-2">Due date</p>
                  <button
                    class="flex items-center gap-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition">
                    {{ selectedTask.dueDate }}
                    <svg class="w-3 h-3" viewBox="0 0 10 6" fill="currentColor">
                      <path d="M0 0l5 6 5-6z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div v-if="selectedTask.attachments?.length > 0" class="mb-6">
                <div class="flex items-center gap-2 mb-2">
                  <font-awesome-icon icon="paperclip" class="text-gray-400 text-xs" />
                  <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Attachments</p>
                </div>
                <div class="space-y-2">
                  <div v-for="(att, i) in selectedTask.attachments" :key="i"
                    class="flex items-center justify-between gap-2 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 group hover:border-gray-300 transition">
                    <div class="flex items-center gap-3 min-w-0">
                      <img v-if="att.url && att.type === 'image'" :src="att.url"
                        class="w-12 h-12 rounded object-cover flex-shrink-0 border border-gray-200" />
                      <div v-else
                        class="w-12 h-12 rounded bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
                        <font-awesome-icon icon="paperclip" class="text-gray-400" />
                      </div>
                      <div class="min-w-0">
                        <a v-if="att.url" :href="att.url" target="_blank"
                          class="text-xs font-medium text-blue-600 hover:underline block truncate max-w-[200px]">{{
                          att.title ??
                          att.url }}</a>
                        <p v-else class="text-xs font-medium text-gray-700 truncate">{{ att.title ?? '-' }}</p>
                        <p class="text-xs text-gray-400 mt-0.5">{{ att.type === 'image' ? 'Image' : att.type === 'link'
                          ? 'Link' :
                          'File' }}</p>
                      </div>
                    </div>
                    <button @click="handleDeleteAttachment(att.id, i)"
                      class="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition text-xs flex-shrink-0 px-1"
                      title="Delete">✕</button>
                  </div>
                </div>
              </div>

              <div class="mb-6 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <font-awesome-icon icon="clock" class="text-gray-500 text-sm" />
                    <p class="text-sm font-semibold text-gray-700">Time Tracker</p>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-mono font-semibold"
                      :class="activeTimerTaskId === selectedTask.id ? 'text-green-600' : 'text-gray-500'">
                      {{ activeTimerTaskId === selectedTask.id ? formatTimer(timerSeconds[selectedTask.id] || 0) :
                        (selectedTask.time || '00:00:00') }}
                    </span>
                    <button @click.stop="handleTimerToggle(selectedTask)"
                      class="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition"
                      :class="activeTimerTaskId === selectedTask.id ? 'bg-red-100 text-red-600 hover:bg-red-200 border border-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200'">
                      <font-awesome-icon :icon="activeTimerTaskId === selectedTask.id ? 'stop' : 'play'" />
                      {{ activeTimerTaskId === selectedTask.id ? 'Stop' : 'Start' }}
                    </button>
                    <button v-if="activeTimerTaskId === selectedTask.id"
                      @click.stop="handleConfirmTimer(selectedTask.id)"
                      class="text-xs text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition">
                      Confirm
                    </button>
                  </div>
                </div>
              </div>

              <div class="mb-6">
                <div class="flex items-center gap-2 mb-2">
                  <font-awesome-icon icon="align-left" class="text-gray-500 text-sm" />
                  <p class="text-sm font-semibold text-gray-700">Description</p>
                </div>
                <textarea v-model="selectedTask.description" placeholder="Add a more detailed description..." rows="3"
                  class="w-full text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-blue-400 resize-none transition placeholder-gray-400"></textarea>
              </div>

              <div v-if="selectedTask.checklist.length > 0 || showAddChecklist" class="mb-6">
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <font-awesome-icon icon="check-square" class="text-gray-500 text-sm" />
                    <input v-model="selectedTask.checklistTitle" placeholder="Checklist title..."
                      class="text-sm font-semibold text-gray-700 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-400 outline-none transition w-40" />
                  </div>
                  <div class="flex gap-2">
                    <button @click="hideChecked = !hideChecked"
                      class="text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-1 hover:bg-gray-50 transition">{{
                        hideChecked ? 'Show checked' : 'Hide checked' }}</button>
                    <button @click="selectedTask.checklist = []"
                      class="text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-1 hover:bg-gray-50 transition">Delete</button>
                  </div>
                </div>
                <div class="flex items-center gap-2 mb-3">
                  <span class="text-xs text-gray-500 w-8">{{ checklistProgress }}%</span>
                  <div class="flex-1 bg-gray-200 rounded-full h-1.5">
                    <div class="bg-blue-500 h-1.5 rounded-full transition-all"
                      :style="{ width: checklistProgress + '%' }"></div>
                  </div>
                </div>
                <div class="space-y-2">
                  <div v-for="(item, i) in visibleChecklist" :key="i" class="flex items-center gap-3">
                    <input type="checkbox" v-model="item.done"
                      @change="logActivity(`completed ${item.label} on this card`)"
                      class="w-4 h-4 rounded accent-blue-600 cursor-pointer flex-shrink-0" />
                    <span class="text-sm" :class="item.done ? 'line-through text-gray-400' : 'text-gray-700'">{{
                      item.label
                      }}</span>
                  </div>
                </div>
                <div v-if="showAddChecklist" class="mt-3 flex gap-2">
                  <input v-model="newCheckItem" @keyup.enter="addCheckItem" placeholder="Add an item..."
                    class="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:border-blue-400 transition" />
                  <button @click="addCheckItem"
                    class="bg-blue-500 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-blue-600 transition">Add</button>
                  <button @click="showAddChecklist = false; newCheckItem = ''"
                    class="text-xs text-gray-500 px-2 hover:text-gray-700">✕</button>
                </div>
              </div>
            </div>

            <!-- RIGHT: Comments -->
            <div class="w-72 border-l border-gray-100 flex flex-col flex-shrink-0">
              <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <div class="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <font-awesome-icon icon="comment-alt" class="text-gray-400" />
                  Comments and activity
                </div>
                <button @click="showActivity = !showActivity"
                  class="text-xs text-gray-500 border border-gray-200 rounded-lg px-2 py-1 hover:bg-gray-50 transition">
                  {{ showActivity ? 'Hide' : 'Show' }}
                </button>
              </div>
              <div class="px-4 py-3 border-b border-gray-100">
                <input v-model="newComment" @keyup.enter="handleAddComment" :disabled="commentLoading"
                  placeholder="Write a comment..."
                  class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400 transition placeholder-gray-400 disabled:opacity-50" />
                <button @click="handleAddComment" :disabled="commentLoading || !newComment.trim()"
                  class="mt-2 w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-medium py-1.5 rounded-lg transition">
                  {{ commentLoading ? 'Sending...' : 'Send' }}
                </button>
              </div>
              <div class="flex-1 overflow-y-auto px-4 py-3 space-y-4">
                <div v-for="(act, i) in selectedTask.activity" :key="i" class="flex gap-2.5 group">
                  <div
                    class="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white mt-0.5"
                    :class="act.color || 'bg-blue-500'">{{ act.initial }}</div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-baseline gap-1 flex-wrap justify-between">
                      <div class="flex items-baseline gap-1">
                        <span class="text-xs font-semibold text-gray-800">{{ act.author }}</span>
                        <span class="text-xs text-gray-500">{{ act.action }}</span>
                      </div>
                      <button v-if="act.comment && act.id" @click="handleDeleteComment(act.id, i)"
                        class="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition text-xs"
                        title="Delete">✕</button>
                    </div>
                    <p class="text-xs text-blue-500 mt-0.5">{{ act.date }}</p>
                    <div v-if="act.comment" class="mt-1.5 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                      <p class="text-xs font-medium text-blue-600">{{ act.comment.title }}</p>
                      <p class="text-xs text-gray-600 mt-0.5">{{ act.comment.body }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Attachment Panel -->
          <div v-if="showAttachPanel" class="border-t border-gray-100 px-6 py-4 bg-gray-50 flex-shrink-0">
            <div class="flex items-center justify-between mb-3">
              <p class="text-sm font-semibold text-gray-700">Add Attachment</p>
              <button @click="showAttachPanel = false; showAttachLink = false"
                class="text-gray-400 hover:text-gray-600 text-xs">✕
                Close</button>
            </div>
            <div class="flex gap-2 flex-wrap">
              <label
                class="cursor-pointer flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-600 hover:bg-white transition">
                <font-awesome-icon icon="paperclip" />
                {{ attachFileLoading ? 'Uploading...' : 'Upload File' }}
                <input type="file" class="hidden" @change="handleUploadFile" :disabled="attachFileLoading" />
              </label>
              <button @click="showAttachLink = !showAttachLink"
                class="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-600 hover:bg-white transition">
                🔗 Add Link
              </button>
            </div>
            <div v-if="showAttachLink" class="mt-3 flex flex-col gap-2">
              <input v-model="attachLinkTitle" placeholder="Title"
                class="text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:border-blue-400 transition" />
              <input v-model="attachLinkUrl" placeholder="https://..."
                class="text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:border-blue-400 transition" />
              <button @click="handleAddLink"
                :disabled="attachLinkLoading || !attachLinkTitle.trim() || !attachLinkUrl.trim()"
                class="bg-blue-500 text-white text-xs py-1.5 rounded-lg hover:bg-blue-600 disabled:opacity-40 transition">
                {{ attachLinkLoading ? 'Adding...' : 'Add Link' }}
              </button>
            </div>
          </div>

          <!-- Timer Logs Panel -->
          <div v-if="showTimerLogs"
            class="border-t border-gray-100 px-6 py-4 bg-gray-50 flex-shrink-0 max-h-48 overflow-y-auto">
            <div class="flex items-center justify-between mb-2">
              <p class="text-sm font-semibold text-gray-700">Timer Logs</p>
              <button @click="showTimerLogs = false" class="text-gray-400 hover:text-gray-600 text-xs">✕</button>
            </div>
            <div v-if="timerLogsLoading" class="text-xs text-gray-400">Loading...</div>
            <div v-else-if="timerLogs.length === 0" class="text-xs text-gray-400">No logs yet.</div>
            <div v-else class="space-y-1.5">
              <div v-for="(log, i) in timerLogs" :key="i"
                class="flex justify-between text-xs text-gray-600 border-b border-gray-100 pb-1">
                <span>{{ log.started_at ?? log.start ?? '-' }}</span>
                <span class="font-medium text-gray-800">{{ log.duration ?? '-' }}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Teleport>

    <!-- Toast -->
    <Teleport to="body">
      <Transition name="toast">
        <div v-if="toast"
          class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-gray-900 text-white text-sm px-5 py-2.5 rounded-xl shadow-lg pointer-events-none">
          {{ toast }}
        </div>
      </Transition>
    </Teleport>
  </Layout>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, computed, onMounted, onUnmounted } from "vue";
import Layout from "../components/AppLayout.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faClock, faPlay, faStop, faPlus, faTag, faCheckSquare, faPaperclip,
  faAlignLeft, faEye, faImage, faEllipsisH, faTimes, faCommentAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
  addComment as apiAddComment,
  deleteComment as apiDeleteComment,
  uploadAttachmentFile as apiUploadFile,
  addAttachmentLink as apiAddLink,
  deleteAttachment as apiDeleteAttachment,
} from '../services/boardService';
import {
  startTimer as apiStartTimer,
  stopTimer as apiStopTimer,
  pingTimer as apiPingTimer,
  confirmTimer as apiConfirmTimer,
  getTimerLogs as apiGetTimerLogs,
} from '../services/timerService';
import {
  getColumns,
  createColumn,
  deleteColumn,
} from '../services/columnService';

library.add(faClock, faPlay, faStop, faPlus, faTag, faCheckSquare, faPaperclip, faAlignLeft, faEye, faImage, faEllipsisH, faTimes, faCommentAlt);

const route = useRoute();
const boardId = route.params.boardId;

// ─── UI State ──────────────────────────────────────────────────
const selectedTask = ref(null);
const statusOpen = ref(false);
const ellipsisOpen = ref(false);
const addMenuOpen = ref(false);
const showAddChecklist = ref(false);
const newCheckItem = ref("");
const newComment = ref("");
const commentLoading = ref(false);
const showAttachPanel = ref(false);
const showAttachLink = ref(false);
const attachLinkTitle = ref("");
const attachLinkUrl = ref("");
const attachLinkLoading = ref(false);
const attachFileLoading = ref(false);
const hideChecked = ref(false);
const showActivity = ref(true);
const toast = ref("");
const showNewBoard = ref(false);
const newBoardTitle = ref("");
const boardCreating = ref(false);

// ─── Timer State ───────────────────────────────────────────────
const activeTimerTaskId = ref(null);
const timerSeconds = ref({});
const timerLogs = ref([]);
const showTimerLogs = ref(false);
const timerLogsLoading = ref(false);
let tickInterval = null;
let pingInterval = null;

function formatTimer(seconds) {
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function findTaskById(id) {
  for (const board of boards.value) {
    const t = board.tasks?.find(t => t.id === id);
    if (t) return t;
  }
  return null;
}

function startTick(taskId) {
  if (tickInterval) clearInterval(tickInterval);
  tickInterval = setInterval(() => {
    timerSeconds.value[taskId] = (timerSeconds.value[taskId] || 0) + 1;
    const task = findTaskById(taskId);
    if (task) task.time = formatTimer(timerSeconds.value[taskId]);
  }, 1000);
}

function stopTick() {
  if (tickInterval) { clearInterval(tickInterval); tickInterval = null; }
}

function startPing(taskId) {
  if (pingInterval) clearInterval(pingInterval);
  pingInterval = setInterval(async () => {
    try { await apiPingTimer(taskId); } catch { }
  }, 30000);
}

function stopPing() {
  if (pingInterval) { clearInterval(pingInterval); pingInterval = null; }
}

async function handleTimerToggle(task) {
  if (!task.id) { showToast("Task ID belum tersedia."); return; }
  if (activeTimerTaskId.value && activeTimerTaskId.value !== task.id) {
    await doStopTimer(activeTimerTaskId.value);
  }
  if (activeTimerTaskId.value === task.id) {
    await doStopTimer(task.id);
  } else {
    try {
      await apiStartTimer(task.id);
      activeTimerTaskId.value = task.id;
      if (!timerSeconds.value[task.id]) timerSeconds.value[task.id] = 0;
      localStorage.setItem('active_timer_task_id', task.id);
      localStorage.setItem('active_timer_task_title', task.title ?? '');
      startTick(task.id);
      startPing(task.id);
      logActivity("started timer on this card");
      showToast("Timer started ▶");
    } catch (e) {
      showToast(e?.response?.data?.error?.message || "Gagal memulai timer.");
    }
  }
}

async function doStopTimer(taskId) {
  try {
    await apiStopTimer(taskId);
    stopTick();
    stopPing();
    const elapsed = timerSeconds.value[taskId] || 0;
    activeTimerTaskId.value = null;
    localStorage.removeItem('active_timer_task_id');
    localStorage.removeItem('active_timer_task_title');
    const task = findTaskById(taskId);
    if (task) logActivityOn(task, `stopped timer — ${formatTimer(elapsed)}`);
    showToast(`Timer stopped ⏹ — ${formatTimer(elapsed)}`);
  } catch (e) {
    showToast(e?.response?.data?.error?.message || "Gagal menghentikan timer.");
  }
}

async function handleConfirmTimer(taskId) {
  try {
    await apiConfirmTimer(taskId);
    showToast("Timer confirmed ✓");
  } catch (e) {
    showToast(e?.response?.data?.error?.message || "Gagal konfirmasi timer.");
  }
}

async function handleFetchTimerLogs(taskId) {
  if (!taskId) return;
  timerLogsLoading.value = true;
  showTimerLogs.value = true;
  try {
    timerLogs.value = await apiGetTimerLogs(taskId);
  } catch {
    showTimerLogs.value = false;
    showToast("Gagal memuat timer logs.");
  } finally {
    timerLogsLoading.value = false;
  }
}

const boards = ref([]);

async function initBoards() {
  if (!boardId) { showToast("Board ID tidak ditemukan."); return; }
  try {
    const columns = await getColumns(boardId);
    boards.value = columns.map((col) => ({
      id: col.id,
      title: col.title,
      tasks: col.tasks ?? [],
    }));
  } catch (e) {
    console.error(e);
    showToast("Gagal memuat columns.");
  }
}

async function handleCreateBoard() {
  if (!newBoardTitle.value.trim() || boardCreating.value) return;
  boardCreating.value = true;
  try {
    const title = newBoardTitle.value.trim();
    const newCol = await createColumn(boardId, title);
    boards.value.push({ id: newCol.id, title: newCol.title, tasks: [] });
    newBoardTitle.value = "";
    showNewBoard.value = false;
    showToast(`Board "${newCol.title}" created!`);
  } catch (e) {
    showToast(e?.response?.data?.error?.message || "Gagal membuat board.");
  } finally {
    boardCreating.value = false;
  }
}

onMounted(initBoards);
onUnmounted(() => { stopTick(); stopPing(); });

function closeAllDropdowns() {
  statusOpen.value = false;
  ellipsisOpen.value = false;
  addMenuOpen.value = false;
}

const ellipsisMenuItems = [
  { label: "Leave", action: "leave", danger: false },
  { label: "Move", action: "move", danger: false },
  { label: "Copy", action: "copy", danger: false },
  { label: "Mirror", action: "mirror", danger: false },
  { label: "Make template", action: "template", danger: false },
  { label: "Watch", action: "watch", danger: false },
  { label: "Share", action: "share", danger: false },
  { label: "Archive", action: "archive", danger: true },
];

function handleEllipsisAction(action) {
  ellipsisOpen.value = false;
  if (action === "watch") { toggleWatch(); return; }
  if (action === "share") { navigator.clipboard?.writeText(window.location.href).catch(() => { }); showToast("Link copied!"); return; }
  if (action === "archive") { logActivity("archived this card"); showToast("Card archived."); return; }
  if (action === "leave") { logActivity("left this card"); showToast("You left this card."); return; }
  showToast("Coming soon.");
}

function toggleWatch() {
  if (!selectedTask.value) return;
  selectedTask.value._watching = !selectedTask.value._watching;
  logActivity(selectedTask.value._watching ? "is watching this card" : "stopped watching this card");
  showToast(selectedTask.value._watching ? "Watching this card." : "Stopped watching.");
}

const addMenuItems = [
  { label: "Labels", action: "labels", desc: "Organize, categorize, and prioritize" },
  { label: "Dates", action: "dates", desc: "Start date, due date, reminder" },
  { label: "Checklist", action: "checklist", desc: "Add subtask" },
  { label: "Members", action: "members", desc: "Assign members" },
  { label: "Attachments", action: "attachments", desc: "Add links, pages, work items, etc" },
];

function handleAddAction(action) {
  addMenuOpen.value = false;
  if (action === "checklist") { showAddChecklist.value = true; return; }
  showToast(`${action} — coming soon.`);
}

let toastTimer = null;
function showToast(msg) {
  toast.value = msg;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.value = ""; }, 2500);
}

const statuses = ["To Do", "Doing", "In Review", "Done"];

const checklistProgress = computed(() => {
  if (!selectedTask.value || selectedTask.value.checklist.length === 0) return 0;
  const done = selectedTask.value.checklist.filter(c => c.done).length;
  return Math.round((done / selectedTask.value.checklist.length) * 100);
});

const visibleChecklist = computed(() => {
  if (!selectedTask.value) return [];
  return hideChecked.value ? selectedTask.value.checklist.filter(c => !c.done) : selectedTask.value.checklist;
});

function openModal(task) {
  selectedTask.value = task;
  closeAllDropdowns();
  showAddChecklist.value = false;
  showAttachPanel.value = false;
  showTimerLogs.value = false;
}

function closeModal() {
  selectedTask.value = null;
  closeAllDropdowns();
}

function addCheckItem() {
  if (!newCheckItem.value.trim() || !selectedTask.value) return;
  selectedTask.value.checklist.push({ label: newCheckItem.value.trim(), done: false });
  logActivity(`added "${newCheckItem.value.trim()}" to this card`);
  newCheckItem.value = "";
}

async function handleAddComment() {
  const content = newComment.value.trim();
  if (!content || !selectedTask.value || commentLoading.value) return;
  if (!selectedTask.value.id) { showToast("Task ID belum tersedia."); return; }
  commentLoading.value = true;
  try {
    await apiAddComment(selectedTask.value.id, content);
    selectedTask.value.activity.unshift({
      author: "You", initial: "Y", color: "bg-blue-500", action: "",
      date: new Date().toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      comment: { title: "Comment", body: content },
    });
    newComment.value = "";
  } catch (e) {
    showToast(e?.response?.data?.error?.message || "Gagal mengirim komentar.");
  } finally {
    commentLoading.value = false;
  }
}

async function handleDeleteComment(commentId, index) {
  if (!commentId) return;
  try {
    await apiDeleteComment(commentId);
    selectedTask.value.activity.splice(index, 1);
    showToast("Comment deleted.");
  } catch (e) {
    showToast(e?.response?.data?.error?.message || "Gagal menghapus komentar.");
  }
}

async function handleUploadFile(event) {
  const file = event.target.files?.[0];
  if (!file || !selectedTask.value?.id) return;
  attachFileLoading.value = true;
  try {
    const att = await apiUploadFile(selectedTask.value.id, file);
    if (!selectedTask.value.attachments) selectedTask.value.attachments = [];
    selectedTask.value.attachments.push({
      id: att.id ?? null,
      title: att.file_name ?? file.name,
      type: att.type ?? 'image',
      url: att.file_url ?? null,
    });
    logActivity(`attached file "${file.name}"`);
    showToast(`File "${file.name}" uploaded!`);
  } catch (e) {
    showToast(e?.response?.data?.error?.message || "Gagal upload file.");
  } finally {
    attachFileLoading.value = false;
    event.target.value = "";
  }
}

async function handleAddLink() {
  const title = attachLinkTitle.value.trim();
  const url = attachLinkUrl.value.trim();
  if (!title || !url || !selectedTask.value?.id || attachLinkLoading.value) return;
  attachLinkLoading.value = true;
  try {
    await apiAddLink(selectedTask.value.id, title, url);
    if (!selectedTask.value.attachments) selectedTask.value.attachments = [];
    selectedTask.value.attachments.push({ id: null, title, type: 'link', url });
    logActivity(`attached link "${title}"`);
    showToast(`Link "${title}" added!`);
    attachLinkTitle.value = "";
    attachLinkUrl.value = "";
    showAttachLink.value = false;
  } catch (e) {
    showToast(e?.response?.data?.error?.message || "Gagal menambah link.");
  } finally {
    attachLinkLoading.value = false;
  }
}

async function handleDeleteAttachment(attachId, index) {
  if (!attachId) return;
  try {
    const att = selectedTask.value.attachments[index];
    await apiDeleteAttachment(attachId);
    selectedTask.value.attachments.splice(index, 1);
    logActivity(`deleted attachment "${att?.title ?? 'file'}"`);
    showToast("Attachment deleted.");
  } catch (e) {
    showToast(e?.response?.data?.error?.message || "Gagal menghapus attachment.");
  }
}

function logActivity(action) {
  if (!selectedTask.value) return;
  logActivityOn(selectedTask.value, action);
}

function logActivityOn(task, action) {
  task.activity.unshift({
    author: "You", initial: "Y", color: "bg-blue-500", action,
    date: new Date().toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
  });
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(12px);
}
</style>