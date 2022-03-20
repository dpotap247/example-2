<template>
      <svg-icon-qouting data="fad fa-spinner"  class="spinner"  :class="customClass"/>
</template>

<script>
export default({
  props: {
    customClass: {
      default: '',
    }
  },
})
</script>


<style scoped lang="scss">
.spinner ::v-deep svg
{
  animation: rotation 1.5s linear infinite;
  color: var(--PrimaryColour);
  font-size: 15px;
}
.big.spinner ::v-deep svg {
  font-size: 50px;
}

@keyframes rotation
{
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  100% {
    -webkit-transform: rotate(360px);
    transform: rotate(360deg);
  }
}

</style>