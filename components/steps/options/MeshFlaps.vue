<template>
    <div class="mesh-flaps">
        <div class="mesh-flaps__position">
            <!-- <div class="option-step__title">Position</div> -->
            <div class="position__wrapper">
                <Checkbox 
                    class="position__item"
                    :data="item" 
                    :class="item.className" 
                    v-model="item.selected"
                    v-for="(item, index) in positionOptions" 
                    :key="index"
                    @update:modelValue="updValues('position', $event)"
                />
            </div>
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

        const positionOptions = ref([
            {
                label: 'Left',
                className: 'position_left',
                selected: false,
                key: 'left'
            },
            {
                label: 'Top',
                className: 'position_top',
                selected: false,
                key: 'top'
            },
            {
                label: 'Right',
                className: 'position_right',
                selected: false,
                key: 'right'
            },
            {
                label: 'Bottom',
                className: 'position_bottom',
                selected: false,
                key: 'bottom'
            }
        ])

        function updValues(type) {
            positionOptions.value.forEach(el => {
                const value = el.selected
                const oldValue = currentItem.value[el.key]
                if(value !== oldValue) currentItem.value[el.key] = value
            })
        }

        return {
            positionOptions,
            updValues
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
.mesh-flaps__position {
    .position {
        &__wrapper {
            border: 1px solid #000;
            height: 150px;
            width: 300px;
            position: relative;
        }
        &__item {
            position: absolute;
            margin-right: 0;
            width: auto;
            margin-bottom: 0;
        }
        &_left, &_right {
            top: 50%;
            transform: translateY(-50%);
        }
        &_top, &_bottom {
            left: 50%;
            transform: translateX(-50%);
        }
        &_left {
            left: 5px;
            ::v-deep  label {
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
        &_right {
            right: 5px;
        }
        &_top {
            top: 5px;
        }
        &_bottom {
            bottom: 5px;
        }
    }
}
</style>
