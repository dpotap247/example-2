<template>
    <div class="estimate">
        <Header
            v-if="header && buttons && buttons.length"
            :headerData="headerData"
            :data="header"
            :stateEstimate="stateEstimate"
            :quantityItems="quantityItems"
            :summary="summary"
            :buttons="buttons"
            @requestEstimate="showRequestModal = true"
            @additionalClick="$router.push({ name: 'specification', params: { id: $route.params.id } })"
        />
        <div class="estimate__content container" v-if="locations">
            <ContentPanel :stateEstimate="stateEstimate" :quantity="quantityItems" :buttons="buttons" @addNewItem="showWizard()"/>
            <draggable class="estimate__items" handle=".location__drag" v-model="locations" @sort="setSortLocations">
                <template #item="{element}">
                    <Location
                        :data="element"
                        @showWizard="showWizard"
                        @clone="showWizard"
                        :stateEstimate="stateEstimate"
                        @removedItem="getLocationItems(locations, $event.name, 'remove')"/>
                </template>
            </draggable>
        </div>
        <Loader class="estimate__loader" v-else-if="!$store.state.loader" />

        <div class="estimate__summary" v-if="summary">
            <Summary
                class="container"
                :stateEstimate="stateEstimate"
                :quantityItems="quantityItems"
                :data="header"
                :summary="summary"
                :buttons="buttons"
                @requestEstimate="showRequestModal = true"
            />
        </div>

        <!-- <Modal v-model="showSpecificationModal">
            <Specification :id="itemId" v-if="showSpecificationModal"/>
        </Modal> -->

        <Modal v-model="showWizardModal" @update:modelValue="closeWizard">
            <Wizard
                ref="refWizard"
                :isModal="true"
                :isQuoting="isQuoting"
                @showRegisterModal="showModal('register')"
                @closeModal="closeWizard"
                v-if="showWizardModal"
            />
        </Modal>

        <Request
            :id="itemId"
            v-if="showRequestModal"
            @close="showRequestModal = false"
            @loadHeaderData="getHeaderData"
        />
    </div>
</template>

