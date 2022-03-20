<template>
    <div class="estimate__panel" >
        <div class="panel__title" >
            <svg-icon-qouting data="fas fa-layer-group"/> Quantity: {{ quantity }}
        </div>
        <Buttons 
            class="panel__actions"
            :data="actions"
            v-if="actions"
            @addNewItem="$emit('addNewItem')"
            @bulkEdit="$emit('bulkEdit')"
        />
    </div>
</template>

<script>
import Buttons from '../elements/Buttons.vue'
import { ref, computed } from 'vue'
export default ({
    props: ['buttons', 'quantity', 'stateEstimate'],
    components: {
        Buttons,
    },
    setup(props) {
        const actions = computed(() => {
            const addNewItem = props.buttons.find(el => el.name.toLowerCase().includes('new item'))
            const bulkEdit = props.buttons.find(el => el.name.toLowerCase().includes('bulk edit'))
            
            return [
                !props.stateEstimate && addNewItem ? { ...addNewItem, event: 'addNewItem', icon: 'fas fa-plus'} : {},
                bulkEdit ? { ...bulkEdit, event: 'bulkEdit' } : {}
            ]
        })


        return {
            actions
        }
    },
})
</script>

<style scoped lang="scss">
.estimate {
    &__panel {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}
.panel {
    &__title {
        font-size: 21px;
        line-height: 140%;
        color: #1C2833;
        font-weight: bold;
        font-family: Sansation;
    }
}

@media(max-width: 768px) {
    .estimate {
        &__panel {
            flex-direction: column;
            align-items: flex-start;
        }
    }
    .panel {
        &__actions {
            margin-top: 20px;
        }
    }
}
</style>