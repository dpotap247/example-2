<template>
    <div class="actions" >
        <template v-for="item in buttons"  :key="item.name" >
            <Button 
                class="actions__item"
                :class="[`btn_${item.className}`]" 
                :data="item"
                v-if="item.title"
                @click="$emit(`${item.event}`)"
            /> 
        </template>
    </div>
</template>

<script>
import Button from '../../form/Button.vue'
export default ({
    props: ['data'],
    components: {
        Button
    },
    setup(props) {
        const buttons = getData(props.data) 

        function getData(data) {
            const array = Array.isArray(data) && data || [data]

            return array.map((el) => {
                return {
                    title: el.name || el.title,
                    className: el.name && el.name.split(' ').join('-').toLowerCase(),
                    ...el
                }
            })
        }

        return {
            buttons,
        }
    },
})
</script>


<style scoped lang="scss">
.actions {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    &__item {
        margin-right: 15px;
        &:last-of-type {
            margin-right: 0;
        }
    }
}
::v-deep {
    .btn {
        &_main {
            width: 255px;
            height: 40px;
        }
        &_primary {
            min-width: 161px;
            height: 30px;
            text-transform:capitalize;
        }
        &_secondary {

        }
    }
}
.btn {
    white-space: nowrap;
    &_main {
        background: var(--PrimaryButtonColour);
        color: var(--PrimaryButtonTextColour);
    }
    &_add-new-item {
        background: var(--PrimaryButtonColour);
        color: var(--PrimaryButtonTextColour);
        
    }
    // &_add-new- {
    //     background: var(--SecondaryButtonColour);
    //     color: var(--SecondaryButtonTextColour);
        
    // }
    &_bulk-edit {
        background: #F1C40F;
        color: #000;
    }
    &_clone {
        background: var(--PrimaryButtonColour);
        color: var(--PrimaryButtonTextColour);
    }
    &_delete {
        background: none;
        border: 1px solid rgba(11, 53, 83, 0.8);
        
    }
    &_specification {
        background: none;
        text-decoration: underline;
    }
}
</style>