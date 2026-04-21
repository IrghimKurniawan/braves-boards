<template>
  <Layout>
    <div class="flex gap-6 overflow-x-auto pb-4">
      <div
        v-for="(board, index) in boards"
        :key="index"
        class="min-w-[280px] bg-gray-100 rounded-xl border p-3 flex flex-col"
        style="max-height: calc(100vh - 120px)"
      >
        <div class="flex justify-between items-center mb-3">
          <h3 class="text-sm font-semibold text-gray-700">
            {{ board.title }} ({{ board.tasks.length }})
          </h3>
          <span class="cursor-pointer text-gray-400">⋮</span>
        </div>

        <div class="flex-1 space-y-3 overflow-y-auto">
          <div v-if="board.tasks.length === 0" class="text-xs text-gray-400 text-center py-10">
            No tasks
          </div>
          <div
            v-for="(task, i) in board.tasks"
            :key="i"
            class="bg-white p-3 rounded-lg shadow-sm border cursor-pointer hover:shadow-md transition"
            @click="openModal(task)"
          >
            <h4 class="text-sm font-semibold text-gray-800">{{ task.title }}</h4>
            <p class="text-xs text-gray-400 mt-1">{{ task.checklist.filter(c => c.done).length }}/{{ task.checklist.length }} tasks</p>
            <div class="flex justify-between items-center mt-3 text-xs text-gray-500">
              <span>
                <font-awesome-icon icon="clock" class="mr-1" />
                {{ task.time }}
              </span>
              <button class="border px-2 py-1 rounded text-xs hover:bg-gray-100" @click.stop>
                <font-awesome-icon icon="play" class="mr-1" /> Start
              </button>
            </div>
          </div>
        </div>

        <button class="w-full text-left text-xs text-gray-500 border border-dashed rounded-lg py-2 hover:bg-gray-200 mt-3 px-3">
          + Add Card
        </button>
      </div>
    </div>

    <!-- ===================== MODAL ===================== -->
    <Teleport to="body">
      <div
        v-if="selectedTask"
        class="fixed inset-0 z-50 flex items-center justify-center"
        style="background: rgba(0,0,0,0.65)"
        @click.self="closeModal"
      >
        <div
          class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 flex flex-col overflow-hidden"
          style="max-height: 90vh"
          @click="closeAllDropdowns"
        >

          <!-- Modal Top Bar -->
          <div class="flex items-center justify-between px-5 py-3 border-b border-gray-100 flex-shrink-0">

            <!-- Status Dropdown -->
            <div class="relative">
              <button
                @click.stop="closeAllDropdowns(); statusOpen = !statusOpen"
                class="flex items-center gap-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition"
              >
                {{ selectedTask.status }}
                <svg class="w-3 h-3" viewBox="0 0 10 6" fill="currentColor"><path d="M0 0l5 6 5-6z"/></svg>
              </button>
              <div v-if="statusOpen" class="absolute left-0 top-10 bg-white border border-gray-200 rounded-xl shadow-xl z-20 py-1 min-w-[140px]">
                <button
                  v-for="s in statuses" :key="s"
                  @click.stop="selectedTask.status = s; statusOpen = false"
                  class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition"
                  :class="selectedTask.status === s ? 'text-blue-600 font-semibold' : 'text-gray-700'"
                >{{ s }}</button>
              </div>
            </div>

            <div class="flex items-center gap-1">
              <!-- Cover button -->
              <button class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition" title="Cover">
                <font-awesome-icon icon="image" />
              </button>
              <!-- Watch button -->
              <button
                class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition"
                :class="selectedTask._watching ? 'text-blue-500' : 'text-gray-500'"
                title="Watch"
                @click.stop="toggleWatch"
              >
                <font-awesome-icon icon="eye" />
              </button>

              <!-- ── Ellipsis Menu Button ── -->
              <div class="relative">
                <button
                  @click.stop="closeAllDropdowns(); ellipsisOpen = !ellipsisOpen"
                  class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition"
                  :class="ellipsisOpen ? 'bg-gray-100' : ''"
                  title="More options"
                >
                  <font-awesome-icon icon="ellipsis-h" />
                </button>

                <!-- Ellipsis Dropdown Panel -->
                <div
                  v-if="ellipsisOpen"
                  class="absolute right-0 top-10 bg-white border border-gray-200 rounded-xl shadow-xl z-20 w-52 py-1.5 overflow-hidden"
                >
                  <template v-for="(item, idx) in ellipsisMenuItems" :key="item.action">
                    <!-- Divider before Share -->
                    <div v-if="item.action === 'share'" class="border-t border-gray-100 my-1"></div>

                    <button
                      @click.stop="handleEllipsisAction(item.action)"
                      class="w-full flex items-center gap-3 px-4 py-2 text-sm transition"
                      :class="item.danger
                        ? 'text-red-500 hover:bg-red-50'
                        : 'text-gray-700 hover:bg-gray-50'"
                    >
                      <!-- Inline SVG icons -->
                      <svg v-if="item.action === 'leave'" class="w-4 h-4 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"/></svg>
                      <svg v-else-if="item.action === 'move'" class="w-4 h-4 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                      <svg v-else-if="item.action === 'copy'" class="w-4 h-4 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                      <svg v-else-if="item.action === 'mirror'" class="w-4 h-4 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
                      <svg v-else-if="item.action === 'template'" class="w-4 h-4 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"/></svg>
                      <svg v-else-if="item.action === 'watch'" class="w-4 h-4 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                      <svg v-else-if="item.action === 'share'" class="w-4 h-4 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
                      <svg v-else-if="item.action === 'archive'" class="w-4 h-4 flex-shrink-0 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>

                      <span>{{ item.label }}</span>
                    </button>
                  </template>
                </div>
              </div>

              <!-- Close -->
              <button @click.stop="closeModal" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition ml-1">
                <font-awesome-icon icon="times" />
              </button>
            </div>
          </div>

          <!-- Modal Body -->
          <div class="flex flex-1 overflow-hidden">

            <!-- LEFT COLUMN -->
            <div class="flex-1 overflow-y-auto px-6 py-5">

              <!-- Title -->
              <div class="flex items-start gap-3 mb-5">
                <button
                  @click.stop="selectedTask.completed = !selectedTask.completed"
                  class="mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 transition"
                  :class="selectedTask.completed ? 'bg-blue-600 border-blue-600' : 'border-gray-400'"
                >
                  <svg v-if="selectedTask.completed" class="w-full h-full text-white p-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                  </svg>
                </button>
                <h2
                  contenteditable="true"
                  @blur="e => selectedTask.title = e.target.innerText"
                  class="text-xl font-bold text-gray-900 outline-none border-b-2 border-transparent focus:border-blue-400 flex-1 leading-tight"
                >{{ selectedTask.title }}</h2>
              </div>

              <!-- Action Buttons Row -->
              <div class="flex flex-wrap gap-2 mb-6">

                <!-- ── ADD Button ── -->
                <div class="relative">
                  <button
                    @click.stop="closeAllDropdowns(); addMenuOpen = !addMenuOpen"
                    class="flex items-center gap-1.5 text-xs border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-50 text-gray-600 transition font-medium"
                    :class="addMenuOpen ? 'bg-gray-100 border-gray-400' : ''"
                  >
                    <font-awesome-icon icon="plus" /> Add
                  </button>

                  <!-- Add Dropdown Panel -->
                  <div
                    v-if="addMenuOpen"
                    class="absolute left-0 top-9 bg-white border border-gray-200 rounded-xl shadow-xl z-20 w-64 overflow-hidden"
                  >
                    <!-- Header -->
                    <div class="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
                      <span class="text-xs font-semibold text-gray-500">Add to card</span>
                      <button @click.stop="addMenuOpen = false" class="text-gray-400 hover:text-gray-600 transition">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                      </button>
                    </div>

                    <!-- Items -->
                    <div class="py-1">
                      <button
                        v-for="item in addMenuItems" :key="item.action"
                        @click.stop="handleAddAction(item.action)"
                        class="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition text-left"
                      >
                        <!-- Icon box -->
                        <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-600">
                          <svg v-if="item.action === 'labels'" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16z"/></svg>
                          <svg v-else-if="item.action === 'dates'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                          <svg v-else-if="item.action === 'checklist'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                          <svg v-else-if="item.action === 'members'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                          <svg v-else-if="item.action === 'attachments'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
                        </div>
                        <div>
                          <p class="text-sm font-medium text-gray-800">{{ item.label }}</p>
                          <p class="text-xs text-gray-400 mt-0.5">{{ item.desc }}</p>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                <button class="flex items-center gap-1.5 text-xs border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-50 text-gray-600 transition">
                  <font-awesome-icon icon="tag" /> Labels
                </button>
                <button
                  @click.stop="closeAllDropdowns(); showAddChecklist = !showAddChecklist"
                  class="flex items-center gap-1.5 text-xs border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-50 text-gray-600 transition"
                >
                  <font-awesome-icon icon="check-square" /> Checklist
                </button>
                <button class="flex items-center gap-1.5 text-xs border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-50 text-gray-600 transition">
                  <font-awesome-icon icon="paperclip" /> Attachment
                </button>
              </div>

              <!-- Members & Due Date -->
              <div class="flex gap-8 mb-6">
                <div>
                  <p class="text-xs text-gray-500 font-medium mb-2">Members</p>
                  <div class="flex items-center gap-1.5">
                    <div
                      v-for="(m, i) in selectedTask.members" :key="i"
                      class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white cursor-pointer"
                      :class="m.color"
                      :title="m.name"
                    >{{ m.initial }}</div>
                    <button class="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-400 transition text-sm">+</button>
                  </div>
                </div>
                <div>
                  <p class="text-xs text-gray-500 font-medium mb-2">Due date</p>
                  <button class="flex items-center gap-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition">
                    {{ selectedTask.dueDate }}
                    <svg class="w-3 h-3" viewBox="0 0 10 6" fill="currentColor"><path d="M0 0l5 6 5-6z"/></svg>
                  </button>
                </div>
              </div>

              <!-- Description -->
              <div class="mb-6">
                <div class="flex items-center gap-2 mb-2">
                  <font-awesome-icon icon="align-left" class="text-gray-500 text-sm" />
                  <p class="text-sm font-semibold text-gray-700">Description</p>
                </div>
                <textarea
                  v-model="selectedTask.description"
                  placeholder="Add a more detailed description..."
                  rows="3"
                  class="w-full text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 resize-none transition placeholder-gray-400"
                ></textarea>
              </div>

              <!-- Checklist -->
              <div v-if="selectedTask.checklist.length > 0 || showAddChecklist" class="mb-6">
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <font-awesome-icon icon="check-square" class="text-gray-500 text-sm" />
                    <p class="text-sm font-semibold text-gray-700">Objective</p>
                  </div>
                  <div class="flex gap-2">
                    <button @click="hideChecked = !hideChecked" class="text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-1 hover:bg-gray-50 transition">
                      {{ hideChecked ? 'Show checked items' : 'Hide checked items' }}
                    </button>
                    <button @click="selectedTask.checklist = []" class="text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-1 hover:bg-gray-50 transition">
                      Delete
                    </button>
                  </div>
                </div>

                <div class="flex items-center gap-2 mb-3">
                  <span class="text-xs text-gray-500 w-8">{{ checklistProgress }}%</span>
                  <div class="flex-1 bg-gray-200 rounded-full h-1.5">
                    <div class="bg-blue-500 h-1.5 rounded-full transition-all" :style="{ width: checklistProgress + '%' }"></div>
                  </div>
                </div>

                <div class="space-y-2">
                  <div v-for="(item, i) in visibleChecklist" :key="i" class="flex items-center gap-3">
                    <input
                      type="checkbox"
                      v-model="item.done"
                      @change="logActivity(`completed ${item.label} on this card`)"
                      class="w-4 h-4 rounded accent-blue-600 cursor-pointer flex-shrink-0"
                    />
                    <span class="text-sm" :class="item.done ? 'line-through text-gray-400' : 'text-gray-700'">{{ item.label }}</span>
                  </div>
                </div>

                <div v-if="showAddChecklist" class="mt-3 flex gap-2">
                  <input
                    v-model="newCheckItem"
                    @keyup.enter="addCheckItem"
                    placeholder="Add an item..."
                    class="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:border-blue-400 transition"
                  />
                  <button @click="addCheckItem" class="bg-blue-500 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-blue-600 transition">Add</button>
                  <button @click="showAddChecklist = false; newCheckItem = ''" class="text-xs text-gray-500 px-2 hover:text-gray-700">✕</button>
                </div>
              </div>

            </div>

            <!-- RIGHT COLUMN: Comments & Activity -->
            <div class="w-72 border-l border-gray-100 flex flex-col flex-shrink-0">
              <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <div class="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <font-awesome-icon icon="comment-alt" class="text-gray-400" />
                  Comments and activity
                </div>
                <button @click="showActivity = !showActivity" class="text-xs text-gray-500 border border-gray-200 rounded-lg px-2 py-1 hover:bg-gray-50 transition">
                  {{ showActivity ? 'Hide details' : 'Show details' }}
                </button>
              </div>

              <div class="px-4 py-3 border-b border-gray-100">
                <input
                  v-model="newComment"
                  @keyup.enter="addComment"
                  placeholder="Write a comments..."
                  class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400 transition placeholder-gray-400"
                />
              </div>

              <div class="flex-1 overflow-y-auto px-4 py-3 space-y-4">
                <div v-for="(act, i) in selectedTask.activity" :key="i" class="flex gap-2.5">
                  <div
                    class="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white mt-0.5"
                    :class="act.color || 'bg-blue-500'"
                  >{{ act.initial }}</div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-baseline gap-1 flex-wrap">
                      <span class="text-xs font-semibold text-gray-800">{{ act.author }}</span>
                      <span class="text-xs text-gray-500">{{ act.action }}</span>
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
        </div>
      </div>
    </Teleport>

    <!-- Toast -->
    <Teleport to="body">
      <Transition name="toast">
        <div
          v-if="toast"
          class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-gray-900 text-white text-sm px-5 py-2.5 rounded-xl shadow-lg pointer-events-none"
        >
          {{ toast }}
        </div>
      </Transition>
    </Teleport>
  </Layout>
