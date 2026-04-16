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
            @click="openModal(task, board.title)"
          >
            <h4 class="text-sm font-semibold text-gray-800">{{ task.title }}</h4>
            <p class="text-xs text-gray-400 mt-1">{{ task.checklist.filter(c=>c.done).length }}/{{ task.checklist.length }} tasks</p>
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
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 flex flex-col overflow-hidden" style="max-height: 90vh">

          <!-- Modal Top Bar -->
          <div class="flex items-center justify-between px-5 py-3 border-b border-gray-100 flex-shrink-0">
            <!-- Status Dropdown -->
            <div class="relative">
              <button
                @click="statusOpen = !statusOpen"
                class="flex items-center gap-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition"
              >
                {{ selectedTask.status }}
                <svg class="w-3 h-3" viewBox="0 0 10 6" fill="currentColor"><path d="M0 0l5 6 5-6z"/></svg>
              </button>
              <div v-if="statusOpen" class="absolute left-0 top-9 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1 min-w-[120px]">
                <button
                  v-for="s in statuses" :key="s"
                  @click="selectedTask.status = s; statusOpen = false"
                  class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition"
                  :class="selectedTask.status === s ? 'text-blue-600 font-medium' : 'text-gray-700'"
                >{{ s }}</button>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <button class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition">
                <font-awesome-icon icon="image" />
              </button>
              <button class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition">
                <font-awesome-icon icon="eye" />
              </button>
              <button class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition">
                <font-awesome-icon icon="ellipsis-h" />
              </button>
              <button @click="closeModal" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition ml-1">
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
                <button @click="selectedTask.completed = !selectedTask.completed"
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

              <!-- Action Buttons -->
              <div class="flex flex-wrap gap-2 mb-6">
                <button class="flex items-center gap-1.5 text-xs border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-50 text-gray-600 transition">
                  <font-awesome-icon icon="plus" /> Add
                </button>
                <button class="flex items-center gap-1.5 text-xs border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-50 text-gray-600 transition">
                  <font-awesome-icon icon="tag" /> Labels
                </button>
                <button @click="showAddChecklist = !showAddChecklist" class="flex items-center gap-1.5 text-xs border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-50 text-gray-600 transition">
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
                      class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      :class="m.color"
                      :title="m.name"
                    >{{ m.initial }}</div>
                    <button class="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-400 transition text-sm">
                      +
                    </button>
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
                    <button @click="toggleHideChecked" class="text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-1 hover:bg-gray-50 transition">
                      {{ hideChecked ? 'Show checked items' : 'Hide checked items' }}
                    </button>
                    <button @click="selectedTask.checklist = []" class="text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-1 hover:bg-gray-50 transition">
                      Delete
                    </button>
                  </div>
                </div>

                <!-- Progress Bar -->
                <div class="flex items-center gap-2 mb-3">
                  <span class="text-xs text-gray-500 w-8">{{ checklistProgress }}%</span>
                  <div class="flex-1 bg-gray-200 rounded-full h-1.5">
                    <div
                      class="bg-blue-500 h-1.5 rounded-full transition-all"
                      :style="{ width: checklistProgress + '%' }"
                    ></div>
                  </div>
                </div>

                <!-- Items -->
                <div class="space-y-2">
                  <div
                    v-for="(item, i) in visibleChecklist"
                    :key="i"
                    class="flex items-center gap-3"
                  >
                    <input
                      type="checkbox"
                      v-model="item.done"
                      @change="logActivity(`completed ${item.label} on this card`)"
                      class="w-4 h-4 rounded accent-blue-600 cursor-pointer flex-shrink-0"
                    />
                    <span class="text-sm" :class="item.done ? 'line-through text-gray-400' : 'text-gray-700'">
                      {{ item.label }}
                    </span>
                  </div>
                </div>

                <!-- Add checklist item -->
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

              <!-- Comment Input -->
              <div class="px-4 py-3 border-b border-gray-100">
                <input
                  v-model="newComment"
                  @keyup.enter="addComment"
                  placeholder="Write a comments..."
                  class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400 transition placeholder-gray-400"
                />
              </div>

              <!-- Activity Feed -->
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
  </Layout>
</template>

<script setup>
import { ref, computed } from "vue";
import Layout from "./Layout.vue";
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

// ─── State ───────────────────────────────────────────────────────────────────
const selectedTask   = ref(null);
const statusOpen     = ref(false);
const showAddChecklist = ref(false);
const newCheckItem   = ref("");
const newComment     = ref("");
const hideChecked    = ref(false);
const showActivity   = ref(true);

const statuses = ["To Do", "Doing", "In Review", "Done"];

// ─── Board Data ───────────────────────────────────────────────────────────────
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
            action: "",
            date: "Apr 13, 2026, 13.23",
            comment: { title: "Github - Link github project 1", body: "Berikut ini untuk link github projectnya" },
          },
          { author: "Alpha Romeo", initial: "A", color: "bg-blue-500", action: "completed Task 1 on this card",       date: "Apr 13, 2026, 13.23" },
          { author: "Alpha Romeo", initial: "A", color: "bg-blue-500", action: "set the due date on this card to 20 April at 24.00", date: "Apr 13, 2026, 12.54" },
          { author: "Alpha Romeo", initial: "A", color: "bg-blue-500", action: "added objective to this card",        date: "Apr 13, 2026, 12.52" },
          { author: "Alpha Romeo", initial: "A", color: "bg-blue-500", action: "added BETA to this card",             date: "Apr 13, 2026, 12.51" },
          { author: "Alpha Romeo", initial: "A", color: "bg-blue-500", action: "joined this card",                    date: "Apr 13, 2026, 12.50" },
          { author: "Alpha Romeo", initial: "A", color: "bg-blue-500", action: "added this card to Doing",            date: "Apr 13, 2026, 12.50" },
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
  statusOpen.value   = false;
  showAddChecklist.value = false;
}

function closeModal() {
  selectedTask.value = null;
}

function addCheckItem() {
  if (!newCheckItem.value.trim()) return;
  selectedTask.value.checklist.push({ label: newCheckItem.value.trim(), done: false });
  logActivity(`added ${newCheckItem.value.trim()} to this card`);
  newCheckItem.value = "";
}

function addComment() {
  if (!newComment.value.trim()) return;
  selectedTask.value.activity.unshift({
    author: "Alpha Romeo", initial: "A", color: "bg-blue-500",
    action: "",
    date: new Date().toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
    comment: { title: "Comment", body: newComment.value.trim() },
  });
  newComment.value = "";
}

function logActivity(action) {
  selectedTask.value.activity.unshift({
    author: "Alpha Romeo", initial: "A", color: "bg-blue-500",
    action,
    date: new Date().toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
  });
}

function toggleHideChecked() {
  hideChecked.value = !hideChecked.value;
}
</script>