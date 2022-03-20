<template>
    <button class="btn" :class="[`btn_${data.type}`]" :disabled="disabled || data.loading" @click="updLoading">
        <Spinner class="btn__loader" color="var(--PrimaryButtonTextColour)" v-if="data.loading" />
        <svg-icon-qouting :data="data.icon" color="white" v-else-if="data.icon" class="btn__icon"/>
        <div class="btn__title">{{ data.title }}</div>
        <div class="hidden">
            <slot ></slot>
        </div>
    </button>
</template>

<script>
import { useRouter } from 'vue-router'
import Spinner from '../elements/Loader.vue'

export default({
    props: ['data', 'disabled'],
    components: {
        Spinner
    },
    setup(props, { emit }) {
        const router = useRouter()

        function updLoading() {
            if(props.data.href) router.push(props.data.href)
            else if('loading' in props.data) props.data.loading = !props.data.loading
            if(props.data.event) emit(`${props.data.event}`)
        }

        return {
            updLoading
        }
    },
})
</script>

<style scoped lang="scss">
.btn {
    padding: 10px 34px;
    border-radius: 2px;
    margin: 0;
    border: none;
    box-shadow: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    height: 32px;
    &_primary {
        background: var(--PrimaryButtonColour);
        color: var(--PrimaryButtonTextColour);
    }
    &_outline {
        cursor: pointer;
        border: 3px solid var(--SecondaryTextColour);
        background: none;
        font-weight: bold;
        font-size: 15px;
        line-height: 140%;
        text-transform: uppercase;
        color: #FFFFFF;
        display: flex;
        align-items: center;
    }
    &__icon, &__loader {
        margin-right: 9px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    &__loader {
        max-width: 15px;
        color: #fff;
    }

    &__title {
        font-weight: bold;
        font-size: 15px;
        // line-height: 70%;
        letter-spacing: 0.02em;
        text-transform: uppercase;   
        white-space: nowrap;
    }
    .hidden {
        position: absolute;
        cursor: pointer;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
    }
}
</style>