</template>

<script setup>
import { ref, computed } from "vue";
import Layout from "../components/AppLayout.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faClock, faPlay, faPlus, faTag, faCheckSquare, faPaperclip,
  faAlignLeft, faEye, faImage, faEllipsisH, faTimes, faCommentAlt,
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faClock, faPlay, faPlus, faTag, faCheckSquare, faPaperclip,
  faAlignLeft, faEye, faImage, faEllipsisH, faTimes, faCommentAlt
);

// ─── UI State ─────────────────────────────────────────────────────────────────
const selectedTask     = ref(null);
const statusOpen       = ref(false);
const ellipsisOpen     = ref(false);
const addMenuOpen      = ref(false);
const showAddChecklist = ref(false);
const newCheckItem     = ref("");
const newComment       = ref("");
const hideChecked      = ref(false);
const showActivity     = ref(true);
const toast            = ref("");

function closeAllDropdowns() {
  statusOpen.value   = false;
  ellipsisOpen.value = false;
  addMenuOpen.value  = false;
}

// ─── Ellipsis Menu ────────────────────────────────────────────────────────────
const ellipsisMenuItems = [
  { label: "Leave",         action: "leave",    danger: false },
  { label: "Move",          action: "move",     danger: false },
  { label: "Copy",          action: "copy",     danger: false },
  { label: "Mirror",        action: "mirror",   danger: false },
  { label: "Make template", action: "template", danger: false },
  { label: "Watch",         action: "watch",    danger: false },
  { label: "Share",         action: "share",    danger: false },
  { label: "Archive",       action: "archive",  danger: true  },
];

