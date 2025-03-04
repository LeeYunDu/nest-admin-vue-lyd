<template>
  <div class="weather-container">
    <div class="weather-icon">
      <i class="iconfont-screen icon-screen-taiyang"></i>
    </div>
    <div class="time flex-col col-center">
      <div class="hour">{{ hour }}</div>
      <div class="day">{{ day }}</div>
    </div>
    <div class="temp flex-row col-center">
      <i class="iconfont-screen icon-screen-wendu"></i>
      <div class="temp-value">20</div>
      <div class="temp-unit">℃</div>
    </div>
    <div class="humidity flex-row col-center">
      <i class="iconfont-screen icon-screen-shidu"></i>
      <div class="humidity-value">60</div>
      <div class="humidity-unit">%</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import { onMounted, onUnmounted, ref } from 'vue';
let timer: any = null;
let hour = ref('');
let day = ref('');
function getTime() {
  timer = setInterval(() => {
    const now = dayjs();
    hour.value = now.format('HH:mm:ss');
    day.value = now.format('YYYY-MM-DD');
  }, 1000);
}

onMounted(() => {
  getTime();
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style lang="scss" scoped>
.weather-container {
  display: flex;
  align-items: center;
  margin-right: 28px;
  color: #fff;
  line-height: 1;
  font-family: 'Alibaba PuHuiTi';

  .weather-icon {
    .iconfont-screen {
      margin-right: 8px;
      font-size: 34px;
      color: #ffb82e;
    }
  }

  .time {
    margin-right: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .hour {
      font-size: 20px;
      text-shadow: 0 1px 1px rgba(0, 0, 0, 0.11);
    }

    .day {
      margin-top: 8px;
      font-size: 16px;
      color: #fffa;
      text-shadow: 0 1px 1px rgba(0, 0, 0, 0.11);
      word-break: keep-all;
    }
  }

  .temp {
    margin-right: 20px;
    font-size: 20px;
    display: flex;

    .iconfont-screen {
      margin-right: 2px;
      color: #fffa;
    }
  }

  .humidity {
    font-size: 20px;
    display: flex;

    .iconfont-screen {
      margin-right: 4px;
      color: #fffa;
    }
  }
}
</style>