<script>
import api from './services/item.service.js'
import Summary from './components/estimate/item/Summary'
import Location from './components/estimate/item/Location'
import Header from './components/estimate/item/Header'
import Button from './components/form/Button'
import draggable from 'vuedraggable'
import Loader from './components/elements/Loader.vue'
import Wizard from './wizard'
import Request from './components/estimate/request'
import Modal from './components/elements/Modal'
import  { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import  { ref, computed } from 'vue'
import { sortItems } from './helpers/objects'
import Buttons from './components/estimate/elements/Buttons.vue'
import ContentPanel from './components/estimate/item/ContentPanel.vue'
import Specification from './components/estimate/specification/index.vue'



export default ({
    props: ['isQuoting', 'type', 'headerData'],
    components: {
        Summary,
        Location,
        Header,
        Button,
        Loader,
        draggable,
        Wizard,
        Modal,
        Request,
        Buttons,
        ContentPanel,
        Specification,
    },
    data() {
        return {
            drag: false,
        }
    },
    setup(props) {
        const store = useStore()
        const route = useRoute()

        const header = ref(null)

        const locations = ref(null)
        const summary = ref(null)
        const buttons = ref(null)
        const showWizardModal = ref(false)
        // const showSpecificationModal = ref(false)
        const showRequestModal = ref(false)

        const quantityItems = computed(() => locations.value && locations.value.length)

        const stateEstimate = computed(() => header.value?.state == 'Estimate')

        const itemId = route.params.id
        const itemType = route.params.type || localStorage.getItem('estimateType')
        if(itemType) localStorage.setItem('estimateType', itemType)

        getData()

        async function getHeaderData() {
            header.value = await api.getData(itemId, itemType)
            if(showRequestModal.value) showRequestModal.value = false
        }

        async function getData() {
            if(props.isQuoting) {
                 store.commit('setField', {
                    field: 'loading', value: true,
                })
            }

            //req header data
            if(props.headerData) getHeaderData()
            //req buttons data
            buttons.value = await api.getData(itemId, itemType, 'actions')

            if(props.isQuoting) {
                 store.commit('setField', {
                    field: 'loading', value: false,
                })
            }


            //req locations data

            const resultLocations = Object.fromEntries(sortItems(await api.getData(itemId, itemType, 'locations'), 'sort_order'))

            locations.value = Object.values(resultLocations)

            getSummary()

            getLocationItems(resultLocations)
        }

        async function getSummary() {
            //req summary data
            summary.value = await api.getData(itemId, itemType, 'summary')
        }

        async function updLocationPrice(item, locationName) {
            const locations = await api.getData(itemId, itemType, 'locations')
            const currentLocation = locations[locationName]
            console.log(locations, locationName, currentLocation)
            if(currentLocation) item.amount = currentLocation.amount
    }

        async function getLocationItems(resultLocations, locationName, typeAction) {
            if(locationName) {
                locations.value = resultLocations
                const item = resultLocations.find(el => el.name == locationName)
                item.items = []
                if(typeAction == 'remove') {
                    updLocationPrice(item, locationName)
                }
                const items = await api.getLocationItems(itemId, itemType, locationName)
                item.items = filterOverallSectionItems(items)

                if(!item.items.length) removeLocation(locationName)
            } else {
                for(const key in resultLocations) {
                    const item = locations.value.find(el => el.name == key)
                    const items = await api.getLocationItems(itemId, itemType, key)
                    item.items = filterOverallSectionItems(items)
                }
            }
            getSummary()
        }

        function removeLocation(locationName) {
            const index = locations.value.findIndex(el => el.name == locationName)
            locations.value.splice(index, 1)
        }

        function filterOverallSectionItems(items) {
            if(!items) return
            const sections = []
            items.forEach((el, index) => {
                const positionLayoutId = el.position_layout && el.position_layout.id || index
                const includesSection = sections.length && sections.find(el => el.section_info && el.section_info.id == positionLayoutId)
                if(!includesSection) {
                    const arrayOverallPositionLayout = items.filter(el =>  el.position_layout && el.position_layout.id == positionLayoutId)
                    const section_items = arrayOverallPositionLayout.length && arrayOverallPositionLayout || [el]
                    sections.push({
                        section_info: el.position_layout,
                        section_items,
                    })
                }
            })
            return sections
        }

        async function closeWizard(data) {
            showWizardModal.value = false
            const estimateNeedLoadData = sessionStorage.getItem('estimateNeedLoadData')
            const wizardParams = sessionStorage.getItem('wizardParams') && JSON.parse(sessionStorage.getItem('wizardParams'))

            if(estimateNeedLoadData) {
                sessionStorage.removeItem('estimateNeedLoadData')
                getData()
                return
            }

            if(data) {
                const location = data.steps.find(el => el.name == 'Location').data.toLowerCase().trim()

                //if change location
                if(location !== wizardParams.location) {
                    const previousLocation = locations.value.find(el => el.name == wizardParams.location)
                    if(previousLocation) {
                        previousLocation.items = []
                        const previousLocationItems = await api.getLocationItems(itemId, itemType, wizardParams.location)
                        if(!previousLocationItems.length) removeLocation(wizardParams.location)
                        else {
                            previousLocation.items = filterOverallSectionItems(previousLocationItems)
                            updLocationPrice(previousLocation, wizardParams.location)
                        }
                    }
                }

                //match with old locations
                const matchLocation = locations.value.find(el => el.name == location)


                if(matchLocation) {
                    matchLocation.items = []
                    updLocationPrice(matchLocation, location)
                    const locationItems = await api.getLocationItems(itemId, itemType, location)
                    matchLocation.items = filterOverallSectionItems(locationItems)
                } else {
                    //get all locations
                    const allLocations = await api.getData(itemId, itemType, 'locations')
                    const locationsArray = Object.values(allLocations)
                    const lastIndex = locationsArray.length - 1
                    const lastLocation = locationsArray[lastIndex]
                    //get last location items
                    const locationItems = await api.getLocationItems(itemId, itemType, lastLocation.name)
                    lastLocation.items = filterOverallSectionItems(locationItems)
                    //push last location with items
                    locations.value.push(lastLocation)
                }
            }

            getSummary()
            sessionStorage.removeItem('wizardParams')
        }

        async function showWizard(event) {
            const params = {
                ...event,
            }

            if(props.type == 'dealer') params.dealer_order_id = route.params.id
            else params.customer_order_id = route.params.id

            sessionStorage.setItem('wizardParams', JSON.stringify(params))
            showWizardModal.value = !showWizardModal.value
        }


        function setSortLocations() {
            const newSort = Array.from(locations.value, el => el.name)
            api.setSortLocations(itemId, itemType, newSort)
        }



        return {
            itemId,
            locations,
            summary,
            buttons,
            header,
            showWizard,
            showWizardModal,
            closeWizard,
            showRequestModal,
            setSortLocations,
            getHeaderData,
            getLocationItems,
            quantityItems,
            stateEstimate
            // removeItem
            // showSpecificationModal
        }

    },
})
</script>

<style scoped lang="scss">
.estimate {
    position: relative;
    padding: 50px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    &__summary {
        padding: 50px 0;
        background: linear-gradient(0deg, rgba(11, 53, 83, 0.07), rgba(11, 53, 83, 0.07)), #FFFFFF;
        @media(max-width: 768px) {
            padding: 10px 0;
        }
    }
    &__summary {
        width: 100%;
    }
    &__loader {
        margin-top: 60px;
        display: block;
        ::v-deep svg {
            font-size: 50px;
        }
    }
    &__items {
        margin: 30px auto;
    }
    &__content {
        margin-top: 30px;
        min-height: calc(100vh - 234px - 335px - 100px);
        @media(max-width: 768px) {
            margin-top: 10px;
            min-height: auto;
        }
    }
}
::v-deep .wizard__item {
    height: 100%;
}
::v-deep .modal {
    width: calc(100% - 60px);
    max-width: 1140px;
    height: calc(100% - 60px);
    max-height: 700px;
    padding: 0;
    @media(max-width: 768px) {
        width: calc(100% - 20px);
        height: calc(100% - 20px);
        max-height: none;
    }
}
::v-deep .estimate {
    padding: 0;
    width: 100%;
}
::v-deep .estimate__item {
    height: 100%;
    padding: 15px 17px;
}
::v-deep  .help_topic_modal {
    height: 100%;
    top: 0;
    min-width: 100%;
}
</style>
