<template>
    <RequestTemplate
        :title="title"
        :desc="desc">

        <div class="existing-popup__items">
            <div class="existing-popup__item" :class="{ active: item.id == active }" v-for="item in data.data" :key="item.id" @click="active = item.id">
                <div class="item__content">
                    <span>{{ formatter.formatDate(item.created_at) }}</span>
                    <span>{{ formatter.formatMoney(item.amount) }}</span>
                </div>
                <div class="item__address">
                    {{ getAddress(item) }}
                </div>
            </div>
        </div>
        <div class="existing-popup__actions">
            <Button :data="item" v-for="(item, index) in btns" :disabled="index === 0 & !active" :key="item.event" @next="next" @cancel="cancel"/>
        </div>
    </RequestTemplate>
</template>

<script>
import Button from '../../form/Button.vue'
import RequestTemplate from './RequestTemplate'
import { ref } from 'vue'
import { useFormatter } from '../../../composables/formatter'
import api from '../../../services/request.service'
import { notify } from "@kyvg/vue3-notification"

export default ({
    props: ['data', 'type'],
    components: {
        Button,
        RequestTemplate,
    },
    setup(props, { emit }) {
        const formatter = useFormatter()
        const active = ref(null)

        const title = props.type == 'lead' ? 'We found existing requests' : 'We found existing jobs'
        const desc = props.type == 'lead' ?
        `Looks like you already have pending estimate request(s). If this request relates to the one of the existing ones, please select from the list, otherwise click ‘Create new request’`
        :
        `Looks like you already have active job(s) with [Dealer Name]. If this request relates to the one of the existing jobs, please select from the list, otherwise click ‘Create new job`
        const btns = ref([
            {
                title: 'Add to existing',
                event: 'next',
                type: 'primary',
                loading: false,
            },
            {
                title: props.type == 'lead' ? 'Create New Request' : 'Create New Job',
                event: 'cancel',
                type: 'primary',
                loading: false,
            }
        ])
        function getAddress(item) {
            const key = props.type == 'lead' ? 'temporary_address' : 'job_customer'
            return `${item[key].address || ''} ${item[key].suburb || ''} ${item[key].postcode || ''}`
        }

        async function next() {
            const url = props.data.popup_btn_actions.accept.action.split('/quoting-portal/')[1]
            const modal = props.data.popup_btn_actions.accept.popup
            const params =  {
                [`existing_${props.type}_id`]: active.value
            }
            const result = await api.addToExistingEstimate(url, params)
            if(result.success) {
                if(!modal) emit('close', 'updHeaderData')
                notify({
                    type: 'success',
                    title: 'Added to existing'
                })
            } else  btns.value[0].loading = false
        }

        async function cancel() {
            const url = props.data.popup_btn_actions.ignore.action.split('/quoting-portal/')[1]
            const modal = props.data.popup_btn_actions.ignore.popup === false ? false : { component: 'NewAddress' }

            if(url && url.includes('make-new-job-and-assign')) {
                const result = await api.createNewEstimate(url, { existing_lead_id: active.value })
                btns.value[1].loading = false

                if(!result.success) return
                notify({
                    type: 'success',
                    title: 'Created New Job'
                })
                if(!modal) emit('close', 'updHeaderData')
            } else emit('showModal', modal)
        }

        return {
            btns,
            formatter,
            getAddress,
            active,
            cancel,
            next,
            title,
            desc
        }
    },
})
</script>


<style scoped lang="scss">
.existing-popup {
    border: 1px solid #eaea;
    &__title {

    }
    &__items {
        width: 100%;
        max-height: 400px;
        overflow-y: auto;
    }
    &__item {
        border: 1px solid #eaeaea;
        width: 100%;
        padding: 10px;
        margin-bottom: 10px;
        cursor: pointer;
        &.active {
            background: #E5E5E5;
        }
    }
    &__actions {
        display: flex;
        align-items: center;
        margin-top: 10px;
        & > button {
            &:last-of-type {
                margin-left: 20px;
            }
        }
    }
}
.item {
    &__content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 15px;
    }
    &__address {
        font-size: 12px;
        text-align: left;
        margin-top: 10px;
    }
}
</style>
