<template>
    <div class="select-color" @click="showModal">
        <img src="/images/black.jpeg" alt="">
    </div>
    <Modal 
        class="select-color__modal" 
        v-model="show" 
        :items="items" 
        @submit="$emit('submit', $event), showModal(false)"
    />
</template>

<script>
import Modal from '../modals/SelectColorModal.vue'
import api from '../../services/wizard.service'
import { ref } from 'vue'

export default ({
    props: ['colorGroup'],
    components: {
        Modal,
    },
    setup(props) {
        const show = ref(false)
        const items = ref(null)

        function showModal(value) {
            show.value = value
            if(value && !items.value) getData() 
        }

        async function getData() {
            items.value = { data: await api.getColors(props.colorGroup) }
        }
        

        return {
            showModal,
            show,
            getData,
            items
        }
    },
})
</script>


<style scoped lang="scss">
.select-color {
    width: 100px;
    cursor: pointer;
    img {
        max-width: 100%;
        border: 2px solid #000;
    }
    &__modal {
        // height: 100%;
        ::v-deep .modal {
            padding: 20px;
            @media(max-width: 768px) {
                padding: 30px 20px 20px;
            }
        }
    }
}
.estimate {
    .select-color__modal {
        height: 100%;
    }
}
</style>