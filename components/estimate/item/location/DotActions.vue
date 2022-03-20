<template>
    <div class="top__actions">
        <div class="top__actions-container" @click="showDropdown = !showDropdown">
            <svg-icon-qouting data="fas fa-ellipsis-h" />
        </div>
        <div class="actions__dropdown" v-if="showDropdown">
            <div class="actions__item" 
                v-for="item in actions" 
                :key="item.event" 
                @click="$emit(`${item.event}`), showDropdown = !showDropdown"
            >
                <svg-icon-qouting :data="item.icon" />
                <span>{{ item.title }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import Button from '../../../form/Button.vue'
import Options from './Options.vue'
import { ref, computed } from 'vue'

export default ({
    props: ['data'],
    components: {
        Button,
        Options
    },
    setup(props) {
        const actions = [
            {
                title: 'Clone',
                event: 'clone',
                icon: 'fas fa-clone',
            },
            {
                title: 'Delete',
                event: 'remove',
                icon: 'fas fa-trash-alt',
            }
        ]
        const showDropdown = ref(false)
        
        return {
            actions,
            showDropdown,
        }
    },
})
</script>


<style scoped lang="scss">

.top {
    &__actions {
        background: linear-gradient(0deg, rgba(11, 53, 83, 0.15), rgba(11, 53, 83, 0.15)), #FFFFFF;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        position: relative;
        color: #000;
        &-container {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
}
.actions {
    &__dropdown {
        position: absolute;
        right: 0;
        bottom: -100%;
        transform: translateY(55%);
        min-width: 142px;
        padding: 10px 0;
        background: linear-gradient(0deg, rgba(11, 53, 83, 0.05), rgba(11, 53, 83, 0.05)), #FFFFFF;
        border: 1px solid rgba(11, 53, 83, 0.2);
        box-shadow: 0px 3px 3px rgba(28, 40, 51, 0.1);
        z-index: 10;
    }
    &__item {
        margin-bottom: 10px;
        text-align: right;
        text-transform: uppercase;
        padding: 0 10px;
        font-weight: 600;
        cursor: pointer;
        &:last-of-type {
            margin-bottom: 0;
        }
        span {
            display: inline-block;
            margin-left: 5px;
        }
    }

    
}

</style>