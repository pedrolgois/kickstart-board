<template>
  <div
    class="flex fixed top-0 left-0 z-40 justify-center items-center p-4 w-full h-full bg-backdrop"
    data-cy="card-detail-backdrop"
    @click.self="
      showCardModule(activeCard.id, false);
      router.push(router.currentRoute.value.path);
    "
  >
    <div
      class="flex flex-col-reverse gap-4 p-4 pb-0 w-full max-w-[700px] bg-gray2 sm:flex-row sm:p-8"
      data-cy="card-detail"
    >
      <div class="w-full">
        <div class="mb-4 ml-9">
          <Board class="inline-block mr-3 ml-[-2rem] w-5" />
          <input
            v-model="activeCard.name"
            v-click-away="clickAwayCardName"
            data-cy="card-detail-title"
            class="mb-2 text-base font-semibold leading-4 text-black bg-transparent focus:bg-white hover:bg-opacity-30 board-title"
            @focus="
              selectInput($event);
              cardNameInputActive = true;
            "
            @change="patchCard(activeCard, { name: activeCard.name })"
            @keyup.enter="
              blurInput($event);
              cardNameInputActive = false;
            "
            @keyup.esc="
              blurInput($event);
              cardNameInputActive = false;
            "
          >
          <h2 class="text-sm text-gray9">
            in list <span
              class="underline"
              data-cy="card-list-name"
            >{{ cardListName }}</span>
          </h2>
        </div>
        <div class="mb-4 ml-9">
          <h2 class="text-sm text-gray9">
            DUE DATE
          </h2>
          <div class="flex gap-1 mt-1">
            <Checkbox :card="activeCard" />
            <h2>
              <button
                data-cy="calendar-dropdown"
                class="py-1 px-4 bg-gray3 hover:bg-gray5"
                @click="showDate = true"
              >
                {{ new Date(activeCard.deadline).toDateString() }}
                <Downarrow class="inline-block py-2 pl-2 w-5 text-gray-800 cursor-pointer fill-current stroke-current" />
              </button>
            </h2>

            <div
              v-if="showDate"
              class="absolute"
            >
              <Datepicker
                v-model="date"
                v-click-away="clickAwayDate"
                inline
                auto-apply
                :enable-time-picker="false"
                data-cy="card-detail-deadline"
                @update:model-value="updateDate"
              >
                <template #day="{ day }">
                  <div data-cy="day">
                    {{ day }}
                  </div>
                </template>
                <template #month="{ text }">
                  <div data-cy="header-month">
                    {{ text }}
                  </div>
                </template>
                <template #month-overlay="{ text }">
                  <div data-cy="month">
                    {{ text }}
                  </div>
                </template>
                <template #year="{ year }">
                  <div data-cy="header-year">
                    {{ year }}
                  </div>
                </template>
                <template #year-overlay="{ text }">
                  <div data-cy="year">
                    {{ text }}
                  </div>
                </template>
              </Datepicker>
            </div>
          </div>
          <div v-show="activeCard.completed">
            COMPLETED
          </div>
        </div>
        <div class="mb-4 ml-9">
          <Description class="inline-block mr-3 ml-[-2rem] w-5" />
          <h1 class="inline-block mb-4 text-lg font-semibold text-black">
            Description
          </h1>
          <textarea
            v-model="activeCard.description"
            class="p-3 w-full h-36 resize-none"
            data-cy="card-description"
            @focus="
              selectInput($event);
              descriptionInputActive = true;
            "
            @change="patchCard(activeCard, { description: activeCard.description })"
            @keydown.enter="
              blurInput($event);
              descriptionInputActive = false;
            "
            @keyup.esc="
              blurInput($event);
              descriptionInputActive = false;
            "
          />
        </div>
        <div class="mb-4 ml-9">
          <Attachment class="inline-block mr-3 ml-[-2rem] w-5" />
          <h1 class="inline-block mb-4 text-lg font-semibold text-black">
            Image
          </h1>
          <div
            v-if="activeCard.image"
            class="grid grid-cols-6 gap-x-4 items-center p-4 h-40 border-4 border-gray-400 border-dashed"
            data-cy="image-attachment"
          >
            <div class="col-span-2 row-span-2">
              <img :src="'/backend' + activeCard.image">
            </div>
            <div class="col-span-4 font-bold ">
              <span>{{ activeCard.image.replace(`/data/uploaded/${activeCard.id}_`, '') }}</span>
              <a
                class="block font-normal underline cursor-pointer"
                data-cy="image-delete"
                :href="'/backend' + activeCard.image"
                download
              >
                <Download class="inline-block mb-1 w-4" />Download
              </a>
              <div
                class="block font-normal underline cursor-pointer"
                data-cy="image-delete"
                @click="patchCard(activeCard, { image: null })"
              >
                <Cross class="inline-block mb-1 w-4" />Delete
              </div>
            </div>
          </div>
          <Dropzone
            v-else
            :card="activeCard"
          />
        </div>
      </div>
      <div class="flex flex-row-reverse gap-2 justify-between w-full sm:flex-col sm:justify-start sm:w-[220px]">
        <div class="grid self-end place-content-center place-self-end w-8 h-8 hover:bg-gray5 cursor-pointer">
          <Cross
            class="w-6 h-6 text-gray-600 fill-current"
            @click="
              showCardModule(activeCard.id, false);
              router.push(router.currentRoute.value.path);
            "
          />
        </div>
        <div class="flex gap-2 content-start sm:flex-col">
          <div
            class="flex gap-2 py-0.5 px-2 text-sm text-gray-600 bg-gray3 hover:bg-gray5 rounded-sm cursor-pointer"
            data-cy="calendar-button"
            @click="showDate = true"
          >
            <Clock class="inline-block mb-0.5 w-4" /><span class="hidden sm:block">Due date</span>
          </div>
          <div
            class="flex gap-2 py-0.5 px-2 text-sm text-gray-600 bg-gray3 hover:bg-gray5 rounded-sm cursor-pointer"
            data-cy="copy-properties"
            @click="copyProperties(activeCard)"
          >
            <Copy class="inline-block  mb-0.5 w-4" /><span class="hidden sm:block">Copy attributes</span>
          </div>
          <div
            class="flex gap-2 py-0.5 px-2 text-sm text-gray-600 bg-gray3 hover:bg-gray5 rounded-sm cursor-pointer"
            data-cy="card-detail-delete"
            @click="
              deleteCard(activeCard);
              router.push(router.currentRoute.value.path);
            "
          >
            <Trash class="inline-block  mb-0.5 w-4" /><span class="hidden sm:block">Delete card</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { blurInput } from '@/utils/blurInput';
