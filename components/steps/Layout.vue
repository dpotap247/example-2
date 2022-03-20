<template>
    <div class="items__container" v-if="items">
        <div class="item__wrapper"  
            v-for="(item, index) in items.data" 
            :key="`layout-item-${item.id}${index}`" >
            <Item 
                :item="item"
                @selected="$emit('submit', item)" 
            />
        </div>
    </div>
</template>


<script>
import Item from './elements/Item'
import Loader from '../elements/Loader.vue'

export default({
    components: {
        Item,
        Loader
    },
    props: ['items'],
})
</script>

<style scoped lang="scss">
.items__container {
    margin-top: -40px;
    min-height: auto!important;
    @media(max-width: 768px) {
        margin-top: 0;
    }
}
::v-deep .icons, ::v-deep  .item__icon {
    max-height: none;
}
</style>