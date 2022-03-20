<template> 
  <div class="icons__wrapper">
    <inline-svg class="svg-inline" :src="`/images/svg/layouts/${data}`" alt="" v-if="isSvg(data)"/>
    <i :class="data" :style="getColorStyle(data)" v-else-if="data && !dataIsArray"></i>
    
    <div class="icons" v-else-if="data && data.length">
      <div class="icons__container" v-for="(item, index) in data" :key="`${item}-${index}`"> 
        <template v-if="!isArray(item)">
          <i :class="item.icon" :style="getColorStyle(item)" v-if="!isSvg(item.icon)"></i>
          <inline-svg  :src="`/images/svg/layouts/${item.icon}`" alt="" />
        </template>

        <template v-for="el in item" :key="el" v-else>

          <inline-svg 
            class="svg-inline" 
            :class="`width_${getSizeClass(el.width)} height_${getSizeClass(el.height)}`"
            :src="`/images/svg/layouts/${el.image}`" alt=""  
            v-if="!isArray(el.image)"
          />
            <!--custom moment -->
          <inline-svg 
            class="svg-inline" 
            :class="`width_${getSizeClass(img.width)} height_${getSizeClass(img.height)}`"
            :src="`/images/svg/layouts/${img.image}`" 
            alt=""  
            v-else
            v-for="(img, index) in el.image"
            :key="'svg' + index"
          />
        </template>

      </div>
    </div>   

  </div>
</template>

<script >
import { computed } from "vue";

export default {
    props: ['data', 'color'],
    setup(props) {
      const dataIsArray = computed(() => Array.isArray(props.data)) 

      function isSvgArray(item) {
        const isArray = Array.isArray(item)
        if(isArray) {
          if(isSvg(item[0].image) || Array.isArray(item[0].image) && isSvg(item[0].image)) return true
        }
        return false
      }

      function isSvg(image) {
        if(!image) return
        return image.includes('.svg')
      }

      function getColorStyle(item) {
        let value = ''
        
        if(item.active || typeof item == 'object' || item.includes('fak')) value = 'var(--LayoutIconPrimary)'
        else if(props.color) value = props.color
        else value = ''

        return {color: value}
      }

      function getSizeClass(number) {
        return number && number.toString().split('.').join('_') || ''
      }

      function isArray(image) {
        return Array.isArray(image)
      }

      return {
        dataIsArray,
        getColorStyle,
        isSvg,
        isSvgArray,
        getSizeClass,
        isArray
      }
    }
}
</script>

<style scoped lang="scss">
.icons {
  flex-direction: column;
  &__wrapper {
    display: inline;
    color: currentColor;
  }
}
.icons {
  display: flex;
  align-items: center;
  justify-content: center;
  &__container {
    display: flex ;
  }
}
.svg-inline {
  max-height: none;
  height: auto;
  width: 90px;
  &.width_2 {
    width: 180px;
  }
  &.width_0_5 {
    width: auto;
    height: 180px;
  }
}
@media(max-width: 768px) {
  .svg-inline {
    width: 60px;
    &.width_2 {
      width: 120px;
    }
    &.width_0_5 {
      height: 120px;
    }
  }
}
</style>