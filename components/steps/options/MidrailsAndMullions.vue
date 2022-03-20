<template>
    <div class="items" v-if="values[valueKey]">
        <div class="item" v-for="(item, index) in values[valueKey]" :key="`${index}_${currentSection}`">
            <span class="item__num">{{ index + 1}}.</span>
            <Checkbox class="item__checkbox" :data="{ key: `checkbox-${index}` }" :disabled="item.required" v-model="item.selected" @update:modelValue="updValues(index)" />
            <InputSize 
                class="item__input"
                :data="{ pref: '', suf: 'mm', type: 'number' }"   
                :item="item"
                v-model="item.position"
                @update:modelValue="validation(), updValues(index)"
            />
        </div>
    </div>
</template>

<script>
import InputSize from '../../form/InputSize.vue'
import Checkbox from '../../form/Checkbox.vue'
import { useOptionLogic } from "../../../composables/estimate/create"
import { ref, computed } from 'vue'

export default({
    props: ['items', 'currentSection'],
    components: {
        InputSize,
        Checkbox
    },
    setup(props, { emit }) {
        const optionLogic  = useOptionLogic(props)
        const valueKey = computed(() => optionLogic.currentKeyForValues.value)  

        const optionName = ref(props.items.optionName)
        const optionCode = ref(props.items.optionCode)

        const option = computed(() => props.items.sections[props.currentSection].options[optionName.value])     

        const settings = computed(() => option.value.option_settings.settings) 
        const values = ref({})

        getData()
        function getData() {
            values.value[valueKey.value] = option?.value.option_settings.values.map((el) => {
                return {
                    error: false,
                    position: '',
                    ...el,
                }
            })
            validation()
        }

        function updValues(index) {
            const currentItem = option.value.option_settings.values[index]
            const { position, selected } = values.value[valueKey.value][index]
            currentItem.position = position
            currentItem.selected = selected
        }

        //first validation
        function validation(item) {
            const { gap_max, gap_min } = settings.value
            const userArrayValues = Array.from(values.value[valueKey.value], el => el.position)
            const currentSection = props.items.sections[props.currentSection]

            //if midr take drop else width
            const highestPoint = optionCode.value == 'MIDR' ? parseInt(currentSection.drop) : parseInt(currentSection.width)
            const startPoint = 0

            let i = 0
            while(i < userArrayValues.length) {
                //change counter
                i += 1
                let valid = true
                const currentInput = values.value[valueKey.value][i - 1]

                //current value
                const currentValue = userArrayValues[i - 1] && parseInt(userArrayValues[i - 1])
                if(!currentValue) {
                    if(currentInput.selected) {
                        currentInput.error = true
                        console.log(currentInput, 'currentInput')
                    }
                    continue
                }
                
                //copy array
                const userArrayWithoutCurrent = userArrayValues.slice(0)
                //splice current item
                userArrayWithoutCurrent.splice(i - 1, 1)

                //drop, bottom, current user array
                const allValues = [startPoint, ...userArrayWithoutCurrent, highestPoint]


                allValues.forEach(value => {
                    if(!valid) return
                    //check validation difference
                    const difference = Math.abs(parseInt(value) - currentValue)
                    if(difference < gap_min || difference > gap_max) valid = false          
                })

                //if not valid break
                if(!valid) {
                    if(currentInput.selected) currentInput.error = true
                    continue
                }     
                if(currentInput.error) currentInput.error = false
            }
            

            const errorItems = values.value[valueKey.value].filter(el => el.error && el.selected)
            const emitData = errorItems.length ? `Error: min gap - ${gap_min} or max gap - ${gap_max}` : ''
            emit('error', emitData)
        }

        return {
            values,
            validation,
            valueKey,
            getData,
            updValues
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
}
</style>
