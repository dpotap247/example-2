<template>
    <div class="info" v-if="data">
        <div class="info__content">
            <div class="info__section info__main">
                <div class="info__title">
                    Order
                    {{ data && data.status == 'Draft' ? 'Review' : 'Details' }}
                </div>
                <span v-if="data.number">Order ID Number: {{ data.order_id }}</span>
                <span v-if="data.date"> Date: {{ data.order_date }}</span>
                <span v-if="data.status">Reference: {{ data.status }}</span>
            </div>
            <div class="info__section info__role" v-for="item in roles" :key="item.role">
                <div class="info__title" v-if="item.role">{{ item.role }}</div>
                <template v-if="item.name">
                    <span v-if="item.name">{{ item.role }}: {{ item.name }}</span>
                    <span v-if="item.email">Email: {{ item.email }}</span>
                    <span v-if="item.phone">Phone: {{ item.phone }}</span>
                    <span v-if="item.address">Address: {{ item.address }}</span>
                </template>
                <span v-else>No data</span>
            </div>
        </div>
   
    </div>
</template>

<script>
import { ref } from 'vue'
export default ({
    props: ['data'],
    setup(props) {


        const roles = []
        const customer = props.data.customer && { role: 'Customer', ...props.data.customer } || { role: 'Customer' }
        const dealer = props.data.dealer && { role: 'Dealer', ...props.data.dealer } || { role: 'Dealer' }
        
        roles.push(customer)
        roles.push(dealer)

        return {
            roles
        }
    },
})
</script>


<style scoped lang="scss">
.info {
    &__title {
        font-family: Sansation;
        text-align: left;
        font-size: 21px;
    }
    &__content {
        display: flex;
        flex-wrap: wrap;
        width: 700px;
    }
    &__actions {
        display: flex;
        align-items: center;
    }
    &__main, &__role {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        & > span {
            display: block;
            margin-top: 5px;
        }
    }
    &__section {
        width: 50%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin-bottom: 20px;
    }
}
</style>