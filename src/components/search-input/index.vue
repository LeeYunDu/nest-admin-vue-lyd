<template>
  <div class="flex f-jcsb f-aic search-flex" style="margin-bottom: 20px;">
    <div class="search-box">
      <el-input
        v-bind="$attrs"
        clearable
      />
      <div class="sure-button" @click="onSearch">
        <img class="icon" src="@static/images/app/icon-search.png" alt="">
      </div>
    </div>
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
const emits  = defineEmits(['search'])
function onSearch (){
  emits('search')
}
</script>

<style lang="scss" scoped>
.search-box{
  display: flex;
  align-items: center;
  background: #FFFFFF;
  box-shadow: 0px 4px 12px 0px rgba(22,55,106,0.33);
  border-radius: 10px 10px 10px 10px;
  padding: 4px;
  height: 52px;
  padding:0 10px;
  width: 461px;
  .icon{
    width: 26px;
    height: 26px;
  }
  ::v-deep(.el-input){
    border-radius: 0;
    height: 100%!important;
    flex: 1;

    .el-input__wrapper{
       height: 100%;
      box-shadow: none;
      border-radius: 0px;
      .el-input__inner{
        height: 100%;
      }
    }
  }
  .sure-button{
    height: 42px;
    width: 75px;
    background: linear-gradient(180deg, #FFC42E 0%, #FF7A00 100%);
    border-radius: 10px 10px 10px 10px;
    opacity: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    cursor: pointer;
  }
}
</style>
