<template>
    <Modal class="action-required-modal" v-model="modelValue" @update:modelValue="$emit('update:modelValue', $event)">
        <div style="width: 100%;">
            <div class="modal__title">
                Action required
            </div>
            <div class="modal__desc">
                {{ desc }}
                <br>
                <br>
                Please one of the following options: 
            </div>
            <div class="modal__actions">
                <Button :data="item" v-for="item in actions" :key="item.title" @click="$emit(`${item.event}`)"/>
            </div>
        </div>
    </Modal>
</template>

<script>
import Button from '../../../form/Button.vue'
import Modal from '../../../elements/Modal.vue'

export default ({
    props: ['modelValue', 'desc'],
    components: {
        Modal,
        Button
    },
    setup() {
        const actions = [
            // {
            //     type: 'primary',
            //     title: 'Yes, remove it',
            //     event: 'remove'
            // },
            {
                type: 'primary',
                title: 'Let me choose',
                event: 'goToOption'
            },
            {
                type: 'primary',
                title: 'No, keep it',
                event: 'keepIt',
            },
        ]

        return {
            actions
        }
    }
})
</script>

<style scoped lang="scss">
.modal {
    &__title {
        text-decoration: uppercase;
        font-size: 26px;
        text-align: left;
        font-family: Sansation;
    }
    &__desc {
        font-size: 16px;
        font-weight: 300px;
        margin-top: 20px;
        text-align: left;
    }
    &__actions {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin-top: 20px;
        & > .btn {
            min-width: 140px;
            margin-right: 20px;
        }
    }
}
.action-required-modal {
    ::v-deep .modal {
        width: 470px;
    }
}
</style>