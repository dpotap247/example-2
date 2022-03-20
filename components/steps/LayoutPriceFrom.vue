<template>
    <div class="items__container" v-if="data">
        <div class="item__wrapper"  
            v-for="(item, index) in data" 
            :key="`layout-item-${item.id}${index}`" >

            <Item 
                :item="item"
                @selected="$emit('submit', item)" 
            />
            <div class="item__price" :class="{ disabled: item.disabled }">
                From 
                <Loader v-if="!item.price_from" />
                <template v-else>{{ formatter.formatMoney(item.price_from) }}</template>
            </div>

        </div>
    </div>
</template>

<script>
import Item from './elements/Item'
import Loader from '../elements/Loader.vue'
import api from '../../services/wizard.service'
import { useFormatter } from '../../composables/formatter'
import { useLimitsLogic } from '../../composables/estimate/limits'
import { ref } from 'vue'

export default({
    components: {
        Item,
        Loader
    },
    props: ['items', 'currentStep', 'stepName', 'allData'],
    setup(props) {
        const formatter = useFormatter()
        const data = ref(null)
        
        //check disabled items
        const limitsLogic = useLimitsLogic(props)

        getData()
        function getData() {
            data.value = props.items.data.map(el => {
                const disabled = limitsLogic.getDisabledValue(el.limits)

                return {
                    ...el, 
                    price_from: '',
                    disabled,
                }
            })
            getFromPriceForItems()
        }

        function getFromPriceForItems() {
            data.value.forEach( async (el) => {
                const type = props.stepName.toLowerCase()
                const id = el.id
                const { current_step, steps } = props.allData
                const result = await api.getFromPrice(type, id, { current_step, steps })
                el.price_from = result.min_price || ''
            })
        }



        return { 
            data,
            formatter
        }
    }
})
</script>


<style scoped lang="scss">
.items__container {
    margin-top: -40px;
    min-height: auto!important;
    ::v-deep .item {
        margin-bottom: 0;
    }
     @media(max-width: 768px) {
        margin-top: 0;
    }
}
::v-deep .item__title {
    min-height: auto;
}


.item__price {
    text-align: center;
    display: flex;
    justify-content: center;
    &.disabled {
        color: #777777;
    }
    ::v-deep .spinner svg {
        font-size: 17px!important;
        margin-left: 5px;
    } 
}

</style>