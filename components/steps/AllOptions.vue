<template>
    <div class="all-options">
        <Item 
            category="Default Options" 
            :items="defaultOptions" 
            v-if="defaultOptions.length" 
            @selected="$emit('jumpTo', $event)"
        />
        <Item 
            category="Available Options" 
            :items="availableOptions" 
            v-if="availableOptions.length" 
            @selected="$emit('jumpTo', $event)"
        />
    </div>
</template>

<script>
import Item from './options/all-options/Item.vue'
import { ref } from 'vue'
export default {
    props: ['items'],
    components: {
        Item
    },
    setup(props) {
        const defaultOptions = ref([])
        const availableOptions = ref([])

        getData()

        function getData() {
            props.items.steps.forEach(el => {
                // if(el.all_options && el.visible) {
                    if(el.required) defaultOptions.value.push(el)
                    else availableOptions.value.push(el)
                // }
            })
        }

        return {
            defaultOptions,
            availableOptions
        }
    }
}
</script>

