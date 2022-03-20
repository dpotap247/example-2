<template>
    <RequestTemplate 
        title="Where do you need the job done?" 
        desc="In order to provide you with correct estimate and make sure we service area, please provide your address."
    >
        <FormAddress 
            class="form-address" 
            :states="states" 
            :data="addressData"  
            @updAddress="updAddress($event)" 
            @updStates="states = $event" 
            @onClick="setNewAddress"
        />
    </RequestTemplate>
</template>

<script>
import FormAddress from '../../form/FormAddress.vue'
import api from '../../../services/request.service'
import RequestTemplate from './RequestTemplate.vue'
import { reactive, ref } from 'vue'

export default ({
    props: ['id'],
    components: {
        FormAddress,
        RequestTemplate
    },
    setup(props, { emit }) {
        const payload = ref({})
        const states = ref(null)

        const addressData = reactive({
            inputs: [
                { label: 'Address', component: 'address-autocomplete', placeholder: 'Enter street address', value: '', key: 'address', type: 'text', style: 'width: 100%;' },
                { label: 'State', component: 'address-state', placeholder: 'Enter state', value: '', value_id: '',  key: 'state', type: 'text', style: 'width: 100%;' },
                { label: 'Suburb', placeholder: 'Enter suburb', value: '',  key: 'suburb', type: 'text',style: 'width: calc(65% - 12px); margin-right: 12px;' },
                { label: 'Postcode', placeholder: 'Enter postcode', value: '',  key: 'postcode', type: 'text', style: 'width: 35%;' },
            ],
            btn: { type: 'primary', title: 'Continue', icon: 'fas fa-check', loading: false },
        }) 

        async function updAddress(address) {
            for(const key in address) {
                
                const value = address[key]
                const input = addressData.inputs.find(el => el.key == key)
                if(input && key !== 'state') input.value = value
                else if(input) {
                    const matchStateName = states.value.find(el => el.name == address[key])
                    if(matchStateName) {
                        input.value = matchStateName.name
                        input.value_id = matchStateName.state_id
                    }
                }
                if(value) payload.value[key] = value
            }
        }

        async function setNewAddress() {
            const form = JSON.parse(JSON.stringify(payload.value))
            //set value id
            const stateInput = addressData.inputs.find(el => el.key == 'state')
            if(form.state) form.state = stateInput.value_id
            const result = await api.sendNewAddress({ id: props.id, ...form })
            addressData.btn.loading = false
            if(result.success) emit('close', 'updHeaderData')
            
        }

        return {
            addressData,
            updAddress,
            setNewAddress,
            states
        }
    },


})
</script>

<style scoped lang="scss">
.form-address {
    margin-right: auto;
    width: 100%;
    ::v-deep .btn {
        width: 100%;
    }
}
</style>
