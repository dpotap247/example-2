<template>
    <InputGroup :data="{label: 'Address', placeholder: 'Start writing'}">
        <GMapAutocomplete 
            class="autocomplete" 
            :value="modelValue" 
            :options="{ componentRestrictions: { country: 'aus' }}" 
            placeholder="Start writing"
            @place_changed="setPlace"/>
    </InputGroup> 
</template>

<script>
import InputGroup from './InputGroup'

export default ({
    props: ['modelValue', 'states'],
    components: {
        InputGroup
    },
    setup(props, {emit}) {
        function setPlace(place) {
            const data = {
                address: '',
                suburb: '',
                postcode: '',
                state: '',
                state_id: '',
            }
            const address_components = place.address_components
            
            const suburb = address_components.find(el => el.types.join(', ').includes('locality, political'))
            const postal_code = address_components.find(el => el.types.join(', ').includes('postal_code'))
            const state = address_components.find(el => el.types.join(', ').includes('administrative_area_level_1, political'))
            if(suburb) data.suburb = suburb.long_name
            if(postal_code) data.postcode = postal_code.long_name
            if(state) data.state = state.long_name 
            

            const subpremise = address_components.find(el => el.types.join(', ').includes('subpremise'))
            const street_number = address_components.find(el => el.types.join(', ').includes('street_number'))
            const route = address_components.find(el => el.types.join(', ').includes('route'))

            if(subpremise) data.address += `${subpremise.long_name}/`
            if(street_number) data.address += `${street_number.long_name}, `
            if(route) data.address += route.long_name 
            if(!data.address) data.address = place.formatted_address

            emit('updAddress', data)
        }

        return {
            setPlace
        }
    },
})
</script>


<style scoped lang="scss">
.autocomplete {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 0 13px 0 15px;
    font-weight: bold;
    font-size: 17px;
    line-height: 140%;
    border: 1px solid rgba(11, 53, 83, 0.2);
    border-radius: 2px;
        &::placeholder {
            font-style: italic;
            font-weight: normal;
        }
}
</style>

<style lang="scss">
.pac-container {
    z-index: 100000;
}
</style>
