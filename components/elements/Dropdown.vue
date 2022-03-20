<template>
    <div class="dropdown" :class="{ open: showDropdown }">
        <div class="dropdown__btn" @click="showDropdown = !showDropdown">
            <slot name="button"></slot>
        </div>
        <div class="dropdown__items" v-show="showDropdown">
            <slot name="items"></slot>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'
export default ({
    setup() {
        const showDropdown = ref(false)

        return {
            showDropdown
        }
    },
})
</script>


<style scoped lang="scss">
.dropdown {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    &__btn {
        border-radius: 2px;
        width: 100%;
        height: 50px;
        cursor: pointer;
    }
    &__items {
        width: 100%;
        position: absolute;
        z-index: 1000;
        top: 50px;
    }
}
</style>