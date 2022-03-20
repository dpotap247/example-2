<template>
    <div class="enter-size">
        <div class="enter-size__container">
            <div class="enter-size__left" v-if="sectionsExample">

                <div class="enter-size__overall" >
                    <InputGroup 
                        class="overall__input" 
                        :data="inputs.overall_width" 
                        :filter="numberFilter"
                        v-model="items.data.overall_width" 
                        @update:modelValue="updOpeningPanels('overall_width')"
                    >
                        <template #label>
                              <HelpTopic 
                                v-if="allData.current_step.help_topic_url_overall_width" 
                                :iframe-data="allData.current_step.help_topic_url_overall_width"
                                />
                        </template>
                    </InputGroup>
                    <InputGroup 
                        class="overall__input"  
                        :data="inputs.overall_drop" 
                        :filter="numberFilter"
                        v-model="items.data.overall_drop" 
                        @update:modelValue="updOpeningPanels('overall_drop')"
                    >
                        <template #label>
                            <HelpTopic 
                                v-if="allData.current_step.help_topic_url_overall_drop" 
                                :iframe-data="allData.current_step.help_topic_url_overall_drop"
                            />
                        </template>
                    </InputGroup>
                </div>
                <div class="enter-size__title">
                    Opening panels are:
                </div>
                <RadioGroupItems 
                    class="enter-size__panel" 
                    :items="isAllSectionsSameSizeOptions" 
                    v-model="items.data.is_all_sections_same_size" 
                    @update:modelValue="updOpeningPanels"
                />
                
                <div class="enter-size__example" :class="getSectionsExampleClass()">
                    <Line class="example__line_width" text="Overall Width" />
                    <Line class="example__line_height" text="Overall&nbsp;Drop" :vertical="true"/>

                    <svg-icon-qouting :data="sectionsExample" :key="`section-example-${index}`"/>
                </div>

            </div>
            <div class="enter-size__right" v-if="sectionsData">
                <div class="sizes__title">Panel sizes</div>
                <div class="sizes__row" v-for="(item, index) in sectionsData" :key="`sizes-row-${index}`">
                    {{ item.id }}.
                    <InputSize 
                        class="sizes__item" 
                        :data="{ pref: 'Width', suf: 'mm', type: 'number' }" 
                        :item="item" 
                        :disabled="item.disabled.width"
                        v-model="item.width"
                        @update:modelValue="updOpeningPanels">
                        {{allData.current_step.help_topic_url_screen_drop}}
                        <template #label v-if="index == 0">
                            <HelpTopic 
                                v-if="allData.current_step.help_topic_url_screen_drop" 
                                :iframe-data="allData.current_step.help_topic_url_screen_drop"
                            />
                        </template>
                    </InputSize>
                    <InputSize 
                        class="sizes__item" 
                        :data="{ pref: 'Drop', suf: 'mm', type: 'number' }" 
                        :disabled="item.disabled.drop"
                        :item="item" 
                        v-model="item.drop" 
                        @update:modelValue="updOpeningPanels">
                        <template #label v-if="index == 0">
                            <HelpTopic 
                                v-if="allData.current_step.help_topic_url_screen_width" 
                                :iframe-data="allData.current_step.help_topic_url_screen_width"
                            />
                        </template>
                    </InputSize>
                </div>
            </div>
            <span 
                class="validation_text" 
                v-show="validationMinMax"
            >*{{validationMinMax}}</span>
        </div>    
    </div>
        
</template>

<script>
import InputGroup from '../form/InputGroup'
import InputSize from '../form/InputSize'
import { reactive, ref, computed } from 'vue'
import { clearValidationError, checkValidation } from '../../helpers/objects'
import RadioGroupItems from '../form/RadioGroupItems'
import Line from '../elements/Line.vue'
import { numberFilter } from '../../helpers/objects'
import HelpTopic from '../elements/HelpTopic.vue'

