<template>
    <Dropdown class="dropdown" >
        <template #button>
            <div class="btn">
                <span>{{ title }}</span> <span class="btn__value">{{ summary['Total'] && formatter.formatMoney(summary['Total'].amount) }}</span>
                <img class="btn__icon" src="/images/svg/dropdown-icon.svg" alt="">
            </div>
        </template>

        <template #items>
            <div class="items">
                <Receipt :summary="summary" :removeTotal="true"/>
            </div>
        </template>
    </Dropdown>
</template>

<script>
import Dropdown from '../../../elements/Dropdown.vue'
import Receipt from '../summary/Receipt.vue'
import { useFormatter } from '../../../../composables/formatter'
import { ref } from 'vue'

export default ({
    props: ['summary', 'title'],
    components: {
        Dropdown,
        Receipt
    },
    setup(props) {
        const formatter = useFormatter()

        return {
            formatter,
        }        
    },
})
</script>


<style scoped lang="scss">
.dropdown {
    width: 325px;
    max-width: 100%;
}
.btn {
    background: linear-gradient(0deg, #0B3553, #0B3553), #FFFFFF;
    box-shadow: 0px 3px 3px rgba(28, 40, 51, 0.2);
    border-radius: 2px;
    width: 100%;
    height: 50px;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    text-align: center;
    padding: 0 20px;
    color: #fff;
    font-weight: bold;
    &__value {
        display: block;
        margin-left: 10px;
        border-bottom: 1px dashed rgba(255, 255, 255, 0.5);
    }
    &__icon {
        transform: rotate(180deg);
        margin-left: 5px;
    }
}
.open {
    .btn__icon {
        transform: rotate(0);
    }
}
.items {
    padding: 20px 20px 40px;
    background: linear-gradient(0deg, rgba(11, 53, 83, 0.07), rgba(11, 53, 83, 0.07)), #FFFFFF;
    box-shadow: 0px 0px 10px rgba(28, 40, 51, 0.3);
}
// ::v-deep .item__line {
//     min-width: 50px;
//     // margin: 0 5px 0 15px;
// }
// ::v-deep .item__price {
//     min-width: 70px;
// }
</style>