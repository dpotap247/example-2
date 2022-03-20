<template>
    <div class="radio-group" :class="{ 'disabled': data.disabled }">
        <input 
            class="radio-group__input" 
            type="radio" 
            :id="`${data.key}-${data.value}`" 
            :name="data.key" 
            :value="data.value" 
            :disabled="data.disabled"
            v-model="modelValue"  
            @change="$emit('update:modelValue', data.value)"
        >
        <label :for="`${data.key}-${data.value}`">{{ data.label }}</label>
    </div>
</template>

<script>
export default ({
    props: ['data', 'modelValue']
})
</script>


<style scoped lang="scss">
.radio-group {
    display: flex;
    margin-right: 37px;
    &.disabled {
        opacity: 0.7;
    }
    &__input {
        &:checked, &:not(:checked) {
            position: absolute;
            left: -9999px;
            & + label {
                position: relative;
                padding-left: 36px;
                cursor: pointer;
                font-size: 15px;
                line-height: 140%;
                white-space: nowrap;
                &::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 4px;
                    width: 15px;
                    height: 15px;
                    border: 1px solid #2980B9;
                    border-radius: 100%;
                    background: #fff;
                    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
                }
                &:after {
                    content: '';
                    width: 17px;
                    height: 17px;
                    background: #2980B9;
                    position: absolute;
                    top: 4px;
                    left: 0;
                    border-radius: 100%;
                    -webkit-transition: all 0.2s ease;
                    transition: all 0.2s ease;   
                }
            }
        }
        &:not(:checked) + label:after {
            opacity: 0;
            transform: scale(0);   
        }
        &::checked + label:after {
            opacity: 1;
            -webkit-transform: scale(1);
            transform: scale(1);
        }
    }
}
</style>

