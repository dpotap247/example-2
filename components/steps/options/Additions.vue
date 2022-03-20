<template>
    <div class="option-step">
        <div class="option-step__options" v-if="bugStripOptions && bugStripOptions.length">
            <div class="option-step__title">Bug Strip</div>
            <RadioGroupItems 
                class="option-step__radio-group"  
                :items="bugStripOptions" 
                :key="`${optionLogic.currentKeyForValues.value}_${bugStripValues[optionLogic.currentKeyForValues.value]}`" 
                v-model="bugStripValues[optionLogic.currentKeyForValues.value]" 
                @update:modelValue="updValues(bugStripValues, 'bug_strip')"
            />
            <div class="option-step__color" v-if="bugStripValues[optionLogic.currentKeyForValues.value]" >
                <span>Select color:</span>
                <SelectColor :colorGroup="bugStripColorGroup" @submit="selectColor($event, bugStripValues, 'bug_strip')"/>
            </div>
        </div>
        <div class="option-step__options" v-if="sealOptions && sealOptions.length">
            <div class="option-step__title">Seal</div>
            <RadioGroupItems 
                class="option-step__radio-group" 
                :items="sealOptions" 
                :key="`${optionLogic.currentKeyForValues.value}_${sealValues[optionLogic.currentKeyForValues.value]}`" 
                v-model="sealValues[optionLogic.currentKeyForValues.value]" 
                @update:modelValue="updValues(sealValues, 'seal')"
            />
            <div class="option-step__color" v-if="sealValues[optionLogic.currentKeyForValues.value]" >
                <span>Select color:</span>
                <SelectColor :colorGroup="sealColorGroup" @submit="selectColor($event, sealValues, 'seal')"/>
            </div>
        </div>
        <div class="option-step__options" v-if="interlockOptions && interlockOptions.length">
            <div class="option-step__title">Interlock</div>
            <RadioGroupItems 
                class="option-step__radio-group" 
                :items="interlockOptions" 
                :key="`${optionLogic.currentKeyForValues.value}_${interlockValues[optionLogic.currentKeyForValues.value]}`" 
                v-model="interlockValues[optionLogic.currentKeyForValues.value]" 
                @update:modelValue="updValues(interlockValues, 'interlock')"
            />
            <div class="option-step__color" v-if="interlockValues[optionLogic.currentKeyForValues.value]">
                <span>Select color:</span>
                <SelectColor :colorGroup="interlockColorGroup" @submit="selectColor($event, interlockValues, 'seal')"/>
            </div>
        </div>
        <div class="option-step__options" v-if="otherOptions && otherOptions.length">
            <div class="option-step__title">Other</div>
            <div class="other-step__item" 
                v-for="(item, index) in otherOptions"
                :key="index"
            >
                <Checkbox   
                    :data="item" 
                />
                <div class="option-step__color" v-if="item.selected">
                    <span>Select color:</span>
                    <SelectColor />
                </div>
            </div>  
        </div>
    </div>
</template>

<script>
import Checkbox from '../../form/Checkbox.vue'
import RadioGroupItems from '../../form/RadioGroupItems.vue'
import { useOptionLogic } from "../../../composables/estimate/create"
import SelectColor from '../../elements/SelectColor.vue'
import { ref, computed } from 'vue'

export default  ({
    props: ['items', 'currentSection', 'allData'],
    components: {
        Checkbox,
        RadioGroupItems,
        SelectColor,
    },
    setup(props, { emit }) {
        const optionLogic  = useOptionLogic(props)

        const bugStripOptions = ref(null)
        const bugStripValues = ref({})
        // const bugStripColorGroup = ref({})
        const bugStripColorGroup = computed(() => optionLogic.getColorGroup('bug_strip'))

        const sealOptions = ref(null)
        const sealValues = ref({})
        // const sealColorGroup = ref({})
        const sealColorGroup = computed(() => optionLogic.getColorGroup('seal'))

         const interlockOptions = ref(null)
        const interlockValues = ref({})
        // const sealColorGroup = ref({})
        const interlockColorGroup = computed(() => optionLogic.getColorGroup('interlock'))

        const otherOptions = ref(null)
        const otherValues = ref({})
        // const otherColorGroup = ref({})

        getData()
        function getData() {
            optionLogic.getData(bugStripOptions, bugStripValues, 'bug_strip')
            optionLogic.getData(sealOptions, sealValues, 'seal')
            optionLogic.getData(otherOptions, otherValues, 'other')
            optionLogic.getData(interlockOptions, interlockValues, 'interlock')
            
            // options.value = options.value.map(el => {
            //     return {
            //         ...el,
            //         value: el.name,
            //         key: el.name,
            //         label: el.name,
            //     }
            // })
        }

        function selectColor(color, values, groupName) {
            const key = optionLogic.currentKeyForValues.value 
            const currentItem = values[key]
            optionLogic.selectColor(color.id, currentItem, groupName)
            emit('updColor')
        }

        function updValues(values, groupName) {
            const key = optionLogic.currentKeyForValues.value   
            const selectedId = values[key]     
            optionLogic.selectItem(selectedId, groupName)
        }
    
 

        return {
            bugStripOptions,
            sealOptions,
            otherOptions,
            bugStripValues,
            sealValues,
            otherValues,
            optionLogic,
            bugStripColorGroup,
            sealColorGroup,
            updValues,
            selectColor,
            interlockValues,
            interlockOptions,
            interlockColorGroup,
        }
    },
})
</script>


<style scoped lang="scss">
.option-step {
    flex-direction: row;
    &__radio-group {
        flex-direction: column;
        ::v-deep .radio-group__item {
            margin-right: 0;
            margin-bottom: 10px;
        }
    }
}
.other-step__item {
    ::v-deep .form-group {
        margin-bottom: 10px;
    }
}
</style>