<template>
    <RequestTemplate 
        title="Please confirm your email" 
        desc="In order to requeste an estimate please complete your email verification process. Please check Spam (or Junk) folder in your inbox. If you don’t receive confirmation email please check it is correct in My Account section.">
        <Button class="resend__btn" :data="btnResend" @click="resend"/>
    </RequestTemplate>
</template>

<script>
import Button from '../../form/Button.vue'
import RequestTemplate from './RequestTemplate'
import api from '../../../services/request.service'
import { notify } from "@kyvg/vue3-notification"

import { reactive } from 'vue'
export default ({
    components: {
        Button,
        RequestTemplate
    },
    setup(props, { emit }) {
        const btnResend = reactive({ title: 'Re-SEND Confirmation', type: 'primary', loading: false })

        async function resend() {
            const result = await api.resendVerifyEmail()
            btnResend.loading = false
            if(result.success) {
                notify({
                    type: 'success',
                    title: 'check your mail'
                })
                emit('close')
            }
        }

        return {
            btnResend,
            resend
        }
    },
})
</script>


<style scoped lang="scss">
.template {
    display: flex;
    flex-direction: column;
    align-items: center;
    &__btn {
        margin-top: 20px;
    }
    &__title {
        font-weight: bold;
        font-size: 25px;
        line-height: 100%;
    }
    &__icon {
        // color: yellow;
        // display: block;
    }
    &__desc {
        font-size: 15px;
        line-height: 140%;
    }
}
</style>