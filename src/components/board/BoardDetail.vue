<template>
  <div
    class="grid"
    :class="state.loadingError.show ? 'bg-white' : 'bg-blue6'"
  >
    <!-- LOADING -->
    <div
      v-if="state.loading"
      class="grid justify-center content-center h-screen loading"
    >
      <div><LoadingIcon class="inline-block mb-1" />&nbsp;&nbsp;Loading data ...</div>
    </div>
    <!-- ERROR STATE -->
    <div
      v-if="state.loadingError.show"
      class="grid justify-center content-center h-screen"
      data-cy="board-list-error-message"
    >
      <span class="block mb-4 text-8xl font-bold text-center text-gray-200">{{ state.loadingError.status }}</span>
      <p class="block mb-4 text-center text-gray-400">
        {{ state.loadingError.message || 'There was an error loading board' }}
      </p>
      <router-link
        to="/"
        class="block font-semibold text-center text-blue7"
      >
        Go back home
      </router-link>
    </div>
    <!-- BOARD DETAIL -->
    <div
      v-if="!state.loading && !state.loadingError.show"
      class="overflow-hidden whitespace-nowrap bg-blue6 board-detail"
      data-cy="board-detail "
    >
      <div class="flex py-2.5">
        <div class="inline-block relative py-1.5 mr-0 ml-3 h-8">
          <div class="inline-block invisible px-3 font-bold">
            {{ state.board.name }}
          </div>
          <input
            v-model="state.board.name"
            v-click-away="onClickAway"
            class="text-white bg-white bg-opacity-20 hover:bg-opacity-30 board-title"
            data-cy="board-title"
            autocomplete="off"
            name="board-title"
            @focus="selectInput($event)"
            @change="state.putBoard(state.board, { name: state.board.name })"
            @keyup.enter="blurInput($event)"
            @keyup.esc="blurInput($event)"
          >
        </div>
        <div
          class="inline-grid relative self-center ml-2 w-8 h-8 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-sm cursor-pointer"
          :class="[state.board.starred ? 'fill-current text-yellow-300' : 'stroke-current text-white']"
          data-cy="star"
          @click="
            state.putBoard(state.board, {
              starred: !state.board.starred,
            })
          "
        >
          <Star class="place-self-center m-2" />
        </div>
        <BoardOptions :board="state.board" />
        <BoardFilter :filters="filters" />
      </div>
      <div
        ref="scrollContainer"
        class="flex overflow-x-auto pr-4 h-full bg-blue6 snap-x snap-mandatory sliding scroll-container"
        @mousedown="startScroll"
        @mousemove="scroll"
        @mouseup="endScroll"
        @mouseleave="endScroll"
      >
        <draggable
          v-model="state.lists"
          animation="150"
          group="lists"
          item-key="order"
          class="flex items-start"
          @end="state.sortLists"
        >
          <template #item="{ element }">
            <div
              class="inline-block align-top snap-center"
              data-cy="list-placeholder"
            >
              <ListItem
                :list="element"
                :filters="filters"
              />
            </div>
          </template>
        </draggable>
        <div class="inline  align-top snap-center -block">
          <ListCreate :board="state.board.id" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { blurInput } from '@/utils/blurInput';
import { selectInput } from '@/utils/selectInput';
import { ref, onMounted, Ref } from 'vue';
import { useStore } from '@/store/store';
import { useRoute } from 'vue-router';
import BoardOptions from '@/components/board/BoardOptions.vue';
import BoardFilter from '@/components/board/BoardFilter.vue';
import ListCreate from '@/components/list/ListCreate.vue';
import ListItem from '@/components/list/ListItem.vue';
import LoadingIcon from '@/assets/icons/loadingIcon.svg';
import Star from '@/assets/icons/star.svg';
import draggable from 'vuedraggable';

const route = useRoute();
const state = useStore();
const inputActive = ref(false);
const boardId = Number(route.params.board);
state.getBoardDetail(boardId);

const onClickAway = () => {
  inputActive.value = false;
};

const filters = ref({
  keyword: '',
  duedate: new Date(),
  overdue: false,
  completed: false,
});

const scrollContainer: Ref<HTMLElement | null> = ref(null);
    const isDragging = ref(false);
    const startX = ref(0);
    const scrollLeft = ref(0);

    const startScroll = (e: MouseEvent) => {
      if (!scrollContainer.value) return;
      isDragging.value = true;
      startX.value = e.pageX - scrollContainer.value.offsetLeft;
      scrollLeft.value = scrollContainer.value.scrollLeft;
      document.body.style.cursor = 'grabbing'; // Change cursor style
    };

    const scroll = (e: MouseEvent) => {
      if (!isDragging.value || !scrollContainer.value) return;
      e.preventDefault();
      const x = e.pageX - scrollContainer.value.offsetLeft;
      const walk = (x - startX.value) * 2; // Adjust scroll speed
      scrollContainer.value.scrollLeft = scrollLeft.value - walk;
    };

    const endScroll = () => {
      isDragging.value = false;
      document.body.style.cursor = 'default'; // Reset cursor style
    };

</script>


<style lang="postcss" scoped>
.board-detail {
  height: calc(100vh - 40px);
}

.board-title:focus {
  @apply bg-gray1 bg-opacity-100 hover:bg-opacity-100 text-black;
}

.board-title {
  @apply absolute outline-none font-bold top-0 bottom-0 right-0 left-0 w-full pl-3 rounded-sm cursor-pointer;
}
</style>
