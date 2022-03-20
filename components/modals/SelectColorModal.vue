<template>
    <Modal class="select-color-modal" v-model="show">
        <Loader customClass="big" class="select-color-modal__loader" v-if="!items" />
        <Color :items="items" v-else @submit="$emit('submit', $event)"/>
    </Modal>
</template>

<script>
import Modal from '../elements/Modal.vue'
import Color from '../steps/Color.vue'
import Loader from '../elements/Loader.vue'

import { ref, computed } from 'vue'

export default ({
    props: ['items', 'show'],
    components: {
        Modal,
        Color,
        Loader,
    },
})
</script>

<style scoped lang="scss">
.estimate {
    .select-color-modal {
        top: 0;
        min-width: 100%;
        ::v-deep .modal {
            max-width: 100%;
        }
    }
}
.select-color-modal {
    ::v-deep .modal {
        max-width: 1040px;
        width: calc(100% - 100px);
        top: 50%!important;
        height: calc(100% - 100px);
    }
    ::v-deep .color {
        height: 100%;
    }
}
</style> 
