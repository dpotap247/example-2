<template>
    <div class="items" v-for="(category) in categories" :key="category.title">
        <div class="items__title">
            {{ category.title }}
        </div>
        <div class="items__container">
            <Item 
                v-for="(item, index) in category.items" 
                :item="item" 
                :key="`item-${index}`" 
                @selected="$emit('submit', item)" 
            />
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'
import Item from './elements/Item'

export default({
  components: {
    Item
  },
    props: ['items'],
    setup(props) {
        const categories = ref([])
        getCategories()
        async function getCategories() {
            const array = []

            props.items.data.forEach(el => {
                const category = array.find(item => item.title == el.category)
                if(!category) {
                    array.push({title: el.category, items: []})
                    const lastItem = array[array.length - 1]
                    lastItem.items.push(el)
                } else category.items.push(el)
                
            }) 
            
            categories.value = array    
        }
        return {
            categories
        }
    },
})
</script>


<style scoped lang="scss">
.items {
    margin-bottom: 40px;
     &__title {
        font-size: 18px;
        line-height: 20px;
        text-transform: uppercase;
        color: #000000;  
    }
    &:last-of-type {
        margin-bottom: 0;
    }
}
::v-deep .item__title {
    max-width: 200px;
}
</style>