<template>
    <OptionOneRadioGroup 
        :items="items" 
        :currentSection="currentSection" 
        :name="name" 
        @updated="checkLockAvailable"
    />
    <CylinderModal 
        v-model="showCylinderModal" 
        :desc="`Selected type of cyliner does not include a  
                lock but lock is selected. 
                Do you want remove the lock from  this item?
                Please select one of the following options`" 
        @goToOption="goToLock"
        @keepIt="keepIt"
        @close="showModal(false)"
    /> 
</template>

<script>
import OptionOneRadioGroup from './OptionOneRadioGroup.vue'
import CylinderModal from './lock/CylinderModal.vue'
import { ref } from 'vue'

export default ({
    props: ['items', 'currentSection', 'name'],
    components: {
        OptionOneRadioGroup,
        CylinderModal,
    },
    setup(props, { emit }) {

        const showCylinderModal = ref(false)
        
        function checkLockAvailable() {
            const optionName = props.items.optionName
            const options = props.items.sections[props.currentSection].options
            const currentOption = options[optionName]
            const lockOption = options['Lock']

            const lockOptionTypeGroup = lockOption.option_settings.groups.find(group => group.name == 'default')
            const lockTypeNoCylinder = lockOptionTypeGroup.choices.find(el => el.default && el.no_cylinder)

            const choices = currentOption.option_settings.groups[0].choices

            const noCylinder = choices.find(el => el.default && el.id == 3)
            if(!lockTypeNoCylinder) emit('needShowModal', noCylinder)
        }
        
        function showModal(value) {
            showCylinderModal.value = value
        }

        function goToLock() {
            emit('nextOption', 'lock')
            showModal(false)
        }

        function keepIt() {
            emit('nextOption', 'next')
            showModal(false)
        }

        return {
            checkLockAvailable,
            showCylinderModal,
            showModal,
            goToLock,
            keepIt
        }
    },
})
</script>
