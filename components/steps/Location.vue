<template>
    <div class="location" v-if="searchResult">
        <div class="location__actions">
            <InputGroup class="location__input" :data="{ label: '', placeholder: 'Type to Search', type: 'text', required: true, error: ''}" v-model="searchQuery"/>
            <Button class="location__btn_add" :data="{ type: 'primary', title: 'Add New', icon: 'fas fa-edit' }" v-if="!searchResult.length" @click="submit(searchQuery)"/>
        </div>
        <div class="location__items">
            <div class="location__item" v-for="(item, index) in searchResult" :key="`location__item-${index}`" @click="submit(item)">
                {{ item }}
            </div>
        </div>
    </div>
</template>

<script>
import InputGroup from '../form/InputGroup'
import Button from '../form/Button'
import { ref, computed } from 'vue'

export default({
    props: ['items'],
    components: {
        InputGroup,
        Button
    },
    setup(props, {emit}) {
        const searchQuery = ref('')
        const searchResult = computed(() => {
            const searchLowerCaseText = searchQuery.value.toLowerCase()
            if(searchLowerCaseText) return props.items.data.filter(el => {
                const searchOption = el.split(' ').join('').toLowerCase()
                if(searchOption.includes(searchLowerCaseText)) return el
            })
            return props.items.data
        })

        function submit(item) {
            emit('submit', item)
        }

        return {
            searchQuery,
            searchResult,
            submit
        }
    },
})
</script>

<style scoped lang="scss">
.location {
    width: 420px;
    max-width: 100%;
    height: 100%;
    padding-bottom: 40px;
    &__actions {
        position: relative;
    }
    &__btn_add {
        position: absolute;
        right: 0;
        top: 0;
        height: 100%;
        display: flex;
        align-items: center;
    }
    &__items {
        height: 100%;
        overflow-y: auto;
    }
    &__item {
        text-align: left;
        padding: 5px 10px;
        cursor: pointer;
        &:nth-of-type(2n) {
            background: #eaeaea;
        }
    }
    &__input {
        width: 100%;
    }
}
</style>

