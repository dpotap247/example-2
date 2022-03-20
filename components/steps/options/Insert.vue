<template>
    <div class="insert">
        <div class="select-color">
            <span class="select-color__title">Select colour:</span>
            <SelectColor :colorGroup="colorGroup" v-if="colorGroup" @submit="selectColor"/>
        </div>
        <div class="insert__actions">
            <InputGroup 
                class="location__input" 
                :data="{ label: '', placeholder: 'Type to Search', type: 'text', required: true, error: ''}" 
                v-model="searchQuery"
            />
        </div>
        <div class="insert__items-container">
            <div class="insert__items" v-if="options">
                <div class="insert__item" :class="{ disabled: item.disabled }" v-for="item in searchResult" :key="item.key">
                    <div class="item__img">
                        <div class="img__bg"></div>
                        <img :src="item.image" loading="lazy" alt="inset example">
                    </div>
                    <div class="item__info">
                        <span>Width: {{`${getSizeValue('width', item)}`}}</span>
                        <span>Drop: {{`${getSizeValue('drop', item)}`}}</span>
                    </div>
                    <div class="item__selected">
                        <RadioGroup 
                            v-if="!item.disabled"
                            :data="{label: item.label, key: item.key, value: item.value}" 
                            :key="`${optionLogic.currentKeyForValues.value}_${values[optionLogic.currentKeyForValues.value]}`" 
                            v-model="values[optionLogic.currentKeyForValues.value]"
                            @update:modelValue="updValues"
                        />
                    </div>
                </div>
            </div>
            <!-- <SelectColor :colorGroup=".colour_group" @submit="selectColor"/> -->
        </div>
    </div>
</template>

<script>
import { ref, computed } from 'vue'

import InputGroup from '../../form/InputGroup'
import RadioGroup from '../../form/RadioGroup'
import InputSize from '../../form/InputSize'
import { useOptionLogic } from "../../../composables/estimate/create"
import { useLimitsLogic } from '../../../composables/estimate/limits'
import SelectColor from '../../elements/SelectColor.vue'
// import SelectColor from '../../../'


export default ({
    props: ['items', 'currentSection', 'allData'],
    components: {
        InputGroup,
        RadioGroup,
        InputSize,
        SelectColor,
    },
    setup(props, { emit }) {
        const options = ref(null)
        const values = ref({})
        const optionLogic  = useOptionLogic(props)
         //check disabled items
        const limitsLogic = useLimitsLogic(props)

        getData()
        function getData() {
            optionLogic.getData(options, values)
            options.value = options.value.map(el => {
                const disabled = limitsLogic.getDisabledValue(el)
                return {
                    ...el,
                    disabled,
                }
            })
        }

        function updValues() {
            const key = optionLogic.currentKeyForValues.value     
            const selectedId = values.value[key]      
            optionLogic.selectItem(selectedId)
        }

        const searchResult = computed(() => {
            const search = searchQuery.value.split('').join('').toLowerCase()
            if(search) return options.value.filter(el => el.label.split('').join('').toLowerCase().includes(search))
            return options.value
        })

        const searchQuery = ref('')

        const colorGroup = computed(() =>  {
            const defaultGroup = props.items.sections[props.currentSection].options['Insert'].option_settings.groups.find(el => el.name == 'default')
            return defaultGroup?.colour_group
        })

        function selectColor(color) {
            const key = optionLogic.currentKeyForValues.value 
            const currentItem = values.value[key]
            optionLogic.selectColor(color.id, currentItem, 'default')
            emit('updColor')
        }

        function getSizeValue(type, item) {
            const min_value = item[`${type}_min`]
            const max_value = item[`${type}_max`]

            return `${min_value}-${max_value}mm`
        }

        return {
            searchQuery,
            options,
            values,
            optionLogic,
            searchResult,
            updValues,
            getSizeValue,
            colorGroup,
            selectColor
        }
    },
})
</script>


<style scoped lang="scss">
.insert {
    height: 100%;
    position: relative;
    margin-top: -5px;
    &__actions {
        width: 400px;
        max-width: 100%;
    }
    &__items {
        display: flex;
        flex-wrap: wrap;
        width: calc(100% + 80px);
        transform: translateX(-40px);
        &-container {
            height: calc(100% - 40px);
            overflow-y: auto;
            overflow-x: hidden;
        }
    }
    &__item {
        margin: 20px 40px 0;
        min-width: 205px;
        &.disabled {
            .item {
                &__img {
                    opacity: 0.4;
                }
                &__info {
                    color: #DB5151;
                }
            }
        }
    }
}
.item {
    &__img {
        display: flex;
        position: relative;
        max-width: 120px;   
        img {
            max-height: 240px;
            position: relative;
            z-index: 10;
        }
    }
    &__info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin: 5px 0;
        span {
            display: block;
            margin-top: 5px;
            font-size: 12px;
            &::first-of-type {
                margin-top: 0;
            }
        }

    }
}
.options {
    display: flex;
    flex-wrap: wrap;
    &__item {
        width: 400px;
        margin-right: 0;
        &:last-of-type {
            margin-right: 0;
        }
    }

}

::v-deep .radio-group__input:checked, ::v-deep .radio-group__input:not(:checked) {
    label {
        padding-left: 25px;
    }
}
.img {
    &__bg {
        background: var(--PrimaryColour);
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        right: 0;
    }
}
.select-color {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 15px;
    top: 0;
    background: #fff;
    span {
        margin-bottom: 5px;
    }
}
</style>