<template>
    <div class="location">
        <div class="location__top">
            <div class="location__drag">
                <div class="icon__drag">
                    <svg-icon-qouting class="ellipsis" data="fas fa-ellipsis-v" />
                    <svg-icon-qouting class="ellipsis" data="fas fa-ellipsis-v" />
                    <svg-icon-qouting class="ellipsis" data="fas fa-ellipsis-v" />
                </div>
                <div class="location__title">{{ data.name }}</div>
            </div>

            <div class="location__actions">
                <div class="location__count">
                    <svg-icon-qouting data="fas fa-layer-group"/>
                    <strong v-if="data.items">{{ data.items.length }}</strong> items
                </div>

                <div class="location__price">
                    <strong>{{ formatter.formatMoney(data.amount) }}</strong>
                </div>

                <div class="location__btn" @click="showWizard()" v-if="!stateEstimate">
                    <svg-icon-qouting data="fas fa-plus" style="font-size: 11px;"/> 
                    Add item to location
                </div>
            </div>
        </div>
        <div class="location__content" :style="{ 'min-height': stateEstimate && 'auto' }">
            <!-- <div class="location__items-wrapper"> -->
                <Loader v-if="!data.items || data.items && !data.items.length"/>
                <div class="location__section" v-for="(item, index) in data.items" :key="index" v-else>
                    <div class="section__info" v-if="item.section_items.length > 1">
                        <span>{{ item.section_info.layout.name }}</span>
                        <DotActions 
                            class="section__actions" 
                            ref="dotActions"
                            v-if="!stateEstimate"
                            @clone="cloneItem('layout', item.section_info.id)"
                            @remove="removeItem('layout', item.section_info.id)"
                        />
                    </div>
                    <div class="section__items" >
                        <Item class="section__item" 
                            :noActions="item.section_items.length > 1" 
                            :data="section" v-for="(section, index) in item.section_items" 
                            :key="section.id"  
                            :stateEstimate="stateEstimate"
                            @clone="cloneItem('position', section.id)"
                            @remove="removeItem('position', section.id)"
                            @showWizard="showWizard(section, index)"
                        />
                    </div>
                </div>
            <!-- </div> -->
        </div>
    </div>
</template>

<script>
import { useFormatter } from '../../../composables/formatter'
import Item from './location/Item.vue'
import Loader from '../../elements/Loader.vue'
import DotActions from './location/DotActions.vue'
import api from '../../../services/item.service'
import { ref } from 'vue'

export default ({
    props: ['data', 'stateEstimate'],
    components: {
        Item,
        Loader,
        DotActions
    },
    setup(props, { emit }) {
        const formatter = useFormatter()
        const dotActions = ref(null)

        function showWizard(item, index) {
            const emitData = {
                location: props.data.name
            }
            if(item) emitData.position_id = item.id
            if(index) emitData.index = index
            
            emit('showWizard', emitData)
        }

        async function removeItem(type, id) {
            const result = await api.removeItem(type, id)
            if(result == 'Deleted') emit('removedItem', props.data) 
            // emit('removedItem', props.data)   
            // dotActions.value.showDropdown = !dotActions.value.showDropdown
        }

        async function cloneItem(type, id, item) {
            emit('clone', { sectionType: type, sectionId: id })
        }

        return {
            formatter,
            showWizard,
            dotActions,
            removeItem,
            cloneItem,
        }
    },
})
</script>


<style scoped lang="scss">
.location {
    width: 100%;
    box-shadow: 1px 0px 5px rgba(28, 40, 51, 0.5);
    margin-bottom: 20px;
    &__top {
        cursor: pointer;
        padding: 8px 5px 8px 20px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: linear-gradient(0deg, rgba(11, 53, 83, 0.15), rgba(11, 53, 83, 0.15));
        border-radius: 2px 2px 0px 0px;
        @media(max-width: 768px) {
            overflow-x: auto;
        }
    }
    &__actions {
        display: flex;
        align-items: center;
    }
    &__drag {
        display: flex;
        align-items: center;
    }
    &__title {
        font-weight: bold;
        font-size: 21px;
        margin-left: 7px;
        text-transform: uppercase;
        font-family: Sansation;
        white-space: nowrap;
    }
    &__count {
        padding-right: 20px;
        border-right: 1px solid rgba(11, 53, 83, 0.2);
        white-space: nowrap;
        margin-left: 5px;
        strong {
            margin-left: 5px;
        }
    }
    &__content {
        padding: 20px;
        // min-height: 249px;
        overflow-y: hidden;
        overflow-x: auto;
        display: flex;
        border: 1px solid rgba(11, 53, 83, 0.2);
        min-height: 257px;
    }
    &__items-wrapper {
        border-top: none;
        overflow-y: hidden;
        overflow-x: auto;
        display: flex;
        height: 100%;
    }
    &__price {
        padding-left: 20px;
    }
    &__btn {
        font-size: 13px;
        line-height: 100%;
        letter-spacing: 0.02em;
        white-space: nowrap;
        padding: 5px 10px;
        background: #59B692;
        border-radius: 2px;
        color: white;
        margin-left: 20px;
    }
    &__section {
        display: flex;
        flex-direction: column;
    }
}

.section {
    &__info {
        width: calc(100% - 10px);
        height: 20px;
        background: var(--PrimaryColour);
        color: var(--PrimaryTextColour);
        padding-left: 10px;
        font-weight: bold;
        font-size: 13px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        border-radius: 2px 2px 0px 0px; 
        transform: translateY(2px);
        position: relative;
        z-index: 10;
    }
    &__items {
        display: flex;
        align-items: flex-end;
        height: 100%;
    }
    &__actions {
        position: absolute;
        right: 0;
        height: 100%;
        ::v-deep .actions__dropdown {
            transform: translateY(72%);
        }
    }
    &__item {
        margin-right: 10px;
    }
}

.icon__drag {
    width: 20px;
    font-size: 19px;
    display: flex;
    align-items: center;
    justify-content: center;
    ::v-deep .icons__wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    & > * {
        color: rgba(28, 40, 51, 0.6);
        margin-right: 1px;
    }
}
.btn__trash {
    width: 29px;
    height: 29px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(11, 53, 83, 0.4);
}
::v-deep .spinner {
    margin: auto;
    display: block;
    svg {
        font-size: 50px;
    }
}
</style>
