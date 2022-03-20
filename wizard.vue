<template>
    <div class="wizard">
        <div class="wizard__item step">
            
            <div class="wizard__nav" v-if="data && data.breadcrumbs && data.breadcrumbs.length > 1">
                <svg-icon-qouting class="wizard__btn_back" data="fas fa-arrow-left" v-if="data.history && data.history.length > 1" @click="goToRoute('prev')" />
                <BreadCrumbs 
                    :steps="data.breadcrumbs" 
                    @jumpTo="goToRoute"/>
            </div>
            <Loader class="wizard__loader" customClass="big" v-if="loading || !currentStep" /> 
            <template v-else>
                <div class="step__title" v-if="currentStep.title">
                    {{ !data.current_step.option ? data.current_step.name : data.current_step.option }}
                    <HelpTopic 
                        v-if="data.current_step.help_topic_url" 
                        :iframe-data="data.current_step.help_topic_url"
                    />
                    
                </div>
                <div class="wizard__content" 
                    :class="currentStep.className" 
                    :style="{height: wizardHeight}"
                >                    
                    <component 
                        ref="refComponent" 
                        :is="currentStep.component" 
                        :stepName="data.current_step.name" 
                        :items="propsItems" 
                        :allData="data"
                        @submit="submit" 
                        @optionSubmit="optionSubmit"
                        @nextOption="nextOption"
                        @jumpTo="goToRoute"
                        @updColor="nextStep('updColor')"
                    />
                </div>
            </template>

            <Panel     
                :buttons="currentStep.buttons" 
                ref="refPanel"
                :price="price" v-if="!loading && currentStep && currentStep.buttons || !loading && price"
                @next="nextStep" 
                @save="save('save')"
                @saveNew="save('save-new')"
                @saveClone="save('save-clone')"
            />

            <UnsavedDataModal 
                v-model="showUnsavedModal" 
                @loadData="initWizard($event), closeUnsavedModal()" 
                @closeModal="initWizard(), closeUnsavedModal('clear')"
            />
        </div>
    </div>
</template>

<script>
import { ref, computed, onBeforeUnmount, onMounted } from 'vue'
import BreadCrumbs from './components/BreadCrumbs'
import Type from './components/steps/Type'
import Layout from './components/steps/Layout'
import LayoutPriceFrom from './components/steps/LayoutPriceFrom'

import Size from './components/steps/Size'
import Color from './components/steps/Color'
import Option from './components/steps/Option'
import Location from './components/steps/Location'
import AllOptions from './components/steps/AllOptions'
import Panel from './components/Panel'
import HelpTopic from './components/elements/HelpTopic'
import UnsavedDataModal from './components/modals/UnsavedDataModal.vue'
import { useOptionLogic } from './composables/estimate/create'
// import Insert from './components/steps/Insert'

import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import api from './services/wizard.service'
import Loader from './components/elements/Loader'
import { wizardSteps } from './store/constant'
import { sortItems } from './helpers/objects'

