<template>
    <div class="summary">
        <div class="summary__title">Order Summary</div>
        <div class="summary__content">
            <div class="summary__left">
                <Receipt :summary="summary" v-if="summary"/>
            </div>
            <div class="summary__actions" v-if="actions">
                <Buttons class="actions__main" :data="actions.mainBtn"  v-if="actions.mainBtn && !stateEstimate && quantityItems > 0" @clickMainBtn="$emit('requestEstimate')"/>
                <Buttons class="actions__primary" :data="actions.cloneBtn" v-if="actions.cloneBtn"/>
                <Buttons class="actions__delete" :data="actions.deleteBtn" v-if="actions.deleteBtn" />
                <!-- <Button class="btn__main" :data="{title: 'Send Estimate', type: 'primary'}"/> -->
                <!-- <div class="summary__btns">
                    <template v-for="item in buttons" :key="item">
                        <Button  
                            class="btn__secondary" 
                            :data="{title: item, type: 'primary'}" 
                            v-if="item !== 'delete' " 
                        />
                    </template>
                </div> -->
                <!-- <Buttons :data="actions" /> -->

            </div>
        </div>
       
    </div>
</template>

<script>
import Receipt from './summary/Receipt'
import Buttons from '../elements/Buttons.vue'
import { ref } from 'vue'

export default ({
    props: ['summary', 'buttons', 'data', 'quantityItems', 'stateEstimate'],
    components: {
        Buttons,
        Receipt
    },
    setup(props) {
        const actions = ref(null)
        getButtons()

        function getButtons() {
            const mainBtn = props.buttons.find(el => el.type == 'main')
            const cloneBtn = props.buttons.find(el => el.name.toLowerCase().includes('clone'))
            const deleteBtn = props.buttons.find(el => el.name.toLowerCase().includes('delete'))
            const object = {}
            if(mainBtn) object.mainBtn = { ...mainBtn, event: 'clickMainBtn' }
            if(cloneBtn) object.cloneBtn = { ...cloneBtn, event: 'clickCloneBtn' }
            if(deleteBtn) object.deleteBtn = { ...deleteBtn, event: 'clickDeleteBtn', type: 'outline-primary' }
            // icon: 'fas fa-trash-alt', iconColor: 'rgba(11, 53, 83, 0.8)', 
            actions.value = object
        }
        return {
            actions
        }
    },
})
</script>


<style scope lang="scss">
.summary {
    position: relative;
    &__content {
        display: flex;
        justify-content: space-between;
        position: relative;
    }
    &__left {
        width: 350px;
        max-width: 100%;
    }
    &__title {
        font-weight: bold;
        font-size: 21px;
        line-height: 140%;
        text-align: left;
        margin-bottom: 30px;
        position: relative;
        font-family: Sansation;
    }
    &__btns {
        display: flex;
    }
    &__actions {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        & > div {
            margin-bottom: 20px;
        }
    }
    .btn {
        &__main {
            width: 251px;
            height: 60px;
            margin-bottom: 40px;
        }
        &__secondary {
            width: 160px;
            height: 30px;
            margin-right: 30px;
            &:last-of-type {
                margin-right: 0;
            }
        }
    }
}

@media(max-width: 768px) {
    .summary {
        &__content {
            flex-direction: column;
        }
        &__actions {
            margin-top: 20px;
            flex-direction: column;
            align-items: flex-start;
        }
    }
}
</style>