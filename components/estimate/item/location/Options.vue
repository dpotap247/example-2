<template>
    <div class="options">
        <div class="options__top">
            <div class="options__count" @click="showDropdown"  v-if="data.accessories_count">
                <span>+{{ data.accessories_count }} available options</span> <svg-icon-qouting class="chevron" data="fas fa-chevron-down" />
            </div>
            <div class="options__price">{{ formatter.formatMoney(data.d_product_price) }}</div>
        </div>
         <div v-if="show" class="options__dropdown">
             <Loader class="dropdown__loader" v-if="!data.options || !data.options.length"/>
            <div class="dropdrown__item" v-for="(item, index) in data.options" :key="index">
                {{ item }}
            </div>
        </div>
        
    </div>
</template>

<script>
import  { ref } from 'vue'
import { useFormatter } from '../../../../composables/formatter'
import api from '../../../../services/item.service'
import Loader from '../../../elements/Loader.vue'

export default ({
    components: {
        Loader
    },
    props: ['data'],
    setup(props, { emit }) {
        const formatter = useFormatter()
        const show = ref(false)

        function showDropdown() {
            if(!props.data.options && props.data.accessories_count) getOptions()
            show.value = !show.value
        }

        async function getOptions() {
            const estimateType = localStorage.getItem('estimateType')
            const result = await api.getItemAcessories(props.data.id, estimateType)
            props.data.options = result
        }

        return {
            showDropdown,
            show,
            formatter
        }  
    },
})
</script>

<style lang="scss" scoped>
.options {
    font-size: 13px;
    line-height: 100%;
    width: 100%;
    &__top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-weight: bold;
        width: 100%;
    }
    &__dropdown {
        text-align: left;
        display: flex;
        flex-direction: column;
    }
    &__price {
        margin-left: auto;  
    }
    &__count {
        color: rgba(89, 182, 146, 0.8);
        cursor: pointer;
        display: flex;
        align-items: center;
        span {
            border-bottom: 1px dashed rgba(89, 182, 146, 0.8);
        }
        .chevron {
            font-size: 10px;
            font-weight: bold;
            margin-left: 3px;
        }
        
    }
}
.dropdrown {
    &__item {
        margin-top: 5px;
    }
}
::v-deep .spinner.dropdown__loader svg {
    font-size: 25px!important;
    margin-top: 15px;
}
    
</style>
