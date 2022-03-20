<template>
    <div class="bread-crumbs" v-if="currentStepIndex">
        <div class="bread-crumbs__item" :class="{active:  currentStepIndex == index}"  v-for="(item, index) in steps" :key="`crumbs__item-${index}`">
            <span class="bread-crumbs__text" @click="$emit('jumpTo', item.id)">{{ item.name }}</span>
            <span class="bread-crumbs__arrow" v-if="currentStepIndex !== index">></span>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue'
export default ({
props: ['steps'],
    setup(props) {
        const currentStepIndex = computed(() => props.steps?.length - 1)

        return { currentStepIndex }
    },
})
</script>


<style scoped lang="scss">
.bread-crumbs {
    font-size: 15px;
    line-height: 140%;
    text-align: left;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    &__item {
        display: flex;
        align-items: center;
        cursor: pointer;
        color: var(--PrimaryButtonColour);
        &.active {
            .bread-crumbs {
                &__text, &__arrow {
                    color: #000000; 
                    text-decoration-line: none;
                }
            }
        }
    }
    &__text {
        text-decoration-line: underline;
    }
    &__arrow {
        width: 17px;
        margin: 0 4px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>