<template>
    <div class="option-step" v-if="typeOptions && heightOptions && sideOptions">
        <div class="option-step__options">
            <div class="option-step__title">Lock Type</div>
            <RadioGroupItems 
                class="door__item" 
                :items="typeOptions" 
                :key="`${valueKey}_${typeValue[valueKey]}`" 
                v-model="typeValue[valueKey]"
                @update:modelValue="updValues(typeValue, 'default'), checkHeightAvailable()"/>
                
                <Checkbox 
                    :data="{ key: 'type', label: 'Adjust Triple Lock Points for Flush Bolt matching' }" 
                    v-if="currentType && currentType.is_adjust_triple_lock_prints"
                />
        </div>
        <div class="option-step__options">
            <div class="option-step__title">Lock Height</div>
            <RadioGroupItems 
                class="door__item" 
                :items="heightOptions" 
                :key="`${valueKey}_${heightValue[valueKey]}`" 
                v-model="heightValue[valueKey]" 
                @update:modelValue="updValues(heightValue, 'lock_height')"/>
                <div class="lock-height__image" 
                    v-if="heightImage" 
                    :key="heightImage.image">
                    <div class="lock__image-wrapper">
                        <img  class="lock__image" :src="heightImage.image" alt="door position"/>
                    </div>
                    <span>{{ heightImage.image_description }}</span>
                
                </div>

        </div>
        <div class="option-step__options" style="margin-bottom: 0;">
            <div class="option-step__title">Lock Side</div>
            <SideItems 
                class="door__item" 
                :items="sideOptions" 
                :key="`${valueKey}_${sideValue[valueKey]}`" 
                v-model="sideValue[valueKey]" 
                @update:modelValue="updValues(sideValue, 'lock_side')"
            />
            <div class="option-step__note">Please note: Looking from the outside</div>
        </div>

        <CylinderModal 
            v-model="showCylinderModal" 
            :desc="`Selected type of lock does not include a  
                cylinder but cylinder is selected. 
                Do you want remove the cylinder from  this item?
                Please select one of the following options`" 
            @goToOption="goToCylinder"
            @keepIt="keepIt"
            @close="showModal(false)"
        />
    </div>
</template>

<script>
import { ref, computed } from 'vue'
import RadioGroupItems from '../../../components/form/RadioGroupItems.vue'
import SideItems from './lock/Side.vue'
import { useOptionLogic } from "../../../composables/estimate/create"
import Checkbox from '../../form/Checkbox.vue'
import CylinderModal from './lock/CylinderModal.vue'

export default({
    props: ['items', 'currentSection'],
    components: {
        RadioGroupItems,
        SideItems,
        Checkbox,
        CylinderModal,
    },
    setup(props, { emit }) {
        const typeOptions = ref(null)
        const typeValue = ref({})

        const heightOptions = ref(null)
        const heightValue = ref({})

        const sideOptions = ref(null)
        const sideValue = ref({})

        const optionLogic = useOptionLogic(props)
        const valueKey = computed(() => optionLogic.currentKeyForValues.value)

        const showCylinderModal = ref(false)

        const currentType = computed(() => {
            const typeId = typeValue.value[valueKey.value]
            if(!typeId) return
            return typeOptions.value.find(el => el.value == typeId)
        })


        const heightImage = computed(() => {
            const value = heightValue.value[valueKey.value]
            const item = heightOptions.value.find(el => el.value == value)
            return item
        })

        // const showCylinderModal = ref(false)

        function checkHeightAvailable() {
            checkCylinderAvailable()

            //check height available
            let value = currentType.value.is_height_available
            
            if(value === undefined) value = true
                
            const currentStatus = heightOptions.value[0].disabled
            if(!value === currentStatus) return
            
            //set disabled status items
            heightOptions.value.forEach(el => {
                el.disabled = !value
            })
            if(value === false) heightValue.value[valueKey.value] = null
            else optionLogic.getData(heightOptions, heightValue, 'lock_height')
        }
        
        function checkCylinderAvailable() {
            const options = props.items.sections[props.currentSection].options
            const cylinderOption = options['Cylinder']

            const cylinderOptionDefaultGroup = cylinderOption?.option_settings.groups.find(group => group.name == 'default')
            const cylinderTypeNoLock = cylinderOptionDefaultGroup.choices.find(el => el.default && el.id == 3)

            if(!cylinderTypeNoLock) emit('needShowModal', currentType.value.no_cylinder)
        }

        function showModal(value) {
            showCylinderModal.value = value
            if(!value) emit('needShowModal', false)
        }

        function removeCylinder() {
            showModal(false)
        }

        function goToCylinder() {
            emit('nextOption', 'cylinder')
            showModal(false)
        }

        function keepIt() {
            emit('nextOption', 'next')
            showModal(false)
        }

        getData()

        function getData() {
            optionLogic.getData(typeOptions, typeValue, 'default')
            optionLogic.getData(heightOptions, heightValue, 'lock_height')
            optionLogic.getData(sideOptions, sideValue, 'lock_side')

            checkHeightAvailable(   )
        }

        function updValues(values, groupName) {
            const key = valueKey.value
            const selectedId = values[key]     
            optionLogic.selectItem(selectedId, groupName)
        }

        return {
            optionLogic,
            sideOptions,
            sideValue,
            typeOptions,
            typeValue,
            heightOptions,
            heightValue,
            updValues,
            getData,
            heightImage,
            currentType,
            valueKey,
            checkHeightAvailable,
            showCylinderModal,
            showModal,
            goToCylinder,
            removeCylinder,
            keepIt,
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
.lock {
    display: flex;
    width: 100%;
    flex-direction: row;
    &__options {
        margin-bottom: 40px;
        min-width: 33%;
    }
}
.lock-height {
    &__image {
        margin-top: 10px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        max-width: 300px;
        min-height: 320px;
        .lock__image {
            height: 100%;
            &-wrapper {
                max-width: 100%;
                height: 305px;
            }
        }
        span {
            width: 250px;
            display: inline-block;
            text-align: left;
            // margin-top: 10px;
        }
    }
}
</style>