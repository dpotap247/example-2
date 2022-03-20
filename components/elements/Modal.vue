<template>
    <div class="modal-wrapper" :class="{show: modelValue}" >
        <div class="modal">
            <img class="modal__close" src="/images/close.svg" alt="close" @click="$emit('update:modelValue', false)">
            <slot></slot>
        </div>
    </div>
</template>

<script>

export default({
    props: ['modelValue'],
    watch: {
        modelValue(value) {
            this.overflowLogic(value)
        }
    },
    beforeUnmount() {
        this.overflowLogic()
    },
    methods: {
        overflowLogic(value) {
            const body  = document.querySelector('body')
            if(value) body.classList.add('overflow-hidden')
            else if(body.classList.contains('overflow-hidden')) body.classList.remove('overflow-hidden')
        }
    }
})
</script>





<style scoped lang="scss">
.modal-wrapper {
    position: fixed;
    overflow: auto;
    left: 0;
    background-color: rgba(0,0,0,0.5);
    display: block!important;
    top: 50px;
    min-width: 100vw;
    z-index: -100;
    height: calc(100% - 100px);
    transition: 0.5s ease-in;
    opacity: 0;
    &.show {
        opacity: 1;
        z-index: 1000;
        .modal {
            opacity: 1;
            top: 50%;
        }
    }
}
.modal {
    padding: 25px;
    position: relative;
    border-radius: 2px;
    opacity: 0;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
    background: #fff;
    min-height: 150px;
    width: 370px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    font-size: 17px;
    &__close {
        position: absolute;
        right: 10px;
        top: 10px;
        cursor: pointer;
        z-index: 100;
        width: 15px;
        height: 15px;
    }
}
</style>