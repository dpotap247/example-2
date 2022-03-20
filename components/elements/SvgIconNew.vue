<script setup>
import { computed } from "@vue/reactivity";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
});

const iconDetails = computed(() => {
  const nameArray = (props.name || "").split("/")
  if(nameArray.length === 1)  return {
    prefix: 'fa-solid',
    name: props.name?.includes('fa-')? props.name: 'fa-' + props.name
  }

  const pre = nameArray[0] === 'kit'? 'fak': 'fa-' + nameArray[0]

  return {
    prefix: pre,
    name: nameArray[1].includes('fa-')? nameArray[1]: 'fa-' + nameArray[1]
  }
})
</script>

<script>
export default {
  inheritAttrs: false,
  customOptions: {},
};
</script>

<template>
  <span class="line-height-0 tw-inline-block">
    <i :class="`${iconDetails.prefix} ${iconDetails.name}`" v-bind="$attrs"></i>
  </span>
</template>

<style scoped>
.line-height-0 {
  line-height: 0;
}
</style>
