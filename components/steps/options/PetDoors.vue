<template>
    <div class="option-step" v-if="sizeOptions && flapOptions && positionOptions">
        <div class="option-step__left">
            <div class="option-step__options" style="display: flex;">
                <div>
                    <div class="option-step__title">Size</div>
                    <RadioGroupItems 
                        class="option-step__item" 
                        :vertical="true"
                        :items="sizeOptions" 
                        :key="`${optionLogic.currentKeyForValues.value}_${sizeValue[optionLogic.currentKeyForValues.value]}`" 
                        v-model="sizeValue[optionLogic.currentKeyForValues.value]"
                        @update:modelValue="updValues(sizeValue, 'size')"/>
                </div>
                <div class="option-step__" v-if="doorSizeValue && doorSizeValue.colour_group">
                    <span class="select-color__title">Select colour:</span>
                    <SelectColor :colorGroup="doorSizeValue.colour_group" @submit="selectColor"/>
                </div>
            </div>
            <div class="option-step__options">
                <div class="option-step__title">Flaps</div>
                <RadioGroupItems 
                    class="option-step__item" 
                    :items="flapOptions" 
                    :vertical="true"
                    :key="`${optionLogic.currentKeyForValues.value}_${flapValue[optionLogic.currentKeyForValues.value]}`" 
                    v-model="flapValue[optionLogic.currentKeyForValues.value]" 
                    @update:modelValue="updValues(flapValue, 'flap')"/>
            </div>
        </div>
        <div class="option-step__right">
            <div class="option-step__options" style="margin-bottom: 0;">
                <img  class="pet-door__image" :src="doorPositionImage" alt="door position"/>
                <div class="pet-door__title">Position</div>
                <RadioGroupItems 
                    class="option-step__item" 
                    :items="positionOptions" 
                    :vertical="true"
                    :key="`${optionLogic.currentKeyForValues.value}_${positionValue[optionLogic.currentKeyForValues.value]}`" 
                    v-model="positionValue[optionLogic.currentKeyForValues.value]" 
                    @update:modelValue="updValues(positionValue, 'position')"/>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed } from 'vue'
import RadioGroupItems from '../../../components/form/RadioGroupItems.vue'
import { useOptionLogic } from "../../../composables/estimate/create"
import SelectColor from '../../elements/SelectColor.vue'

export default({
    props: ['items', 'currentSection'],
    components: {
        RadioGroupItems,
        SelectColor
    },
    setup(props, { emit }) {
        const sizeOptions = ref(null)
        const sizeValue = ref({})

        const flapOptions = ref(null)
        const flapValue = ref({})

        const positionOptions = ref(null)
        const positionValue = ref({})

        const doorPositionImage = computed(() => {
            const optionName = props.items.optionName
            const section = props.items.sections[props.currentSection].options[optionName].option_settings 
            const group = section.groups.find(el => el.name == 'position').choices
            const image = group.find(el => el.default || el.is_default).image
            return image
        })

        const doorSizeValue = computed(() => {
            const optionName = props.items.optionName
            const section = props.items.sections[props.currentSection].options[optionName].option_settings 
            const group = section.groups.find(el => el.name == 'size').choices
            const defaultItem = group.find(el => el.default || el.is_default)
            return defaultItem
        })

        const optionLogic = useOptionLogic(props)

        
        getData()
        function getData() {
            optionLogic.getData(sizeOptions, sizeValue, 'size')
            optionLogic.getData(flapOptions, flapValue, 'flap')
            optionLogic.getData(positionOptions, positionValue, 'position')
        }
        
        function selectColor(color) {
            const key = optionLogic.currentKeyForValues.value
            const currentItem = sizeValue.value[key]
            optionLogic.selectColor(color.id, currentItem, 'size')
            emit('updColor')
        }
        
    
        function updValues(values, groupName) {
            const key = optionLogic.currentKeyForValues.value   
            const selectedId = values[key]     
            optionLogic.selectItem(selectedId, groupName)
        }

        return {
            optionLogic,
            positionOptions,
            flapOptions,
            sizeOptions,
            sizeValue,
            flapValue,
            positionValue,
            doorPositionImage,
            updValues,
            getData,
            doorSizeValue,
            selectColor,
            // sizeColorValue
        }
        
    },
})
</script>


<style scoped lang="scss">
.option-step {
    display: flex;
    flex-direction: row;
    width: 100%;
}
.pet-door {
    &__image {
        max-height: 195px;
        display: flex;
        margin-right: auto;
        margin-bottom: 10px;
    }
    &__title {
        font-size: 24px;
        margin-bottom: 10px;
        text-align: left;
    }
}
.select-color {
    &__title {
        margin-bottom: 10px;
        display: block;
    }
}
</style>