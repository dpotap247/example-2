<template>
    <div class="request">
        <Modal class="request__modal" v-model="modal.show" @update:modelValue="$emit('close')">
            <Loader class="request__loader" v-if="loading" />
            <component 
                :id="id" 
                class="request__component" 
                :type="modal.type" 
                :data="data" 
                :is="modal.component"  
                v-if="modal.show" 
                @close="showModal(false, $event)"
                @showModal="showModal($event)"
            />
        </Modal>
    </div>
</template>

<script>
import Modal from '../../elements/Modal'
import ResendVerifyEmail from './ResendVerifyEmail.vue'
import ExistingItems from './ExistingItemsPopup.vue'
import NewAddress from './NewAddress'
import Loader from '../../elements/Loader.vue'
import { ref, reactive, onMounted } from 'vue'
import api from '../../../services/request.service'

export default ({
    props: ['id'],
    components: {
        Modal,
        Loader,
        ResendVerifyEmail,
        NewAddress,
        ExistingItems
    },
    setup(props, { emit }) {
        const loading = ref(true)
        const data = ref(null)
        const modal = reactive({
            show: false,
            component: '',
            type: ''
        })
        const showResendVerifyEmail = ref(false)
        let user

        try {
            user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))
        } catch(err) {
            console.log(err)
        }
        
        onMounted( async () => {
            showModal({ show: false, className: 'loader' })

            if(user && user.is_email_verified) request()
            else {
                user = await api.getCurrentUser()

                if(user) localStorage.setItem('user', JSON.stringify(user.data))
                if(user && user.data.is_email_verified) {
                    request()
                    return
                }
                   
                showModal({ component: 'ResendVerifyEmail',  className: 'resend-verify' })
                loading.value = false
            }     
        })

        function showModal(data, type) {
            if(!data) {
                modal.show = false
                if(type == 'updHeaderData') emit('loadHeaderData')
                else emit('close')
                return
            }
            if(!modal.show) modal.show = true
            modal.component = data.component
            modal.className = data.className
            modal.type = data.type
            // loading.value = false
        }
        
        async function request() {
            const result = await api.request(props.id)
            // == 'show_enter_new_address_popup'
            data.value = result
            switch(result.popup) {
                case 'show_enter_new_address_popup': {
                    showModal({ component: 'NewAddress', className: 'new-address' })
                    break
                }
                case 'show_existing_lead_popup': {
                    showModal({ component: 'ExistingItems', type: 'lead' })
                    break
                }   
                case 'show_existing_jobs_popup': {
                    showModal({ component: 'ExistingItems', type: 'job' })
                    break
                }               
            }        
            loading.value = false
        }

        return {
            loading,
            showResendVerifyEmail,
            modal,
            showModal,
            data
        }
    },
})
</script>


<style scoped lang="scss">
.request {
    &__component {
        padding: 20px;
        height: 100%;
    }
    &__loader {
        ::v-deep svg {
            font-size: 50px;
        }    
    }
}
.request__modal {
    
    ::v-deep .modal {
        width: 550px;
        max-width: calc(100% - 20px);
        height: fit-content;
        min-height: 220px;
    }
}
// .loader {
//     ::v-deep .modal {
//         width: 550px;
//         height: 250px;
//     }
// }
// .new-address {
//     ::v-deep .modal {
//         width: 550px;
//         height: fit-content;
//     }
// }
</style>