export default({
    props: ['isModal', 'isQuoting'],
    components: {
        BreadCrumbs,
        LayoutPriceFrom,
        Layout,
        Option,
        Location,
        Loader,
        Type,
        Color,
        Size,
        // Insert,
        HelpTopic,
        Panel,
        AllOptions,
        UnsavedDataModal,
    },
    setup(props, { emit }) {
        const loading = ref(true)
        const store = useStore()
        const router = useRouter()

        const showUnsavedModal = ref(false)

        const optionLogic = useOptionLogic({})

        const data = ref(null)
        const wizard = ref(wizardSteps)
        
        const refComponent = ref(null)
        localStorage.setItem('isQuoting', !!props.isQuoting)

        const propsItems = computed(() => {
            if(data.value.current_step.settings?.data) return data.value.current_step.settings
            return data.value
        })

        //start logic
        if(!props.isModal) checkUnsavedData()
        if(!showUnsavedModal.value) initWizard()

        

        const price = computed(() => {
            if(!data.value.dry_price) return 0
            return data.value.dry_price + store.getters['wizard/currentPrice']
        })

        const currentStep = computed(() => {
            const stepType = data.value?.current_step?.name.toLowerCase().split(' ').join('_')
            if(stepType) return wizard.value[stepType]
            return null
        })

        const wizardHeight = computed(() => {
            if(currentStep.value.component == 'type') return 'calc(100% - 49px)'
            if(currentStep.value.buttons || price.value) return 'calc(100% - 129px)'
            return 'calc(100% - 90px)'
        })

        async function initWizard(unsavedData) {
            const sessionStorageParams = sessionStorage.getItem('wizardParams') && JSON.parse(sessionStorage.getItem('wizardParams'))
            const params =  { ...sessionStorageParams }
            if(params.sectionType || params.sectionId) {
                const cloneData = await api.cloneItem(params.sectionType, params.sectionId)
                if(cloneData) Object.assign(params, cloneData)
            }
            data.value = unsavedData || sortData(await api.init(params))
            store.commit('wizard/setField', { field: 'price', value: null})
            getOptionsPrice()
            loadingLogic(false)
        }

        function getOptionsPrice() {
            const sizeStep = data.value.steps.find(el => el.name == 'Size')
            if(!sizeStep) return
            const sections = sizeStep?.data?.sections
            if(sections) optionLogic.getPrice(sections)
        }

        //unsaved data logic
        function checkUnsavedData() {
            const unsavedData = sessionStorage.getItem('wizardCurrentStep') && JSON.parse(sessionStorage.getItem('wizardCurrentStep'))
            showUnsavedModal.value = !!unsavedData && unsavedData.origin == window.location.origin
            return !!unsavedData
        }

        function closeUnsavedModal(clear) {
            if(clear) sessionStorage.removeItem('wizardCurrentStep')
            showUnsavedModal.value = false
        }

        async function submit(selection, method = 'nextStep') {    
            loadingLogic(true)        
            data.value = sortData(await api[method]({...data.value, selection}))
            getOptionsPrice()
            loadingLogic(false)
        }

        async function optionSubmit(args) {
            const type = args.type
            const sections = args.sections

            if(type == 'updColor') {
                submit({ sections } , 'setOptionColor') 
                return
            }
           
            const nextStep = args.nextStep
            const stepId = data.value.steps.find(step => step.option?.toLowerCase() == nextStep)?.id
            
            if(stepId) goToRoute(stepId)
            else submit({ sections }) 
        }

        function nextStep(type = 'submit') {
            refComponent.value.submit(type)
        }

        function sortData(data, key = 'sort_order') {
            const currentStepItems = data.current_step?.settings?.data
            if(currentStepItems && Array.isArray(currentStepItems) && currentStepItems[0][key]) {
                sortItems(currentStepItems, key)
            } 
            //set to sessionStorage sstep if not first step
            if(!props.isModal && currentStep.value && currentStep.value.component !== 'type') {
                const origin = window.location.origin
                sessionStorage.setItem('wizardCurrentStep', JSON.stringify({...data, origin}))
            }

            return data
        }

        async function goToRoute(id) {
            loadingLogic(true)  

            const payload = data.value
            if(id == 'prev') {
                data.value = sortData(await api.routeBack(payload))
            } else data.value = sortData(await api.routeJumpTo(id, payload))
            // getOptionsPrice()
            loadingLogic(false)
        }
        
        function loadingLogic(value) {
            loading.value = value
        }

        function stopLoadingButton() {
            const loadingButton = currentStep.value.buttons.find(el => el.loading)
            if(loadingButton) loadingButton.loading = false
        }

        async function save(type) {
            const token = localStorage.getItem('token')
            if(!token) {
                emit('showRegisterModal')
                // router.replace({name: 'create', params: { saveType: type }})
                sessionStorage.setItem('wizardSaveType', type)
                stopLoadingButton()
                return 
            }
            if(!type) {
                type = sessionStorage.getItem('wizardSaveType')
                sessionStorage.removeItem('wizardSaveType')
            }
            
            const result = await api.save(type, data.value)

            stopLoadingButton()

            if(result) {
                emit('alert', 'Saved successfully')
                switch(type) {
                    case 'save': 
                        if(props.isModal) emit('closeModal', data.value)
                        else {
                            const params = {}
                            const { customer_order_id, dealer_order_id } = result.container_id
                            params.id = customer_order_id || dealer_order_id
                            params.type = customer_order_id ? 'customer' : 'dealer'

                            router.push({ name: 'estimate-item', params })
                            sessionStorage.removeItem('wizardCurrentStep')
                        }
                        break
                    case 'save-new': 
                        loadingLogic(true) 
                        sessionStorage.setItem('estimateNeedLoadData', true)
                        data.value = result.builder                         
                        loadingLogic(false) 
                        break
                    case 'save-clone':
                        data.value = result.builder
                        sessionStorage.setItem('estimateNeedLoadData', true)
                        break
                }
            }
        }
    

        return {
            loading,
            currentStep,
            data,
            submit,
            optionSubmit,
            goToRoute,
            wizardHeight,
            refComponent,
            nextStep,
            price,
            save,
            propsItems,
            showUnsavedModal,
            closeUnsavedModal,
            initWizard
        }
    },
})
</script>

<style lang="scss">
.wizard {
    .items__container {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        flex-wrap: wrap;
        width: 100%;
    }
}
</style>

<style scoped lang="scss">
.wizard {
    height: 100%;
    width: 100%;
    &__loader {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    &__item {
        height: calc(100vh - 160px);
        width: 100%;
        margin: 0 auto;
        background: #fff;
        padding: 25px 37px;
        position: relative;
        overflow: hidden;
        @media(max-width: 768px) {
            padding: 10px;
            height: auto;
            min-height: calc(100vh - 160px);
            display: flex;
            flex-direction: column;
            
        }
    }
    &__nav {
        display: flex;
        align-items: flex-start;      
        margin-bottom: 20px;
  
    }
    &__btn_back {
        margin-right: 10px;
        // margin-top: 2px;
        color: var(--PrimaryButtonColour);
        cursor: pointer;
    }
    @media(max-width: 768px) {
        &__item {
            padding: 10px;
        }
    }
}
.step  {
    &__title {
        font-size: 24px;
        line-height: 27px;
        text-transform: uppercase;
        color: #000000;
        font-weight: bold;
        text-align: left;
        font-family: Sansation;
    }
}
.wizard__content {
    display: block;
    margin-top: 21px;
    height: calc(100% - 90px);
    overflow-y: auto;
    @media(max-width: 768px) {
        height: auto;
        overflow-x: hidden;
        margin-top: 10px;
    }
    & > div {
        min-height: 100%;
    }
    &.overflow-hidden{
        overflow: hidden;
        & > div {
            height: 100%;
        }
    }
}
</style>
