<template>
    <div class="color">
        <InputGroup class="color__input" :data="{ label: '', placeholder: 'Type to Search', type: 'text', required: true, error: ''}" v-model="searchQuery"/>
        <div class="color__items-container">
            <div class="color__category" v-for="category in searchResult" :key="category.name">
                <div class="color__title">{{ category.name }}</div>
                <div class="color__items">
                    <div v-if="category.colours && !category.colours.length" class="color__no-found">Nothing found</div>
                    <div class="color__item"  
                        v-for="(item, index) in category.colours" 
                        :key="`${category.name}-item-${index}`" 
                        @click="$emit('submit', item)"
                        v-else
                    >
                        <img loading="lazy" class="color__image" :src="item.image_url" :alt="`color-${item.name}`">
                        <div class="color__name">{{ item.full_name }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import InputGroup from '../form/InputGroup'
import { ref, computed } from 'vue'

export default({
    components: {
        InputGroup,
    },
    props: ['items'],
    setup(props, context) {   
        const searchQuery = ref('')
        const searchResult = computed(() => {
            const searchLowerCaseText = searchQuery.value.toLowerCase()
            const filterArray = JSON.parse(JSON.stringify(props.items.data))
            if(searchLowerCaseText) {
                filterArray.forEach(category => {
                    category.colours = category.colours.filter(item => {
                        const searchOption = item.full_name.split(' ').join('').toLowerCase()
                        if(searchOption.includes(searchLowerCaseText)) return item
                    })
                })
            } 
            return filterArray
        })
        
        return {
            searchQuery,
            searchResult,
        }        
    },
})
</script>

<style scoped lang="scss">
.color {
    width: 100%;
    &__input {
        width: 400px;
        max-width: 100%;
    }
    &__items-container {
        overflow-y: auto;
        overflow-x: hidden;
        height: calc(100% - 60px);
        margin-top: 20px;
    }
    &__category {
        margin-top: 20px;
        &:first-of-type {
            margin-top: 0;  
        }
    }
    &__title {
        text-transform: uppercase;
        font-size: 24px;
        text-align: left;
        margin-bottom: 10px;
        font-family: Sansation;
    }
    &__items {
        display: flex;
        flex-wrap: wrap;
        width: calc(100% + 40px);
        transform: translateX(-20px);
        @media(max-width: 768px) {
            justify-content: center;
        }
    }
    &__item {
        display: flex;
        flex-direction: column;
        margin: 0 20px 20px;
        cursor: pointer;
        width: 155px;
    }
    &__image {
        width: 100%;
        height: 90px;
        border: 2px solid #000;
    }
    &__name {
        margin-top: 5px;
        text-align: center;
        width: 100%;
    }
    &__no-found {
        margin-left: 20px;
    }
}
</style>
