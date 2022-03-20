<template>
    <div class="item" :class="{'disabled': item.disabled}" @click="onClick"> 
        <div class="item__icon" >
            <svg-icon-qouting :data="item.icon" :color="item.disabled && '#777777'"/>
        </div>
        <div class="item__title">
            {{ item.name }}&nbsp;
            <HelpTopic v-if="item.help_topic_url" :iframe-data="item.help_topic_url"/>
        </div>
    </div>
</template>

<script>
import HelpTopic from '../../elements/HelpTopic.vue'

export default({
    components: {
        HelpTopic,
    },
    props: ['item'],
    setup(props, { emit }) {
        function onClick() {
            if(props.item.disabled) return
            emit('selected')
        }

        return {
            onClick
        }
    },
})
</script>


<style scoped lang="scss">
.item {
    margin: 40px 45px 0;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    @media(max-width: 768px) {
        margin: 10px 15px;
    }
    &.disabled {
        .item__title {
            color: #777777;
        }
    }
    &__title {
        max-width: 180px;
        font-size: 15px;
        line-height: 140%;
        // text-transform: uppercase;
        color: #000000;  
        margin-top: 17px;
        min-height: 42px;
        display: inline;
    }
    &__icon, &__icon ::v-deep svg {
        // max-height: 150px;
        font-size: 150px;
        @media(max-width: 768px) {
            font-size: 120px;
        }
    }
    &__icon .icons__wrapper {
        display: flex;
    }
    &__title {
        margin-top: 5px;
    }
}
</style>