function handleEllipsisAction(action) {
  ellipsisOpen.value = false;
  if (action === "watch") { toggleWatch(); return; }
  if (action === "share") {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    showToast("Link copied to clipboard!");
    return;
  }
  if (action === "archive") {
    logActivity("archived this card");
    showToast("Card archived.");
    return;
  }
  if (action === "leave")    { logActivity("left this card");                showToast("You left this card."); return; }
  if (action === "copy")     { showToast("Card copied — coming soon."); return; }
  if (action === "move")     { showToast("Move card — coming soon."); return; }
  if (action === "mirror")   { showToast("Mirror card — coming soon."); return; }
  if (action === "template") { showToast("Saved as template — coming soon."); return; }
}

function toggleWatch() {
  if (!selectedTask.value) return;
  selectedTask.value._watching = !selectedTask.value._watching;
  logActivity(selectedTask.value._watching ? "is watching this card" : "stopped watching this card");
  showToast(selectedTask.value._watching ? "You are now watching this card." : "Stopped watching this card.");
}

// ─── Add Menu ─────────────────────────────────────────────────────────────────
const addMenuItems = [
  { label: "Labels",      action: "labels",      desc: "Organize, categorize, and prioritize" },
  { label: "Dates",       action: "dates",       desc: "Start date, due date, reminder" },
  { label: "Checklist",   action: "checklist",   desc: "Add subtask" },
  { label: "Members",     action: "members",     desc: "Assign members" },
  { label: "Attachments", action: "attachments", desc: "Add links, pages, work items, etc" },
];

