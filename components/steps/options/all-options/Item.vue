<template>
    <div class="category">
        <div class="category__title">{{ category }}</div>
        <div class="category__items">
            <div class="category__item item" v-for="(item, index) in items" :key="`${category.toLowerCase()}-item-${index}`" @click="$emit('selected', item.id)">
                <div class="item__icon-wrapper">
                    <img class="item__img" :src="item.data.image_url" alt="" v-if="item.data && item.data.image_url">
                    <svg-icon-qouting class="item__icon" color="var(--SecondaryColour)" :data="item.icon" v-else/>
                </div>
                <div class="item__title">{{ getTitle(item) }}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default({
    props: ['category', 'items'],
    setup() {
        function getTitle(item) {
            if(item.name.toLowerCase() == 'option') return item.option
            return item.all_options_name || item.name
        }

        return {
            getTitle
        }
    }
})
</script>


<style scoped lang="scss">
.category {
    margin-bottom: 30px;
    &__title {
        font-size: 18px;
        line-height: 20px;
        text-transform: uppercase;
        color: #000000;
        text-align: left;
    }
    &__items {
        display: flex;
        flex-wrap: wrap;
        
    }
    &__item {
        margin-right: 40px;
        margin-top: 20px;
        text-align: center;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    @media(max-width: 768px) {
        &__items {
            justify-content: center;
        }
        &__item {
            margin: 20px 10px 0;
        }
    }
}
.item {
    &__title {
        font-size: 18px;
        margin-top: 5px;
    }
    &__icon {
        font-size: 150px;
        display: flex;
        &-wrapper {
            height: 100%;
            display: flex;
            align-items: center;
        }
        @media(max-width: 768px) {
            font-size: 120px;
        }
    }
    &__img {
        border: 2px solid #000;
    }
}
</style>