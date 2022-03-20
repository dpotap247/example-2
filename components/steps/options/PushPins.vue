<template>
    <div class="push-pins">
        <div class="push-pins__position">
            <div class="push-pins__items-left">
                <Checkbox 
                    class="push-pins__item"
                    :data="item" 
                    :class="item.className" 
                    v-model="item.selected"
                    v-for="(item, index) in leftItems" 
                    :key="index"
                    @update:modelValue="updValues(leftItems)"
                />
            </div>
            <div class="push-pins__items-top">
                <Checkbox 
                    class="push-pins__item"
                    :data="item" 
                    :class="item.className" 
                    v-model="item.selected"
                    v-for="(item, index) in topItems" 
                    :key="index"
                    @update:modelValue="updValues(topItems)"
                />
            </div>
            <div class="push-pins__items-bottom">
                <Checkbox 
                    class="push-pins__item"
                    :data="item" 
                    :class="item.className" 
                    v-model="item.selected"
                    v-for="(item, index) in bottomItems" 
                    :key="index"
                    @update:modelValue="updValues(bottomItems)"
                />
            </div>
            <div class="push-pins__items-right">
                <Checkbox 
                    class="push-pins__item"
                    :data="item" 
                    :class="item.className" 
                    v-model="item.selected"
                    v-for="(item, index) in rightItems" 
                    :key="index"
                    @update:modelValue="updValues(rightItems)"
                />
            </div>
            <div class="push-pins__wrapper">
            </div>
        </div>
        <div class="push-pins__note">
            Please note: Looking  from outside
        </div>
    </div>
</template>

<script>
import RadioGroupItems from '../../form/RadioGroupItems.vue'
import Checkbox from '../../form/Checkbox.vue'
import { useOptionLogic } from '../../../composables/estimate/create'

import { ref, computed } from 'vue'

export default ({
    props: ['items', 'currentSection', 'allData'],
    components: {
        RadioGroupItems,
        Checkbox
    },
    setup(props) {
        const optionLogic = useOptionLogic()

        const currentItem = computed(() => {
            const currentSection = props.items.sections[props.currentSection]
            const optionName = props.items.optionName 
            const item = currentSection.options[optionName].option_settings.settings
            return item
        })

        const bottomItems = ref([
            {
                label: 'Bottom',
                className: 'bottom_left',
                selected: false,
                key: 'bottom_left'
            },
            {
                label: 'Bottom',
                className: 'bottom_middle',
                selected: false,
                key: 'bottom_middle'
            },
            {
                label: 'Bottom',
                className: 'bottom_right',
                selected: false,
                key: 'bottom_right'
            },
        ])

        const leftItems = ref([
             {
                label: 'Left',
                className: 'left_bottom',
                selected: false,
                key: 'left_bottom'
            },
            {
                label: 'Left',
                className: 'left_middle',
                selected: false,
                key: 'left_middle'
            },
            {
                label: 'Left',
                className: 'left_top',
                selected: false,
                key: 'left_top'
            },
        ])

        const rightItems = ref([
            {
                label: 'Right',
                className: 'right_bottom',
                selected: false,
                key: 'right_bottom'
            },
            {
                label: 'Right',
                className: 'right_middle',
                selected: false,
                key: 'right_middle'
            },
            {
                label: 'Right',
                className: 'right_top',
                selected: false,
                key: 'right_top'
            },
        ])

        const topItems = ref([
            {
                label: 'Top',
                className: 'top_left',
                selected: false,
                key: 'top_left'
            },
            {
                label: 'Top',
                className: 'top_middle',
                selected: false,
                key: 'top_middle'
            },
            {
                label: 'Top',
                className: 'top_right',
                selected: false,
                key: 'top_right'
            },
        ])
        
        getData()
        function getData() {
            const arrays = [...bottomItems.value, ...leftItems.value, ...rightItems.value, ...topItems.value]
            for(const key in currentItem.value) {
                const value = currentItem.value[key]
                const currentUIItem = arrays.find(el => el.key == key)
                if(currentUIItem) currentUIItem.selected = !!value
            }
        }

        function updValues(items) {
            items.forEach(el => {
                currentItem.value[el.key] = el.selected
            })
        }

        return {
            topItems, 
            leftItems, 
            rightItems, 
            bottomItems,
            updValues,
            optionLogic
        }
    },
})
</script>

<style scoped lang="scss">
.option-step {
    &__radio-groups {
        flex-direction: column;
         ::v-deep .radio-group__item {
            margin-right: 0;
            margin-bottom: 10px;
        }
    }
}
.push-pins {
    padding: 40px 80px;
    &__note {
        margin-top: 60px;
    }
}
.push-pins__position {
    width: 600px;
    height: 200px;
    position: relative;
    ::v-deep .form-group {
        width: auto;
        margin-bottom: 0;
    }
    .push-pins {
        &__items {
            &-right {
                position: absolute;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                right: -80px;
                height: 100%;
            }
            &-left {
                position: absolute;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                left: -80px;
                height: 100%;
                ::v-deep .form-group label {
                    flex-direction: row-reverse;
                    &::before {
                        margin-right: 0;
                        margin-left: 15px;
                    }
                    &::after {
                        left: 45px;
                    }
                }
            }
            &-top {
                position: absolute;
                display: flex;
                justify-content: space-between;
                top: -40px;
                width: 100%;
            }
            &-bottom {
                position: absolute;
                display: flex;
                justify-content: space-between;
                bottom: -40px;
                width: 100%;
            }
        }
        &__wrapper {
            width: 100%;
            border: 1px solid;
            height: 100%;
            position: relative;
        }
        // &__item {
        //     position: absolute;
        //     margin-right: 0;
        //     width: auto;
        //     margin-bottom: 0;
        // }
    }
}
</style>
