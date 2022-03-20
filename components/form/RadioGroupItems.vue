<template>
    <div class="radio-group__items" :class="[vertical && 'vertical']">
        <RadioGroup 
            class="radio-group__item" 
            v-for="(item, index) in items" 
            :data="item" 
            :key="'radio-group__item' + index" 
            v-model="modelValue" 
            @update:modelValue="$emit('update:modelValue', $event)"
        />
    </div>
</template>

<script>
import RadioGroup from '../form/RadioGroup.vue'

export default({
    props: ['items', 'modelValue', 'vertical'],
    components: {
        RadioGroup
    },
    setup() {
        
    },
})

</script>


<style scoped lang="scss">
.radio-group {
    &__items {
        display: flex;
    }
    &__item {
        margin-right: 37px;
        &:last-of-type {
            margin-right: 0;
        }
    }
}
.vertical {
    &.radio-group__items {
        flex-direction: column;
    }
    .radio-group {
        &__item {
            margin-right: 0;
            margin-bottom: 10px;
        }
    }
}
</style>