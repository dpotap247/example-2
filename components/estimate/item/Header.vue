<template>
    <div class="header">
        <div class="header__sticky_block" v-if="headerClassName"></div>
        <div class="estimate__header" :class="headerClassName">
            <div class="header__wrapper container" v-if="data">   
                <router-link :to="headerData.backLink.url" class="link__back">
                    <svg-icon-qouting class="estimate__btn_back" data="fas fa-arrow-left" />
                    <span>{{ headerData.backLink.title }}</span>
                </router-link>
                <div class="header__content">
                    <div class="header__info">
                        <div class="header__title">
                            <span>{{ headerData.title }} {{ data.number }}</span>

                            <div class="header__date">
                                <svg-icon-qouting class="date__icon" data="fas fa-clock" />
                                {{ formatter.formatDate(data.date) }}
                            </div>
                        </div>
                        <div class="header__status"><span class="status__label">Status:</span> <span class="status__value"> {{ data.status }}</span></div>
                        <div class="header__status"><span class="status__label">Referens:</span> <span class="status__value"> {{ data.state }}</span></div>
                    </div>
                    <div class="header__actions">
                        <Buttons 
                            class="actions__submit" 
                            :data="actions" 
                            :key="`actions-${actions.length}`"
                            v-if="actions" 
                            @mainBtnClick="$emit('requestEstimate')"
                            @additionalClick="$emit('additionalClick')"
                        />
                        <Dropdown :title="headerData.totalBtn.title" :summary="summary" v-if="summary"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Dropdown from './header/Dropdown.vue'
import Buttons from '../elements/Buttons.vue'
import { useFormatter } from '../../../composables/formatter'
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

export default ({
    props: ['data', 'summary', 'className', 'headerData', 'buttons', 'quantityItems', 'stateEstimate'],
    components: {
        Dropdown,
        Buttons,
    },
    setup(props) {
        const formatter = useFormatter()

        const lastScrollPosition = ref(0)
        const headerClassName = ref('')
        
        
        onMounted(() => {
            window.addEventListener('scroll', logicStickyHeader)
            
        })
        
        onBeforeUnmount(() => {
            window.removeEventListener('scroll', logicStickyHeader)
        })

        function logicStickyHeader() {
            const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop
            if(currentScrollPosition > 230 && 
            currentScrollPosition < lastScrollPosition.value) headerClassName.value = 'sticky'                
            else headerClassName.value = ''

            lastScrollPosition.value = currentScrollPosition
        }

        const actions = computed(() => {
            const additional = props.buttons.find(el => el.type == 'additional')
            const mainBtn = props.buttons.find(el => el.type == 'main')

            if(props.stateEstimate || props.quantityItems < 1) return [
                { ...additional, event: 'additionalClick'},
            ]  
            return [
                { ...additional, event: 'additionalClick'},
                { ...mainBtn, event: 'mainBtnClick' },
            ]
        })

        console.log(actions.value, 'value')

        
        return {
            formatter,
            headerClassName,
            actions
        }
    },
})
</script>


<style scoped lang="scss">
.estimate {
    &__header {
        min-height: 244px;
        padding: 50px 0;
        background: linear-gradient(0deg, rgba(11, 53, 83, 0.07), rgba(11, 53, 83, 0.07)), #FFFFFF;
        @media(max-width: 768px) {
            padding: 10px 0;
        }
        &.sticky {
            position: fixed;
            top: 50px;
            width: 100%;
            z-index: 11;
            min-height: auto;   
            padding: 0;
            &.hidden {
                display: none;
            }
        }
    }
}
.sticky {
    .header {
        .btn_additional {
            display: none;
        }
        &.container {
         padding: 16px 12px;
        }
        &__status {
            display: none;
        }
        .actions__submit {
            margin-bottom: 0;
            width: auto;
            margin-right: 20px;
        }
        &__actions {
            flex-direction: row;
            align-items: center;
        }
        &__info {
            display: flex;
            align-items: flex-end;
        }
        .link__back {
            margin-bottom: 2px;
        }
    }
    .header__wrapper {
        ::v-deep .dropdown__btn, ::v-deep .btn {
            height: 40px;
        }
        ::v-deep .dropdown__items {
            top: 40px;
        }
        .actions__submit {
            margin-bottom: 0;
            margin-right: 20px;
        }
        &.container {
            padding: 12px 0;
            @media(max-width: 1200px) {
                padding: 12px;
            }
        }
    }
}
.header {
    width: 100%!important;
    position: relative!important;
    height: auto!important;
    &__sticky_block {
        min-height: 244px;
        width: 100%;
    }
    &__content {
        display: flex;
        justify-content: space-between;
    }
    &__info {
        text-align: left;
    }
    &__title {
        font-weight: bold;
        font-size: 31px;
        line-height: 100%;
        display: flex;
        align-items: flex-end;
        flex-wrap: wrap;
        font-family: Sansation;
        & > span {
            margin-right: 20px;
        }
    }
    &__date {
        font-size: 15px;
        line-height: 80%;
        color: rgba(28, 40, 51, 0.6);
        margin-bottom: 2px;
        @media(max-width: 768px) {
            margin-top: 10px;
        }
    }
    &__status {
        margin-top: 12px;
        display: flex;
        align-items: center;
        font-size: 15px;
        line-height: 100%;
        &:first-of-type {
            margin-top: 18px;
        }
    }
    &__actions {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }

}
.status {
    &__label {
        color: rgba(28, 40, 51, 0.6);
    }
    &__value {
        font-weight: bold;
        display: block;
        margin-left: 3px;
    }
}
.actions {
    justify-content: flex-start;
    &__submit {
        margin-bottom: 20px;
    }
}
.date__icon {
    margin-right: 5px;
}
 @media(max-width: 768px) {
    .sticky {
        display: none;
        .header {
            &__actions {
                flex-direction: column;
                align-items: flex-start;
                .dropdown {
                    margin-top: 20px;
                }
            }
        }
    }
    .header {
        &__content {
            flex-direction: column;
        }
        &__actions {
            margin-top: 20px;
            align-items: flex-start;
        }
    }
}


</style>
