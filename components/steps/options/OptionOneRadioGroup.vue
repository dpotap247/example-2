<template>
    <div class="select" v-if="items && values"  :key="`${optionLogic.currentKeyForValues.value}_${values[optionLogic.currentKeyForValues.value]}`" >
        <div class="select__item" 
            v-for="(item, index) in options"
            :key="`${optionLogic.currentKeyForValues.value}_${values[optionLogic.currentKeyForValues.value]}_${index}`" 
        >
            <RadioGroup      
                v-model="values[optionLogic.currentKeyForValues.value]" 
                @update:modelValue="updValues"
                :data="item" 
            />
            <HelpTopic class="select__help-topic" :iframeData="item.help_topic_url" v-if="item.help_topic_url" />
        </div>
    </div>
</template>

<script>
import {ref, computed} from 'vue'
import { useOptionLogic } from "../../../composables/estimate/create"
import HelpTopic from '../../elements/HelpTopic.vue'
import RadioGroup from '../../form/RadioGroup.vue'

export default({
    props: ['items', 'currentSection', 'name'],
    components: {
        HelpTopic,
        RadioGroup
    },
    setup(props, {emit}) {
        const options = ref(null)
        const values = ref({})
        const optionLogic  = useOptionLogic(props)

        getData()
        function getData() {
            optionLogic.getData(options, values)
        }
        
        function updValues() {
            const key = optionLogic.currentKeyForValues.value     
            const selectedId = values.value[key]      
            optionLogic.selectItem(selectedId)
            emit('updated')
        }

        return {
            options,
            values,
            optionLogic,
            getData,
            updValues,
        }
        
    },
})
</script>


<style scoped lang="scss">
.select {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    &__item {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        min-width: 240px;
        margin-right: 15px;
    }
    &.cylinder, &.wheels {
        flex-direction: column;
        ::v-deep .radio-group__items {
            flex-direction: column;
        }
    }
    ::v-deep .radio-group {
        min-width: auto;
        margin-right: 5px;
    }
}
</style>