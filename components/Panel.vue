<template>
    <div class="panel">
        <div class="panel__actions">
            <Button class="panel__btn" :data="item" v-for="item in buttons" :key="`button-${item.event}`" @click="$emit(`${item.event}`)" /> 
        </div>
        <div class="panel__price" v-if="price">{{ formatter.formatMoney(price) }}</div>
    </div>
</template>

<script>
import Button from '../components/form/Button.vue'
import { useFormatter } from '../composables/formatter'

export default ({
    components: {
        Button
    },
    props: ['buttons', 'price'],
    setup() {
        const formatter  = useFormatter()

        return {
            formatter
        }
    },
})
</script>

<style scoped lang="scss">
.panel {
    height: 53px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--PrimaryColour);
    position: absolute;
    left: 0;
    bottom: 0;
    padding: 0 37px;
    &__actions {
        display: flex;
        align-items: center;
    }
    &__btn {
        margin-right: 20px;
        &:last-of-type {
            margin-right: 0;
        }
        span {
            margin: 0 auto;
            transform: translateX(10px);
        }
    }
    .btn__arrow {
        // margin-left: auto;
        margin-right: 4px;
    }
    &__price {
        color: var(--PrimaryButtonTextColour)
    }
    @media(max-width: 900px) {
        flex-wrap: wrap;
        flex-direction: column-reverse;
        align-items: flex-start;
        height: auto;
        min-height: 53px;
        padding: 10px;
        &__price {
            margin-bottom: 10px;
            margin-left: auto;
        }
    }
    @media(max-width: 768px) {
        width: calc(100% + 20px);
        position: relative;
        bottom: -10px;
        left: -10px;
        &__actions { 
            flex-wrap: wrap;
            .btn {
                margin-bottom: 10px;
                &:last-of-type {
                    margin-bottom: 0;
                }
            }
        }
    }
}
</style>