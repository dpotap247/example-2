<template>
    <div class="states-form">
        <InputGroup 
            v-model="modelValue" :data="{label: 'States', placeholder: 'Start writing'}" 
            @input="updValue($event.target.value)"
            @focus="openDropdown(true)"
        >
        </InputGroup>
        <div class="states-form__dropdown" v-if="showDropdown">
            <div 
                class="dropdown__item" 
                v-for="item in searchResult.slice(0, 5)" :key="item.id"
                :class="{'no-active': item.noActive}" 
                @click="!item.noActive && updValue(item.name), showDropdown = false"
                >
                <i class="fa-solid fa-location-dot" v-if="!item.noActive"></i> {{ item.name }}
            </div>
        </div>
    </div>
</template>

<script>
import InputGroup from './InputGroup.vue'
import { ref, computed } from 'vue'
import axios from 'axios'

export default ({
    props: ['modelValue'],
    components: {
        InputGroup
    },
    setup(props, { emit }) {
        const states = ref([])
        const showDropdown = ref(false)
        getStates()
        async function getStates() {
            const result = await axios.get(process.env.VUE_APP_API_STATES_URL)
            states.value = result.data
            emit('updStates', result.data)
        }
        const searchResult = computed(() => {
            const searchQuery = props.modelValue 
            if(!searchQuery || searchQuery && !searchQuery.length) return states.value
            const result = states.value.filter(el => el.name && el.name.split(' ').join('').toLowerCase().includes(searchQuery.split(' ').join('').toLowerCase()))
            return result.length && result || [{ id: 100, name: 'Nothing Found', noActive: true }]
        })

        function updValue(value) {
            emit('update:modelValue', value)
        }

        function openDropdown(value) {
            if(value) showDropdown.value = true
            else {
                setTimeout(() => {
                    if(showDropdown.value) showDropdown.value = false
                }, 1000)
            }
        }

        return {
            searchResult,
            updValue,
            showDropdown,
            openDropdown
        }
    },
})
</script>

<style scoped lang="scss">
.states-form {
    position: relative;
    &__dropdown {
        background: #fff;
        border: 1px solid rgba(11, 53, 83, 0.2);
        border-top: none;
        width: 100%;
        position: absolute;
        z-index: 1000;
        left: 0;
        bottom: 0;
        transform: translateY(100%);
    }
}
.dropdown__item {
    text-align: left;
    padding: 5px 10px;
    border-bottom: 1px solid rgba(11, 53, 83, 0.2);
    font-size: 14px;
    &:last-of-type {
        border-bottom: none;
    }
    svg {
        margin-right: 3px;
        display: inline-block;
    }
    &:hover {
        background: #eaeaea;
        cursor: pointer;
    }
    &.no-active {
        &:hover {
            background: transparent;
            cursor: auto;
        }
    }
}
</style>

