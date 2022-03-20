<template>
    <PortSetsForm :items="items" :currentSection="currentSection" :selectOptions="selectOptions" @error="$emit('error', $event)"/>
</template>

<script>
import PortSetsForm from './PortSetsForm.vue'

export default({
    props: ['items', 'currentSection'],
    components: {
        PortSetsForm
    },
    setup() { 
        const selectOptions = [
            { value: 0, label: 'Select Rotation' },
            { value: 15, label: '15 deg' },
            { value: 30, label: '30 deg' },
            { value: 45, label: '45 deg' },
            { value: 60, label: '60 deg' },
            { value: 75, label: '75 deg' },
            { value: 90, label: '90 deg' },
        ]


        return {
            selectOptions
        }
    },
})
</script>