export default({
    components: {
        InputGroup,
        InputSize,
        RadioGroupItems,
        Line,
        HelpTopic
    },
    props: ['items', 'allData'],
    setup(props, { emit }) {
        const sectionsData = ref(null)
        const needValidation = ref(false)

        const sectionsExample = ref(null)
        
        getSectionsData()

        function getSectionsData() {
            const data = JSON.parse(JSON.stringify(props.items.data.sections))

            //data for work
            sectionsData.value = data.map(el => {
                return {
                    error: false,
                    disabled: {
                        drop: false,
                        width: false,
                    },
                    ...el,
                }
            })
            //sort by id
            sectionsData.value.sort(( a, b ) => a.id - b.id)

            //get section example
            const layoutStepName = 'Layout'
            const layoutStep = props.allData.steps.find(el => el.name == layoutStepName)
            sectionsExample.value = layoutStep && layoutStep.data.section_settings

            updOpeningPanels()

        }

        const inputs = reactive({
            overall_width: { label: 'Overall width', placeholder: 'Your value', disabled: false, type: 'number', required: true, error: '', min: '0'},
            overall_drop: { label: 'Overall drop', placeholder: 'Your value', disabled: false, type: 'number', required: true, error: '', min: '0'},
        })

        const isAllSectionsSameSizeOptions = [
            {
                value: true, label: 'Same size', key:  'all_sections_same_size' 
            },
            { 
                value: false, label: 'Different', key: 'all_sections_same_size' 
            }
        ]

        const svgIconFontSize = computed(() => {
            const sectionsCount = sectionsData.value.length  
            if(sectionsCount >= 8) return '100px'
            if(sectionsCount >= 6) return '130px'
            return '150px'
        })

        function validation() {
            needValidation.value = true
            let error = false

            const emitData = props.items.data
            if(checkPanelSizeValidation() || checkValidation(inputs, emitData) || validationMinMax.value) error = true

            return error
        }

        function checkPanelSizeValidation() {
            let error = false
            sectionsData.value.forEach(el => {
                if(!el.drop || !el.width) {
                    if(!error) error = true
                    el.error = true
                } 
            }) 
            return error
        }

        const validationMinMax = computed(() => {
            if(!needValidation.value) return
            const { min_drop, min_width, max_drop, max_width, overall_drop, overall_width } = props.items.data

            let error = ''
            const rows = []
            const cols = []

            //get rows and cols
            sectionsData.value.forEach(el => {
                if(!rows.includes(el.row)) rows.push(el.row)
                if(!cols.includes(el.col)) cols.push(el.col)
            })
            let dropSum = 0
            let widthSum = 0
            //sum first item in rows/cols 
            rows.forEach(row => {
                const firstItemInRow = sectionsData.value.find(el => el.row == row)
                dropSum += parseFloat(firstItemInRow.drop)
            })
            cols.forEach(col => {
                const firstItemInCol = sectionsData.value.find(el => el.col == col)
                widthSum += parseFloat(firstItemInCol.width)
            })

            //min & max errors
            let widthMinMaxError = false
            let dropMinMaxError = false

            sectionsData.value.forEach(el => {
                const elementDrop = el.drop
                const elementWidth = el.width
                
                let error = false

                if(elementDrop < min_drop || elementDrop > max_drop) {
                    dropMinMaxError = true
                    error = true
                }
                if(elementWidth < min_width || elementWidth > max_width) {
                    widthMinMaxError = true
                    error = true
                } 

                if(error && el.error) return
                else el.error = error
            })
            

            //set error text
            if(overall_drop < dropSum) error = 'sum of drops for different rows (drop do not sum inside the row) cannot exceed the overall drop'
            if(overall_width < widthSum) error = 'sum of widths for different columns (width do not sum inside the column) cannot exceed overall width'
            if(widthMinMaxError) error = `width value between ${min_width} and ${max_width} of size data`
            if(dropMinMaxError) error = `drop value between ${min_drop} and ${max_drop} of size data`
            
            return error
        })

        function updOpeningPanels(type) {
            //section size type
            const isAllSectionsSameSize = props.items.data.is_all_sections_same_size
            // if(rows.length < 2) {
            //     sectionsData.value[0].drop = 
            // }
            if(type == 'overall_drop') {
                const overall_drop = props.items.data.overall_drop
                if(sectionsExample.value.length < 2)  {
                    if(overall_drop) sectionsData.value[0].drop = overall_drop
                    getSameSizeLogic('drop')
                }
                return 
            }
            if(type == 'overall_width') {
                const overall_width = props.items.data.overall_width
                if(!sectionsData.value.filter(el => el.col > 1).length)  {
                    if(overall_width) sectionsData.value[0].width = overall_width
                    getSameSizeLogic('width')
                }
                return 
            }
            if(isAllSectionsSameSize) getSameSizeLogic()
            else {
                getDifferentSizeLogic('width')
                getDifferentSizeLogic('drop') 
            }
              
        }

        function submit() {
            //if one layout
            if(!sectionsExample.value) {
                const firstPanel = sectionsData.value[0]
                props.items.data.overall_width = firstPanel.width
                props.items.data.overall_drop = firstPanel.drop
            }

            //check validation
            if(validation()) return 

            //set panel size to payload
            props.items.data.sections.forEach((el, index) => {
                el.drop = sectionsData.value[index].drop
                el.width = sectionsData.value[index].width
            })

            //submit
            emit('submit', props.items.data)
        }

        function getSameSizeLogic(type) {
            const dropFirstSection = sectionsData.value[0].drop
            const widthFirstSection = sectionsData.value[0].width

            sectionsData.value.forEach((el, index) => {
                if(index) {
                    if(!type) el.disabled.drop = true
                    if(!type) el.disabled.width = true
                    if(type == 'drop' || !type) el.drop = dropFirstSection
                    if(type == 'width' || !type) el.width = widthFirstSection
                }
            })
        }
        function getDifferentSizeLogic(type) {
            //if type drop - check row or if type width - check col
            const key = type == 'drop' ? 'row' : 'col'
            //array index cols or rows 
            const array = []
            //get array index
            sectionsData.value.forEach(el => {
                if(!array.includes(el.col)) array.push(el[key])
            })
            
            array.forEach(el => {
                //first col or row
                const firstItem = sectionsData.value.find(item => item[key] == el)
                //all items with current col or row
                const items = sectionsData.value.filter(item => item[key] == el)
                //first item for all
                items.forEach(item => {
                    item[type] = firstItem[type]
                    item.disabled[type] = true
                })
                //not disable first item 
                firstItem.disabled[type] = false
            })
        }

        function getSectionsExampleClass() {
            if(sectionsExample.value[0].length > 7) return 'big'
            if(sectionsExample.value[0].length > 5) return 'medium'
        }

        return {
            inputs,
            isAllSectionsSameSizeOptions,
            updOpeningPanels,
            sectionsData,
            svgIconFontSize,
            submit,
            validationMinMax,
            sectionsExample,
            getSectionsExampleClass,
            numberFilter,
        }
    },
})
</script>


