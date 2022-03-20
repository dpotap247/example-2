<template>
    <div class="settings-form">
        <div class="settings-form__title" v-if="data.title"> {{ data.title }} </div>
        <div class="settings-form__inputs">
            <template v-for="(item, index) in data.inputs" :key="`input-${index}`"> 
                <AddressAutocomplete  
                    v-if="item.component && item.component == 'address-autocomplete'"
                    :key="`autocomplete-${index}`" 
                    class="settings-form__input" 
                    :style="item.style || ''"
                    :states="states"
                    v-model="item.value"
                    @updAddress="$emit('updAddress', $event)"
                />
                <StatesInput 
                    v-if="item.component && item.component == 'address-state'" 
                    :key="`autocomplete-${index}`" 
                    class="settings-form__input" 
                    :style="item.style || ''"
                    v-model="item.value"
                    @updStates="$emit('updStates', $event)" 
                    @update:modelValue="$emit('updAddress', { state: $event })"
                />
                <InputGroup 
                    v-if="!item.component"
                    class="settings-form__input" 
                    :style="item.style || ''" 
                    :data="item" 
                    v-model="item.value"
                />
            </template>
        </div>
        <Button v-if="data.btn" :data="data.btn" @click="$emit('onClick')"/>

    </div>
</template>
<script>
import InputGroup from './InputGroup'
import StatesInput from './StatesInput'
import Button from '../form/Button.vue'


import AddressAutocomplete from './AddressAutocomplete'
export default ({
    props: ['data', 'states'],
    components: {
        InputGroup,
        StatesInput,
        Button,
        AddressAutocomplete
    },
})
</script>

<style scoped lang="scss">
.settings-form {
    &__title {
        font-size: 24px;
        line-height: 100%;
        text-transform: uppercase;
        color: #1C2833;
        width: 100%;
        text-align: left;
        font-weight: bold;
        margin-bottom: 8px;
    }
    &__inputs {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
    }
    &__input {
        margin-bottom: 10px;
    }
}

</style>