function handleAddAction(action) {
  addMenuOpen.value = false;
  if (action === "checklist") { showAddChecklist.value = true; return; }
  const msg = {
    labels:      "Labels panel — coming soon.",
    dates:       "Date picker — coming soon.",
    members:     "Member picker — coming soon.",
    attachments: "Attachment upload — coming soon.",
  };
  showToast(msg[action] || "Coming soon.");
}

// ─── Toast ────────────────────────────────────────────────────────────────────
let toastTimer = null;
function showToast(msg) {
  toast.value = msg;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.value = ""; }, 2500);
}

// ─── Statuses & Board Data ────────────────────────────────────────────────────
const statuses = ["To Do", "Doing", "In Review", "Done"];

const boards = ref([
  { title: "To Do", tasks: [] },
  {
    title: "Doing",
    tasks: [
      {
        title: "First Board",
        time: "0s",
        status: "Doing",
        completed: false,
        description: "",
        dueDate: "Apr 20, 24.00",
        _watching: false,
        members: [
          { name: "Alpha Romeo", initial: "A", color: "bg-blue-500" },
          { name: "Beta",        initial: "B", color: "bg-yellow-500" },
        ],
        checklist: [
          { label: "Task 1", done: true },
          { label: "Task 2", done: false },
          { label: "Task 3", done: false },
          { label: "Task 4", done: false },
          { label: "Task 5", done: false },
        ],
        activity: [
          {
            author: "Alpha Romeo", initial: "A", color: "bg-blue-500",
            action: "", date: "Apr 13, 2026, 13.23",
            comment: { title: "Github - Link github project 1", body: "Berikut ini untuk link github projectnya" },
          },
          { author: "Alpha Romeo", initial: "A", color: "bg-blue-500", action: "completed Task 1 on this card",            date: "Apr 13, 2026, 13.23" },
          { author: "Alpha Romeo", initial: "A", color: "bg-blue-500", action: "set the due date on this card to 20 April", date: "Apr 13, 2026, 12.54" },
          { author: "Alpha Romeo", initial: "A", color: "bg-blue-500", action: "added objective to this card",             date: "Apr 13, 2026, 12.52" },
          { author: "Alpha Romeo", initial: "A", color: "bg-blue-500", action: "added BETA to this card",                  date: "Apr 13, 2026, 12.51" },
          { author: "Alpha Romeo", initial: "A", color: "bg-blue-500", action: "joined this card",                         date: "Apr 13, 2026, 12.50" },
          { author: "Alpha Romeo", initial: "A", color: "bg-blue-500", action: "added this card to Doing",                 date: "Apr 13, 2026, 12.50" },
        ],
      },
    ],
  },
  { title: "In Review", tasks: [] },
]);

