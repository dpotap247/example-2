<template>
  <svg-icon-qouting class="help_topic" @click.stop="showModal = true" color="#2980B9" data="far fa-question-circle" />
  <Modal class="help_topic_modal" v-model="showModal"  @click.stop>
    <iframe class="help_topic_modal__frame"
        v-if="showModal"
        :src="iframeData"
    />
  </Modal>
</template>

<script>
import { ref } from 'vue'
import Modal from "../elements/Modal";

export default {
name: "HelpTopic",
  components: {
    Modal
  },
  props: ['iframeData'],
  setup() {
    const showModal = ref(false)
    return {
      showModal
    }
  }
}
</script>

<style scoped lang="scss">
  .help_topic {
    cursor: pointer;
  }
  .help_topic_modal {
    &__frame {
      width: 100%;
      height: 100%;
    }
    ::v-deep .modal {
      width: 768px;
      height: calc(100% - 40px);
      @media(max-width: 768px) {
        width: 100%;
      }
    }
  }
</style>