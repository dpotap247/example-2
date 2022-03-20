<template>
    <div class="side__items">
        <div class="side__item" v-for="(item, index) in items" :key="index">
            <img class="side__img" :src="item.image" alt="side example"/>
            <RadioGroup 
                class="side__group" 
                :data="item" 
                :key="'radio-group__item' + index" 
                v-model="modelValue" 
                @update:modelValue="$emit('update:modelValue', $event)"
            />
        </div>
    </div>
</template>

<script>
import RadioGroup from '../../../form/RadioGroup.vue'

export default({
    props: ['items', 'modelValue'],
    components: {
        RadioGroup
    },
    setup() {
        
    },
})

</script>

<style scoped lang="scss">
.side {
    &__items {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: row!important;
    }
    &__img {
        max-height: 250px;
        margin-bottom: 10px;
    }
    &__item {
       margin-right: 30px;
       &:last-of-type {
           margin-right: 0;
       }
    }
}
.side__group {
    margin-right: 0;
    justify-content: center;
}
</style>