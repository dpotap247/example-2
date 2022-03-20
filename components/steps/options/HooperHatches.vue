<template>
    <PortSetsForm :items="items" :currentSection="currentSection" @error="$emit('error', $event)"/>
</template>

<script>
import PortSetsForm from './PortSetsForm.vue'

export default({
    props: ['items', 'currentSection'],
    components: {
        PortSetsForm
    },
})
</script>
