<template>
  <div class="relative">
    <button
      data-cy="board-filter"
      class="flex gap-2 items-center px-2 ml-2 h-8 text-white bg-white bg-opacity-20 hover:bg-opacity-30 rounded-sm cursor-pointer fill-white"
      @click="showDropdown()"
    >
      Filters <DownArrow class="place-self-center w-3" />
    </button>
    <Dropdown
      v-if="dropdown"
      v-click-away="onClickAway"
      data-cy="board-dropdown"
      :header="'Filters'"
      @close="hideDropdown()"
    >
      <span class="block py-2 text-sm font-bold text-gray-700">Keyword</span>
      <input
        v-model="localFilters.keyword"
        placeholder="Enter a keyword"
        class="py-1 px-2 w-full bg-gray-200  board-title"
        data-cy="board-title"
        autocomplete="off"
        name="board-title"
        @focus="selectInput($event)"
        @keyup.enter="blurInput($event)"
        @keyup.esc="blurInput($event)"
      >
      <span class="block py-2 text-sm font-bold text-gray-700">Due date</span>

      <div class="p-relative">
        <button
          data-cy="calendar-dropdown"
          class="py-1 px-4 bg-gray3 hover:bg-gray5"
          @click="showDate = true"
        >
          {{ new Date(localFilters.duedate).toDateString() }}
          <Downarrow class="inline-block py-2 pl-2 w-5 text-gray-800 cursor-pointer fill-current stroke-current" />
        </button>
        <div
          v-if="showDate"
          class="absolute z-10"
        >
          <Datepicker
            v-model="localFilters.duedate"
            v-click-away="clickAwayDate"
            inline
            auto-apply
            :enable-time-picker="false"
            data-cy="card-detail-duedate"
            @update:model-value="showDate = false"
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

      <span class="block py-2 text-sm font-bold text-gray-700">Status</span>
      <DropdownItem>
        <label class="inline-flex gap-1 items-center">
          <input
            v-model="localFilters.overdue"
            type="checkbox"
            data-cy="card-checkbox"
            :checked="localFilters.overdue"
          >
          Overdue
        </label>
      </DropdownItem>
      <DropdownItem>
        <label class="inline-flex gap-1 items-center">
          <input
            v-model="localFilters.completed"
            type="checkbox"
            data-cy="card-checkbox"
            :checked="localFilters.completed"
          >
          Completed
        </label>
      </DropdownItem>
    </Dropdown>
  </div>
</template>

<script setup lang="ts">
import { PropType, reactive, ref, watch } from 'vue';
import DownArrow from '@/assets/icons/downarrow.svg';
import Dropdown from '@/components/common/Dropdown.vue';
import DropdownItem from '@/components/common/DropdownItem.vue';
import { blurInput } from '@/utils/blurInput';
import { selectInput } from '@/utils/selectInput';
import Datepicker from '@vuepic/vue-datepicker';
import Filter from '@/typings/filters';

const props = defineProps({
  filters: {
    type: Object,
    default: () => ({
      keyword: '',
      duedate: new Date(),
      overdue: false,
      completed: false,
    }),
  },
});

const localFilters = reactive({ ...props.filters });

watch(
  () => props.filters,
  (newFilters) => {
    Object.assign(localFilters, newFilters);
  },
  { deep: true }
);

watch(
  () => localFilters,
  (newLocalFilters) => {
    Object.assign(props.filters, newLocalFilters);
  },
  { deep: true }
);

const showDate = ref(false);
const clickAwayDate = () => {
  showDate.value = false;
};

const dropdown = ref(false);
const onClickAway = () => {
  dropdown.value = false;
};
const showDropdown = () => {
  dropdown.value = true;
};
const hideDropdown = () => {
  dropdown.value = false;
};
</script>
