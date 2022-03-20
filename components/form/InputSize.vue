<template>
    <div class="input-size"  :class="{error: item && item.error}" >
        <div class="input-size__prefix" v-if="data.pref"><slot name="label" class="prefix__slot"></slot>{{ data.pref }}</div>
        <input class="input-size__input"  
            :type="data.type" 
            :value="modelValue" 
            :disabled="disabled"
            min="0"
            @focus="item.error = false"
            @input="$emit('update:modelValue', $event.target.value)"
            >
        <div class="input-size__suf" v-if="data.suf">{{ data.suf }}</div>
    </div>
</template>

<script>

export default({
    props: ['data', 'item', 'modelValue', 'disabled'],
})
</script>


<style scoped lang="scss">
.input-size {
    font-size: 15px;
    line-height: 100%;
    display: flex;
    align-items: flex-end;
    &__prefix {
        display: flex;
        align-items: center;
        ::v-deep .help_topic {
            margin-right: 5px;
            display: inline-block;
        }
    }
    &__input {
        border: none;
        margin: 0 11px;
        width: 88px;
        border-bottom: 1px solid #000000;
        transform: translateY(1px);
        text-align: center;
        -webkit-appearance: none;
        &:disabled {
            background: none;
        }
        &.error {
            border-color: #DB5151;
        }
        &:hover, &:focus, &:active {
            outline: none;
        }
    }
}
</style>