<template>
    <div class="items" v-if="values[valueKey]">
        <div class="item" v-for="(item, index) in values[valueKey]" :key="`${index}_${currentSection}`">
            <span class="item__num">{{ index + 1}}.</span>
            <Checkbox 
                class="item__checkbox" 
                :data="{ key: `checkbox-${index}` }" 
                :disabled="item.required" 
                v-model="item.selected" 
                @update:modelValue="updValues(index)" 
            />
            <InputSize 
                class="item__input"
                :data="{ pref: 'width', suf: 'mm', type: 'number' }"   
                :item="item"
                v-model="item.width"
                @update:modelValue="updValues(index)"
            />
            <InputSize 
                class="item__input"
                :data="{ pref: 'drop', suf: 'mm', type: 'number' }"   
                :item="item"
                v-model="item.height"
                @update:modelValue="updValues(index)"
            />
            <select class="item__select" v-model="item.rotation" v-if="selectOptions" @update:modelValue="updValues(index)">
                <option :value="item.value" v-for="item in selectOptions" :key="item.value">{{ item.label }}</option>
            </select>
        </div>
        <div class="items__note">
            <div>Please note: Looking from outside</div>
            <div>Position is measured from bottom left of the screen to centre of Flyscreen Port Set</div>
        </div>
    </div>
</template>

<script>
import InputSize from '../../form/InputSize.vue'
import Checkbox from '../../form/Checkbox.vue'
import { useOptionLogic } from "../../../composables/estimate/create"
import { ref, computed } from 'vue'

export default({
    props: ['items', 'currentSection', 'selectOptions'],
    components: {
        InputSize,
        Checkbox
    },
    setup(props, { emit }) {
        const optionLogic  = useOptionLogic(props)
        const valueKey = computed(() => optionLogic.currentKeyForValues.value)  

        const optionName = ref(props.items.optionName)
        // const optionCode = ref(props.items.optionCode)

        const option = computed(() => props.items.sections[props.currentSection].options[optionName.value])     

        const limits = computed(() => option.value.option_settings?.limits) 
        const values = ref({})

        getData()
        function getData() {
            values.value[valueKey.value] = option?.value.option_settings.choices.map((el) => {
                return {
                    error: false,
                    ...el,
                }
            })
        }

        function updValues(index) {
            validation()

            const input = values.value[valueKey.value][index]
            if(input.selected) {
                const currentItem = option.value.option_settings.choices[index]
                Object.assign(currentItem, input)
            }
        }

        function validation() {
            const maxDrop = limits.value.height
            const maxWidth = limits.value.width

            const inputs = values.value[valueKey.value]

            inputs.forEach(el => {
                if(el.selected) {
                    let error = false
                    if(maxDrop < el.height || maxWidth < el.width) error = true
                    if(error !== el.error) el.error = error
                }
            })
            const errorItems = inputs.filter(el => el.error)
            const emitData = errorItems.length ? `Error: max width - ${maxWidth}mm or max drop - ${maxDrop}mm` : ''
            emit('error', emitData)
        }

        return {
            values,
            // validation,
            valueKey,
            getData,
            updValues,
        }
    },
})
</script>

<style scoped lang="scss">
.item {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    &__checkbox {
        margin-bottom: 0;
        width: auto;
    }
    &__num {
        display: block;
        margin-right: 10px;
        font-size: 20px;
    }
    &__input {
        margin-right: 20px;
    }
    &__select {
        width: 140px;
        text-align: center;
        border: 1px solid var(--PrimaryButtonColour);
        // box-shadow: 0 1px 2px rgba(0 0 0 / 5%), inset 0px -15px 10px -12px rgba(0 0 0 / 5%);
        height: 25px;
    }
}
.items {
    &__note {
        text-align: center;
        position: absolute;
        bottom: 0px;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
    }
}
</style>

<style lang="scss">
.flyscreen-port-sets, .hopper-hatches {
    & + .validation_text {
        position: relative;
        width: 100%;
        text-align: left;
        display: block;
    }
}
</style>