import { ref, onMounted } from 'vue';
import { selectInput } from '@/utils/selectInput';
import { useStore } from '@/store/store';
import Attachment from '@/assets/icons/attachment.svg';
import Board from '@/assets/icons/board.svg';
import Card from '@/typings/card';
import Checkbox from '@/components/Checkbox.vue';
import Clock from '@/assets/icons/clock.svg';
import Copy from '@/assets/icons/copy.svg';
import Cross from '@/assets/icons/cross.svg';
import Download from '@/assets/icons/download.svg';
import Description from '@/assets/icons/description.svg';
import Downarrow from '@/assets/icons/downarrow.svg';
import Dropzone from '../Dropzone.vue';
import List from '@/typings/list';
import Trash from '@/assets/icons/trash.svg';
import moment from 'moment';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

const router = useRouter();
const { showNotification, showCardModule, patchCard, deleteCard } = useStore();
const { lists, activeCard } = storeToRefs(useStore());
const cardListName = lists.value.find((l: List) => l.id === activeCard.value.listId)!['name'];

const showDate = ref(false);
const cardNameInputActive = ref(false);
const descriptionInputActive = ref(false);
const date = ref(new Date());

const clickAwayCardName = () => {
  cardNameInputActive.value = false;
};
const clickAwayDate = () => {
  showDate.value = false;
};

const updateDate = (data: string) => {
  const formattedDate = moment(data).format('YYYY-MM-DD');
  patchCard(activeCard.value, { deadline: formattedDate });
  showDate.value = false;
};

const copyProperties = (content: Card) => {
  const clipBoardValue = JSON.stringify(content, null, 2);
  const clipboard = window.navigator.clipboard;
  showNotification('Card info copied to clipboard', false);
  return clipboard.writeText(clipBoardValue);
};

onMounted(() => {
  router.push(`${router.currentRoute.value.path}?card=${activeCard.value.id}`);
});
</script>
