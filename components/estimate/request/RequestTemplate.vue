<template>
    <div class="template">
        <div class="template__title">
            {{ title }}
        </div>
        <p class="template__desc">{{ desc }}</p>
        <slot></slot>
    </div>
</template>

<script>

export default ({
    props: ['title', 'desc'],
})
</script>



<style scoped lang="scss">
.template {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    &__title {
        font-weight: bold;
        font-size: 25px;
        line-height: 100%;
    }
    &__icon {
        // color: yellow;
        // display: block;
    }
    &__desc {
        font-size: 15px;
        line-height: 140%;
        margin: 20px auto;
        font-weight: normal;
    }
}
</style>