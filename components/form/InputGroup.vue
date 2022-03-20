<template>
    <div class="form-group" :class="{error: data.error}">
        <label class="form-group__label" for="" v-if="data.label">{{ data.label }}<slot name="label"></slot></label>
        <div class="form-group__input-container">
            <input class="form-group__input" 
                v-model="modelValue" 
                :type="data.type" 
                :min="data.min"
                :placeholder="data.placeholder" 
                :disabled="data.disabled"
                @focus="data.error = '', $emit('focus')"
                @blur="$emit('blur')"
                @input="input">
            <slot></slot>
        </div>
        <div class="form-group__error" v-if="data.error">{{ data.error }}</div>
    </div>
</template>

<script>

export default({
    props: ['data', 'modelValue', 'filter'],
    setup(props, { emit }) {
        function input(event) {
            let data = event.target.value
            if(props.filter) data = props.filter(data)
            
            emit('update:modelValue', data)
        }

        return {
            input
        }
    },
})
</script>


<style scoped lang="scss">
.form-group {
    width: 100%;
    &__label {
        font-weight: bold;
        font-size: 17px;
        line-height: 140%;
        display: block;
        margin: 0 0 2px 4px;
        text-align: left;
        white-space: nowrap;
        display: flex; 
        align-items: center;
        ::v-deep .help_topic {
            margin-left: 5px;
            display: inline-block;
        }
    }
    &__input {
        border: 1px solid rgba(11, 53, 83, 0.2);
        border-radius: 2px;
        height: 40px;
        width: 100%;
        padding: 0 13px 0 15px;
        font-weight: bold;
        font-size: 17px;
        line-height: 140%;
        &::placeholder {
            font-style: italic;
            font-weight: normal;
        }
        &-container {
            position: relative;
        }
    }
    &__error {
        font-size: 14px;
        line-height: 140%;
        color: #DB5151;
        text-align: left;
    }
}
</style>