
<template>
    <div class="option-step" v-if="typeOptions && directionOptions && qtyOptions">
        <div class="option-step__options">
            <div class="option-step__title">Hinge Type</div>
            <RadioGroupItems 
                class="option-step__item" 
                :items="typeOptions" 
                :key="`${optionLogic.currentKeyForValues.value}_${typeValue[optionLogic.currentKeyForValues.value]}`" 
                v-model="typeValue[optionLogic.currentKeyForValues.value]"
                @update:modelValue="updValues(typeValue, 'hinge_type')"/>
        </div>
        <div class="option-step__options">
            <div class="option-step__title">Hinge Direction</div>
            <RadioGroupItems 
                class="hinge__item" 
                :items="directionOptions" 
                :key="`${optionLogic.currentKeyForValues.value}_${directionValue[optionLogic.currentKeyForValues.value]}`" 
                v-model="directionValue[optionLogic.currentKeyForValues.value]" 
                @update:modelValue="updValues(directionValue, 'hinge_direction')"/>
        </div>
        <div class="option-step__options" style="margin-bottom: 0;">
            <!-- <img  class="hinge__image" :src="doorPositionImage" alt="door position"/> -->
            <div class="option-step__title">Hinge Quantity</div>
            <RadioGroupItems 
                class="option-step__item" 
                :items="qtyOptions" 
                :key="`${optionLogic.currentKeyForValues.value}_${qtyValue[optionLogic.currentKeyForValues.value]}`" 
                v-model="qtyValue[optionLogic.currentKeyForValues.value]" 
                @update:modelValue="updValues(qtyValue, 'hinge_qty')"/>
        </div>
    </div>
</template>

<script>
import { ref, computed } from 'vue'
import RadioGroupItems from '../../form/RadioGroupItems.vue'
import { useOptionLogic } from "../../../composables/estimate/create"

export default({
    props: ['items', 'currentSection'],
    components: {
        RadioGroupItems,
    },
    setup(props) {
        const typeOptions = ref(null)
        const typeValue = ref({})

        const directionOptions = ref(null)
        const directionValue = ref({})

        const qtyOptions = ref(null)
        const qtyValue = ref({})

        const optionLogic = useOptionLogic(props)

        // const heightImage = computed(() => {
        //     const value = heightValue.value[optionLogic.currentKeyForValues.value]
        //     const item = heightOptions.value.find(el => el.value == value)
        //     return item
        // })
        
        getData()
        function getData() {
            optionLogic.getData(typeOptions, typeValue, 'hinge_type')
            optionLogic.getData(directionOptions, directionValue, 'hinge_direction')
            optionLogic.getData(qtyOptions, qtyValue, 'hinge_qty')
        }
        function updValues(values, groupName) {
            const key = optionLogic.currentKeyForValues.value   
            const selectedId = values[key]     
            optionLogic.selectItem(selectedId, groupName)
        }

        return {
            optionLogic,
            directionOptions,
            directionValue,
            typeOptions,
            typeValue,
            qtyOptions,
            qtyValue,
            updValues,
            getData,
            // heightImage
        }
        
    },
})
</script>


<style scoped lang="scss">
.door__item {
    flex-direction: column;
    ::v-deep .radio-group__item {
        margin-bottom: 10px;
    }
}

</style>