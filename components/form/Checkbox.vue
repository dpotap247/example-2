<template>
    <div class="form-group">
      <input 
        type="checkbox" 
        :disabled="disabled" 
        :id="data.key" 
        v-model="modelValue" 
        @change="$emit('update:modelValue', $event.target.checked)"
      >
      <label :for="data.key">{{ data.label }}</label>
    </div>
</template>


<script>
export default({
    props: ['modelValue', 'data', 'disabled'],
})
</script>


<style scoped lang="scss">

.form-group {
  display: flex;
  margin-bottom: 15px;
  width: 200px;
  // margin-left: -6px;
}

.form-group input {
  padding: 0;
  height: initial;
  width: initial;
  margin-bottom: 0;
  display: none;
  cursor: pointer;
}

.form-group label {
  position: relative;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  text-align: left;
}

.form-group label:before {
  content:'';
  -webkit-appearance: none;
  background-color: transparent;
  border: 2px solid var(--PrimaryButtonColour);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05), inset 0px -15px 10px -12px rgba(0, 0, 0, 0.05);
  width: 15px;
  min-width: 15px;
  height: 15px;
  display: inline-block;
  position: relative;
  vertical-align: middle;
  cursor: pointer;
  margin-right: 15px;
  margin-top: 2px;
}

.form-group input:checked + label:after {
  content: '';
  display: block;
  position: absolute;
  top: 5px;
  left: 7px;
  width: 3px;
  height: 9px;
  border: solid var(--PrimaryButtonColour);
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
</style>