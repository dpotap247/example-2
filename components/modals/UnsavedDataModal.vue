<template>
    <Modal class="unsaved-modal" v-model="modelValue" @update:modelValue="submit()">
        <div class="unsaved-modal__content">
            Want to continue with unsaved data?
            <div class="unsaved-modal__actions">
                <Button :data="{ type: 'outline', title: 'No' }" @click="submit()"/>
                <Button :data="{ type: 'primary', title: 'Yes' }" @click="submit('loadData')"/>
            </div>
        </div>
    </Modal>
</template>

<script>
import Modal from '../elements/Modal'
import Button from '../form/Button'

export default({
    props: ['modelValue'],
    components: {
        Modal,
        Button
    },
    setup(props, { emit }) {
       function submit(loadData) {
           if(loadData) {
               const data = sessionStorage.getItem('wizardCurrentStep') && JSON.parse(sessionStorage.getItem('wizardCurrentStep'))
               emit('loadData', data)
           } else emit('closeModal')
       } 

       return {
           submit
       }
    },
})
</script>

<style scoped lang="scss">
.unsaved-modal {
    // &__content {
    //     display: flex; 
    //     flex-direction: column;
    // }
    height: 100%;
    top: 0;
    min-width: 100%;
    &__actions {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 25px;
    }
    ::v-deep .modal {
        width: 330px;
        min-height: 130px;
        height: 130px;
    }
    ::v-deep .btn_outline {
        border-color: var(--PrimaryButtonColour);
        color: var(--PrimaryButtonColour);
        margin-right: 20px;
    }
}

</style>