<style scoped lang="scss">
.validation_text {
    right: 0;
    left: auto;
}
.enter-size {
    position: relative;
    height: calc(100% - 115px);
    &__container {
        display: flex;
        height: 100%;
        padding-bottom: 15px;
    }
    &__left {
        margin-right: 43px;
    }
    &__overall {
        display: flex;
        .overall {
            &__input {
                width: 170px;
                margin-right: 24px;
            }
        }
    }
    &__panel {
        display: flex;
        .panel {
            &__item {
                width: 100px;
                margin-right: 37px;
            }
        }
    }
    &__title {
        font-size: 15px;
        line-height: 140%;
        margin: 9px 0;
        text-align: left;
    }
    &__example {
        display: flex;
        justify-content: flex-start;
        margin-top: 60px;
        width: fit-content;
        position: relative;
        .example {
            &__line {
                &_width, &_height { 
                    position: absolute;
                }
                &_width {
                    top: -20px;
                    // width: 100%;
                }
                &_height {
                    right: -20px;
                    // height: 100%;
                }
            }
        }
        // ::v-deep svg{
        //     font-size: 150px;
        // }
    }
    @media(max-width: 768px) {
        &__overall {
            flex-wrap: wrap;
            .overall__input {
                margin-bottom: 10px;
            }
        }
        &__left {
            margin-right: 0;
        }
        &__container {
            flex-direction: column;
        }
        &__right {
            margin-top: 20px;
        }
    }

}
::v-deep .icons__wrapper {
    // max-height: 150px;
    display: flex;
}
::v-deep .svg-inline {
    width: 100px;
    &.width_0_5 {
        height: 200px;
    }
    &.width_2 {
        width: 200px;
    }
}
.big {
    ::v-deep .svg-inline {
        width: 60px;
        &.width_0_5 {
            height: 120px;
        }
        &.width_2 {
            width: 120px;
        }
    }
}
.medium {
    ::v-deep .svg-inline {
        width: 80px;
        &.width_0_5 {
            height: 160px;
        }
        &.width_2 {
            width: 120px;
        }
    }
}
.sizes {
    &__title {
        font-size: 18px;
        line-height: 20px;
        text-transform: uppercase;
        text-align: left;
    }
    &__row {
        font-size: 24px;
        line-height: 27px;
        display: flex;
        align-items: center;
        margin-top: 30px;
    }
    &__item {
        margin-right: 17px;
        margin-left: 11px;
    }
    @media(max-width: 768px) {
        &__row {
            flex-wrap: wrap;
        }
    }
}
</style>