// ─── Computed ─────────────────────────────────────────────────────────────────
const checklistProgress = computed(() => {
  if (!selectedTask.value || selectedTask.value.checklist.length === 0) return 0;
  const done = selectedTask.value.checklist.filter(c => c.done).length;
  return Math.round((done / selectedTask.value.checklist.length) * 100);
});

const visibleChecklist = computed(() => {
  if (!selectedTask.value) return [];
  return hideChecked.value
    ? selectedTask.value.checklist.filter(c => !c.done)
    : selectedTask.value.checklist;
});

// ─── Methods ──────────────────────────────────────────────────────────────────
function openModal(task) {
  selectedTask.value = task;
  closeAllDropdowns();
  showAddChecklist.value = false;
}

function closeModal() {
  selectedTask.value = null;
  closeAllDropdowns();
}

function addCheckItem() {
  if (!newCheckItem.value.trim() || !selectedTask.value) return;
  selectedTask.value.checklist.push({ label: newCheckItem.value.trim(), done: false });
  logActivity(`added ${newCheckItem.value.trim()} to this card`);
  newCheckItem.value = "";
}

function addComment() {
  if (!newComment.value.trim() || !selectedTask.value) return;
  selectedTask.value.activity.unshift({
    author: "Alpha Romeo", initial: "A", color: "bg-blue-500",
    action: "",
    date: new Date().toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
    comment: { title: "Comment", body: newComment.value.trim() },
  });
  newComment.value = "";
}

function logActivity(action) {
  if (!action || !selectedTask.value) return;
  selectedTask.value.activity.unshift({
    author: "Alpha Romeo", initial: "A", color: "bg-blue-500",
    action,
    date: new Date().toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
  });
}
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.25s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(12px); }
</style>