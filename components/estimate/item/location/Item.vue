<template>
    <div class="item" v-if="data">
        <div class="item__top" :class="[showToolip && name.length > maxToolipTextLength && 'toolip']">
            <!-- <div class="top__title toolip" v-if=>{{ name }}</div> -->
            <div class="top__title" 
                @mouseenter="showToolip = true" 
                @mouseleave="showToolip = false"
            >{{ name }}</div>
            <DotActions v-if="!noActions && !stateEstimate" @clone="$emit('clone')" @remove="$emit('remove')"/>
        </div>
        <div class="item__content"> 
            <div class="content__main">
                 <div class="content__img">
                    <svg-icon-qouting  :data="data.layout_image || data.icon"/>
                 </div>
                <div class="content__text">{{ data.item.product_style.name }} - {{ data.item.product_grade.name }}
                    <br>
                    {{ data.frame_colour && data.frame_colour.name }}
                    <template v-if="data.has_only_insert_colour == 0 && data.insert_colour.name !== data.frame_colour.name">
                        <br>
                        {{ data.insert_colour && data.insert_colour.name }}
                    </template>
                </div>
            </div>    
            <div class="content__desc">
                <Options :data="data" />
            </div>
            <Button class="content__btn" :data="{title: 'Edit', icon: 'fas fa-edit', type: 'primary'}" v-if="!stateEstimate" @click="$emit('showWizard')"/>
        </div>
    </div>
</template>

<script>
import Button from '../../../form/Button.vue'
import Options from './Options.vue'
import { ref, computed } from 'vue'
import DotActions from './DotActions.vue'

export default ({
    props: ['data', 'noActions', 'stateEstimate'],
    components: {
        Button,
        Options,
        DotActions
    },
    setup(props) {
        const showToolip = ref(false)
        const maxToolipTextLength = 30

        const actions = [
            {
                title: 'Clone',
                event: 'clone',
                icon: 'fas fa-clone',
            },
            {
                title: 'Delete',
                event: 'delete',
                icon: 'fas fa-trash-alt',
            }
        ]

        const name = computed(() => {
            const { width_top, height_left, item } = props.data
            return `${width_top} x ${height_left} ${item.product_type.name}`
        })

        const showDropdown = ref(false)
        
        return {
            actions,
            name,
            showDropdown,
            showToolip,
            maxToolipTextLength,
        }
    },
})
</script>


<style scoped lang="scss">
.item {
    border: 1px solid rgba(11, 53, 83, 0.3);
    flex-direction: column;
    box-sizing: border-box;
    border-radius: 2px;
    width: 255px;
    min-width: 255px;
    height: fit-content;
    // &.disabled {
    //     opacity: 0.7;
    // }
    &__top {
        background: rgba(11, 53, 83, 0.1);
        height: 31px;
        padding-left: 10px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;  
        position: relative;
        &.toolip {
            white-space: nowrap;
            width: auto;
        }
    }
    &__content {
        padding: 10px;
        width: 100%;
    }
}
.top {
    &__title {
        font-size: 13px;
        width: calc(100% - 40px);
        text-overflow: ellipsis;
        overflow: hidden;
        font-weight: bold;
        white-space: nowrap;
        text-align: left;
        cursor: pointer;
        font-family: Sansation;
        &.toolip {
            position: absolute;
            top: -20px;
            overflow: visible;
            text-overflow: none;
        }
    }
    &__actions {
        background: linear-gradient(0deg, rgba(11, 53, 83, 0.15), rgba(11, 53, 83, 0.15)), #FFFFFF;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        position: relative;
        &-container {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
}
.content {
    &__main {
        display: flex;
        min-height: 100px;
    }
    &__img {
        // width: 65px;
        // height: 80px;
        margin-right: 10px;
        font-size: 80px;
        ::v-deep .icons__wrapper {
            display: flex;
        }
    }
    &__text {
        font-size: 13px;
        line-height: 140%;
        color: rgba(28, 40, 51, 0.8);
        text-align: left;
    }
    &__desc {
        margin-top: 7px;
        margin-bottom: 10px;
    }
    &__btn {
        width: 100%;
    }
}
.actions {
    &__dropdown {
        position: absolute;
        right: 0;
        bottom: -100%;
        transform: translateY(55%);
        min-width: 142px;
        padding: 10px 0;
        background: linear-gradient(0deg, rgba(11, 53, 83, 0.05), rgba(11, 53, 83, 0.05)), #FFFFFF;
        border: 1px solid rgba(11, 53, 83, 0.2);
        box-shadow: 0px 3px 3px rgba(28, 40, 51, 0.1);
        z-index: 10;
    }
    &__item {
        margin-bottom: 10px;
        text-align: right;
        text-transform: uppercase;
        padding: 0 10px;
        font-weight: 600;
        cursor: pointer;
        &:last-of-type {
            margin-bottom: 0;
        }
        span {
            display: inline-block;
            margin-left: 5px;
        }
    }
    
}

::v-deep .svg-inline {
        width: 50px;
    &.width_2 {
        width: 100px;
    }
    &.width_0_5 {
        height: 100px;
    }
}
</style>