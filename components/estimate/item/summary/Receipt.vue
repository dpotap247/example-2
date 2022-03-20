<template>
    <div class="summary__items" v-if="summaryData.length">
        <template v-for="(item, index) in summaryData" :key="`summary-${item.amount}-${index}`">
            <div class="summary__item item" :class="{ bold: item.bold }" v-if="item.visible">
                <div class="item__name" >{{ item.name }}</div>
                <div class="item__line">
                    <div class="item__hr"></div>
                    <div class="item__arrow">></div>
                </div>
                <div class="item__price" >{{ formatter.formatMoney(item.amount || 0) }}</div>
            </div>
        </template>
    </div>
</template>

<script>
import { useFormatter } from '../../../../composables/formatter'
import { computed } from 'vue'
export default ({
    props: ['summary', 'removeTotal'],
    setup(props) {
        const formatter = useFormatter()


       const summaryData = computed(() =>  {
            if(!props.summary) return
            const data = []
            for(const key in props.summary) {
                const apiItem = props.summary[key]
                apiItem.name = key
                // item.name = key
                // if(apiItem.bold) item.bold = apiItem.bold
                if(apiItem.visible || apiItem.visible === undefined) apiItem.visible = true
                else apiItem.visible = false

                data.push(apiItem)
            }          
            if(props.removeTotal) {
                const totalIndex = data.findIndex(el => el.name == 'Total')
                data.splice(totalIndex, 1)
            }
            return data
        })
        
        return {
            formatter,
            summaryData
        }
    },
})
</script>

<style scoped lang="scss">
.summary__items {
    width: 300px;
    max-width: 100%;
}
.item {
    font-size: 15px;
    line-height: 140%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    &:last-of-type {
        margin-bottom: 0;
    }
    &__hr {
        width: 100%;
        border-top: 1px dashed rgba(11, 53, 83, 0.4);
        box-shadow: none;
        border-bottom: 0;
        position: relative;
        top: 3px;
    }
    &__line {
        // border-bottom: 1px dashed rgba(11, 53, 83, 0.4);
        margin: 0 12px;
        display: flex;
        align-items: center; 
        height: 100%;
        color: rgba(11, 53, 83, 0.4);
        width: 100%;
        // min-width: 190px;
        // transform: translateY();
        // @media(max-width: 768px) {
        //     min-width: 130px;
        // }
    }
    &__arrow {
        display: flex;
        align-items: center;
    }
    &__name {
        color: rgba(28, 40, 51, 0.8);
        white-space: nowrap;
    }
    &__price {
        // min-width: 46px;
        text-align: right;
    }
    &.bold {
        font-weight: bold;
        .item {
            &__hr {
                border-top: 1px dashed #1C2833; 
            }
            &__arrow {
                font-weight: 400;
                color: #1C2833;
            }
        }
    }
}
</style>
