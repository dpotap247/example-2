<template>
    <div class="option">
        <div class="sections"
            v-if="currentStepItems.sections.length > 1
            && currentStepItems.appliesTo == 'section'">
            <svg-icon-qouting
                class="sections__item"
                :class="{ 'active': currentSectionIndex == index }"
                :data="item.icon"
                v-for="(item, index) in currentStepItems.sections"
                :key="index"
                @click="updCurrentSection(index)"
            />
        </div>
        <component
            ref="refComponent"
            :is="component.name"
            :class="component.className"
            :currentSection="currentSectionIndex"
            :error="error"
            :allData="allData"
            :data="items"
            :items="currentStepItems"
            @error="error = $event"
            @updColor="$emit('updColor')"
            @needShowModal="needShowModal = $event"
            @nextOption="nextOption = $event, submit('submit')"
            v-if="component.name && currentStepItems"
        />
        <span
            class="validation_text"
            v-show="error">
            *{{ error }}
        </span>
    </div>
</template>

<script>
import OptionOneRadioGroup from './options/OptionOneRadioGroup.vue'
import Insert from './options/Insert.vue'
import PetDoors from './options/PetDoors.vue'
import Lock from './options/Lock.vue'
import Hinges from './options/Hinges.vue'
import MidrailsAndMullions from './options/MidrailsAndMullions.vue'
import Additions from './options/Additions.vue'
import HooperHatches from './options/HooperHatches'
import LiftTabs from './options/LiftTabs'
import PushPins from './options/PushPins'
import MeshFlaps from './options/MeshFlaps'
import PortSets from './options/PortSets'
import Cylinder from './options/Cylinder'


import { computed, ref } from 'vue'
export default({
    props: ['items', 'allData'],
    components: {
        OptionOneRadioGroup,
        PetDoors,
        Insert,
        Lock,
        Hinges,
        MidrailsAndMullions,
        Additions,
        HooperHatches,
        LiftTabs,
        PushPins,
        MeshFlaps,
        PortSets,
        Cylinder,
    },
    setup(props, {emit}) {
        const refComponent = ref(null)
        const error = ref(false)

        const nextOption = ref(null)

        const needShowModal = ref(false)

        const currentStepItems = computed(() => {
            const optionName = props.items.current_step.option
            const currentOption = props.items.steps.find(el => el.option == optionName)
            const optionCode = currentOption.option_code

            const stepSize = props.items.steps.find(el => el.name.toLowerCase() == 'size')
            const appliesTo = props.items.steps.find(el => el.option == optionName).applies_to
            const sections = stepSize.data.sections

            return  {
                sections,
                appliesTo,
                optionName,
                optionCode
            }
        })


        const component = computed(() => {
            const optionCode = currentStepItems.value.optionCode
            const optionName = currentStepItems.value.optionName

            let value = ''
            switch(optionCode) {
                case 'PET':
                    value = 'pet-doors'
                    break
                case 'PSHP': 
                    value = 'push-pins'
                    break
                case 'LOCK': 
                    value = 'lock'
                    break
                case 'INS':
                    value = 'insert'
                    break
                case 'ADD': 
                    value = 'additions'
                    break
                case 'HNG': 
                    value = 'hinges'
                    break
                case 'LFTT': 
                    value = 'lift-tabs'
                    break
                case 'HOPH':
                    value = 'hooper-hatches'
                    break
                case 'MFLP': 
                    value = 'mesh-flaps'
                    break
                case 'PRTS': 
                    value = 'port-sets'
                    break
                case 'CYL':
                    value = 'cylinder'
                    break
                case 'MIDR':
                case 'MULL':
                    value = 'midrails-and-mullions'
                    break
                case 'WHL':
                case 'MESH':
                    value = 'option-one-radio-group'
                    break
                default: value = ''
            }

            return {
                className: optionName && optionName.split(' ').join('-').toLowerCase(),
                name: value
            }
        })

        const wizardParams = sessionStorage.getItem('wizardParams') && JSON.parse(sessionStorage.getItem('wizardParams')) || {}
        const currentSectionIndex = ref(wizardParams.index || 0)

        function submit(type) {
            if(error.value) return
            
            if(needShowModal.value) {
                refComponent.value.showModal(true)
                needShowModal.value = false
                return 
            }
        
            const sections = getSections()
            const nextStep = nextOption.value || 'next'
            emit('optionSubmit', { sections , type, nextStep })
            nextOption.value = ''
        }

        function getSections() {
            const optionName = props.items.current_step.option
            const sizeStep = props.items.steps.find(el => el.name.toLowerCase() == 'size')
            const sections = JSON.parse(JSON.stringify(sizeStep.data.sections))
            sections.forEach((el) => {
                const currentOption = el.options[optionName]
                el.options = { [optionName]: currentOption }
            })
            return sections
        }

        function updCurrentSection(index) {
            currentSectionIndex.value = index
            setTimeout(() => {
                refComponent.value.getData()
            })
        }

        return {
            currentStepItems,
            component,
            refComponent,
            currentSectionIndex,
            submit,
            updCurrentSection,
            error,
            nextOption,
            needShowModal,
        }
    },
})
</script>


<style scoped lang="scss">
.option {
    position: relative;
}
.sections {
    display: flex;
    margin-bottom: 20px;
    &__item {
        display: flex;
        font-size: 60px;
        cursor: pointer;
        ::v-deep .svg-inline {
            width: 20px;
            &.width_2 {
                width: 40px;
            }
            &.width_0_5 {
                height: 20px;
                width: auto;
            }
        }
        width: 20px;
        ::v-deep .svg-icon-secondary-colour, ::v-deep  .svg-icon-primary-colour{
            fill: #777777;
        }

        &.active {
            ::v-deep .svg-icon-secondary-colour {
                path {
                    fill: var(--LayoutIconSecondary);
                }
            }
            ::v-deep .svg-icon-primary-colour {
                path {
                    fill: var(--LayoutIconPrimary);
                }
            }
        }
    }
}
</style>

<style lang="scss">
.option-step {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    width: 100%;
    &__right, &__left {
        width: 50%;
        @media(max-width: 768px) {
            width: 100%;
        }
        .step__options {
            &:last-of-type {
                margin-bottom: 0;
            }
        }
    }
    &__color {
        text-align: left;
        margin: 10px 0;
        span {
            display: inline-block;
            margin-bottom: 5px;
            font-size: 14px;
            line-height: 100%;
        }
    }
    &__note {
        border-top: 1px solid #000;
        padding-top: 10px;
        margin-top: 30px;
    }
    &__options {
        margin-bottom: 30px;
        min-width: 33%;
        flex-wrap: wrap;
        @media(max-width: 768px) {
            margin-bottom: 10px;
        }
    }
    &__item {
        min-width: 225px;
        margin-bottom: 10px;
        display: flex;
        flex-wrap: wrap;
        ::v-deep .radio-group__item {
            margin-bottom: 10px;
        }
    }
    &__image {
        max-height: 195px;
        display: flex;
        margin-right: auto;
        margin-bottom: 10px;
    }
    &__price {
        position: absolute;
        right: 25px;
        bottom: 28px;
        color: #fff;
        transform: translateY(50%);
    }
    &__title {
        font-size: 24px;
        margin-bottom: 10px;
        text-align: left;
    }
}
.sections__item {
    padding-bottom: 3px;

    &.active {
        border-bottom: 1px solid red;
        padding-bottom: 2px;
    }
}


</style>
