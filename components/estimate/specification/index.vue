<template>
    <div class="specification container" v-if="data">
        <div class="link__back" @click="$router.back()">
            <svg-icon-qouting class="estimate__btn_back" data="fas fa-arrow-left" />
            <span>Back to Estimate</span>
        </div>
        <div class="specification__header">
            <Info class="specification__info" :data="data" /> 
            <div class="specification__summary" v-if="data.finance">
                <div class="specification__title">Order Summary</div>
                <Summary :summary="data.finance"  />
            </div>
        </div>
         <div class="specification__items">
            <div class="specification__title">Product Details</div>
            <div class="specification__item" v-for="(item, index) in data.mainItems" :key="index">
                <div class="item__name">{{ item.name }}</div>
                <div style="display: flex;">
                    <div class="item__img" v-if="item.layout_image || item.icon">
                        <svg-icon-qouting  :data="item.layout_image || item.icon" alt="" />
                    </div> 
                    <div class="item__requireds" :style="[{ height: `${getItemsHeight(item)}px` }]">
                        <div class="item__required" v-for="(required, key) in item.required" :key="key">
                            <strong> {{ key }}:</strong> <span v-html="getString(required)"></span>
                        </div>
                        <div class="item__required"  v-for="(option, key) in item.optional" :key="key">
                           <strong> {{ key }}:</strong> <span v-html="getString(option)"></span>
                        </div>
                    </div>
                </div>
                 <div class="item__price">
                   Price {{formatter.formatMoney(item.price)}}
                </div>
                
            </div>
        </div>
    </div>
</template>

<script>
import Button from '../../form/Button.vue'
import Summary from '../item/summary/Receipt'
import Info from './Info'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import api from '../../../services/item.service'
import { useFormatter } from '../../../composables/formatter'
import { useStore } from 'vuex'


export default ({
    props: ['id'],
    components: {
        Button,
        Info,
        Summary
    },
    setup(props) {
        // const reviewButtons = ref([
        //     { title: 'Approve', type: 'primary', loading: false, event: 'approve' },
        //     { title: 'Reject', type: 'primary', loading: false, event: 'reject' }
        // ])

        const data = ref(null)
        const formatter = useFormatter()
        const route = useRoute()
        const store = useStore()
        const routeId  = route.params.id

        getData()
        async function getData() {
            store.commit('setField', {
                field: 'loading', value: true,
            })
           data.value = await api.getSpecification(routeId)
            store.commit('setField', {
                field: 'loading', value: false,
            })
        }   

        function getString(data) {
            if(Array.isArray(data)) return `${data.join('</div><div style="margin-top: 5px;">')}`
            return data
        }

        function getItemsHeight(item) {
            let requiredLength = !Array.isArray(item.required) && Object.keys(item.required).length
            let optionalLength = !Array.isArray(item.optional) && Object.keys(item.optional).length
            
            for(const key in item.required) {
                const value = item.required[key] 
                if(Array.isArray(value)) requiredLength += value.length - 1 
            }

            for(const key in item.optional) {
                const value = item.optional[key]
                if(Array.isArray(value)) optionalLength += value.length - 1 
            }

            const path = Math.round((optionalLength + requiredLength) / 2) 
            const height = path * 28

            return height
        }

        return {
            // reviewButtons,
            data,
            formatter,
            getItemsHeight,
            getString   
        }
    },
})
</script>


<style scoped lang="scss">
::v-deep .item__line {
    .item__price {
        min-width: auto;
    }
}
.specification {
    height: 100%;
    padding: 20px;
    width: 100%;
    padding: 75px 0;
    @media(max-width: 1200px) {
        padding: 75px 20px;
    }
    &__items {
        margin-top: 20px;
    }
    &__title {
        font-family: Sansation;
        text-align: left;
        font-size: 21px;
        line-height: 120%;
        margin-bottom: 5px;
    }
    &__header {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }
    &__summary {
        width: 350px;
    }
    &__info {
        margin-bottom: 20px;
    }
    &__item {
        margin-top: 10px;
        width: 100%;
        border-top: 1px solid #333;
        padding-top: 10px;
        &:last-of-type {
            border-bottom: 1px solid #333;
            padding-bottom: 10px;
        }
    }
}
.item {
    &__name {
        text-align: left;
        margin-bottom: 10px;
        font-family: Sansation;
        font-size: 18px;
    }
    &__requireds {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        width: 100%;
    }
    &__img {
        width: 100px;
        font-size: 90px;
        margin-right: 30px;
        .icons__wrapper {
            display: flex;
        }
        img {
            width: 100%;
        }
        ::v-deep .svg-inline {
            max-width: 100%;
        }
    }
    &__required {
        margin-bottom: 5px;
        font-weight: 400;
        font-size: 16px;
        display: flex;
        margin-right: 100px;
        text-align: left;
        span {
            display: block;
            margin-left: 5px;
        }
    }
    &__price {
        text-align: right;
        color: var(--PrimaryColour);
    }
}
.optional__item {
    height: 24px;
    display: block;
}
</style>