<template>
    <div class="line" :class="{ 'vertical': vertical }">
        <span class="line__text" v-if="text">{{ text }}</span>
        <div class="line__triangle"></div>
        <div class="line__hr"></div>
        <div class="line__triangle"></div>
    </div>
</template>

<script>
export default ({
    props: ['vertical', 'text'],
    setup() {
        
    },
})
</script>



<style scoped lang="scss">
.line {
    width: calc(100% + 4px);
    transform: translateX(-2px);
    height: 5px;
    display: flex;
    align-items: center;
    &.vertical {
        width: 5px;
        height: calc(100% + 2px);
        transform: translateY(-1px);
        flex-direction: column;
        
        .line {
            &__hr {
                height: 100%;
                width: 2px;
            }
            &__triangle { 
                margin: 0;
                &:first-of-type {
                    transform: rotate(0);
                    margin-bottom: -2px;
                }
                &:last-of-type {
                    transform: rotate(180deg);
                    margin-top: -2px;
                }
            }
            &__text {
                right: -35px;
                top: 50%;
                writing-mode: vertical-rl;
                text-orientation: upright;
                width: auto;
                letter-spacing: 0;
            }
        }
    }
    &__text {
        position: absolute;
        top: -10px;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 10px;
        line-height: 100%;
        text-transform: uppercase;
        letter-spacing: 2px;
        width: 100%;
    }
    &__hr {
        width: 100%;
        height: 2px;
        background: #000;
    }
    &__triangle {
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-bottom: 8px solid #000;
        z-index: 30;
        &:first-of-type {
            transform: rotate(-90deg);
            margin-right: -2px;
        }
        &:last-of-type {
            transform: rotate(90deg);
            margin-left: -2px;
        }
    }
}
</style>