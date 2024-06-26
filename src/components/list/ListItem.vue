<template>
  <div
    class="relative p-1.5 ml-3 w-list bg-gray2 rounded shadow-md item"
    data-cy="list"
    @dragenter="isDragging = true"
    @dragleave="isDragging = false"
  >
    <div class="flex mb-1 item">
      <input
        v-click-away="onClickAway"
        class="inline-block flex-grow py-0.5 px-1 h-8 text-sm font-semibold text-gray-900 bg-gray2 focus:bg-gray1 rounded-sm border-2 border-transparent focus:border-blue6 outline-none cursor-pointer item"
        data-cy="list-name"
        :value="list.name"
        @mouseup="
          selectInput($event);
          inputActive = true;
        "
        @change="putList(list, { name: inputValue($event) })"
        @keyup.enter="
          blurInput($event);
          inputActive = false;
        "
        @blur="inputActive = false"
      >
      <ListOptions
        :list="list"
        @toggle-input="showCardCreate"
      />
    </div>
    <div
      data-cy="card-list"
      :class="isDragging ?? 'min-h-[100px]'"
    >
      <div
        v-if="loadingListCards[list.id]"
        class="block place-self-center text-xs text-center item"
      >
        <LoadingIcon class="inline-block mb-1" />&nbsp;&nbsp;Loading cards ...
      </div>
      <draggable
        :list="list.cards"
        animation="150"
        group="cards"
        ghost-class="bg-gray2"
        :item-key="list.name"
        @change="sortCards"
      >
        <template #item="{ element }">
          <CardItem
            v-if="doesCardMatchFilter(element)"
            :key="element.order"
            :card="element"
          />
        </template>
      </draggable>
      <div
        v-if="!cardCreate"
        class="py-1.5 px-2 text-sm font-normal text-gray-500 hover:text-gray-600 hover:bg-gray4 rounded-md cursor-pointer"
        data-cy="new-card"
        @click="showCardCreate(true)"
      >
        <Plus class="inline-block w-3 h-3" />Add another card
      </div>
      <CardCreateInput
        v-else
        :list="list"
        @toggle-input="showCardCreate"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, ref } from 'vue';
import { blurInput } from '@/utils/blurInput';
import { inputValue } from '@/utils/inputValue';
import { selectInput } from '@/utils/selectInput';
import { useStore } from '@/store/store';
import Card from '@/typings/card';
import CardCreateInput from '@/components/card/CardCreateInput.vue';
import CardItem from '@/components/card/CardItem.vue';
import ListOptions from '@/components/list/ListOptions.vue';
import List from '@/typings/list';
import Plus from '@/assets/icons/plus.svg';
import draggable from 'vuedraggable';
import LoadingIcon from '@/assets/icons/loadingIcon.svg';
import { storeToRefs } from 'pinia';
import Filter from '@/typings/filters';
import moment from 'moment';

const props = defineProps({
  list: {
    type: Object as PropType<List>,
    required: true,
  },
  filters: {
    type: Object as PropType<Filter>,
    required: true,
  },
});

function doesCardMatchFilter(card: Card){
  const matchesKeyword = props.filters.keyword == '' ||
    card.name.toLowerCase().includes(props.filters.keyword.toLowerCase())

  const matchesDueDate = moment(props.filters.duedate).isSame(moment(), 'day') || moment(props.filters.duedate).isBefore(card.deadline, 'day')

  const matchesOverdueOrCompleted = (props.filters.overdue && moment(card.deadline).isBefore(moment(), 'day')) || (props.filters.completed && card.completed);

  const showCard = (props.filters.overdue || props.filters.completed) && matchesOverdueOrCompleted || (!props.filters.overdue && !props.filters.completed);

  return matchesKeyword && matchesDueDate && showCard;
}

const cardCreate = ref(false);
const inputActive = ref(false);
const isDragging = ref(false);

const { lists, loadingListCards } = storeToRefs(useStore());
const { putCard, putList } = useStore();

const onClickAway = () => {
  inputActive.value = false;
};
const showCardCreate = (flag: boolean) => {
  cardCreate.value = flag;
};
const sortCards = (event: any) => {
  // Check if it was moved between lists
  lists.value.forEach((list: List) => {
    const movedCard = list.cards.find((card) => card.listId != list.id);
    if(movedCard){
      movedCard.listId = list.id;
      putCard(movedCard, { listId: list.id });
      return;
    }
  })

  // Check if it was moved within the same list
  if(event.moved?.element){
    const list = lists.value.find((list: List) => list.id == event.moved.element.listId) as List;
    list.cards.forEach((card, index) => {
      card.order = index;
      putCard(card, { order: index })
    })
  }

};
</script>
