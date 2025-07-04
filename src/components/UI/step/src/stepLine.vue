<template>
  <div class="stepLine" :class="direction">
    <div
      v-for="(step,index) in steps"
      :key="step.name"
      :class="{active:active>=index}"
      class="item"
    >
      <p
        class="line"
        :class="{active:active>index}"
      ></p>
      <span class="point">
        <b></b>
        <i></i>
      </span>
      <p class="name">
        <i class="fcc" :class="step.icon"></i>
        {{ step.name }}
      </p>
      <slot name="content" :data="step" :index="index"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'StepLine',
  props: {
    active: Number,
    steps: Array,
    direction: {
      type: String,
      default: 'row'
    }
  },
  setup () {
    return {}
  }
})
</script>

<style lang="scss" scoped>
.stepLine {
  height: 100%;

  &.row {
    display: flex;
    justify-content: space-between;
    height: 100%;

    .item {
      flex: 1;
      height: 100%;
      text-align: center;
      margin-top: 25px;
      position: relative;

      &.active {
        color: $primary-color-weight;
        font-weight: bold;

        .point {
          border: 1px dashed rgba($primary-color-weight, 0.42);

          b {
            background-color: rgba($primary-color-weight, 0.42);
          }

          i {
            background-color: $primary-color-weight;
          }
        }
      }

      &:last-child {
        .line {
          position: relative;
          z-index: -1;
          opacity: 0;
        }
      }

      .name {
        margin-top: 25px;
      }

      .line {
        height: 6px;
        background-color: #C9C9C9;
        position: relative;
        left: 50%;
        transform: translateY(50%);

        &.active {
          background-color: rgba($primary-color-weight, 0.42);
        }
      }

      .point {
        position: absolute;
        left: 50%;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        width: 32px;
        height: 32px;
        border: 1px dashed rgba(201, 201, 201, 0.42);

        b {
          position: absolute;
          width: 25px;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          height: 25px;
          background-color: rgba(153, 153, 153, 0.43);
        }

        i {
          position: absolute;
          width: 15px;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          height: 15px;
          background-color: #999999;
        }
      }
    }
  }

  &.col {
    display: flex;
    justify-content: space-between;
    width: 100%;
    flex-direction: column;
    height: 100%;

    .item {
      flex: 1;
      width: 100%;
      text-align: center;
      position: relative;
      display: flex;
      justify-content: flex-start;
      align-content: center;

      &.active {
        color: $primary-color-weight;
        font-weight: bold;

        .point {
          border: 1px dashed rgba($primary-color-weight, 0.42);

          b {
            background-color: rgba($primary-color-weight, 0.42);
          }

          i {
            background-color: $primary-color-weight;
          }
        }
      }

      &:last-child {
        .line {
          position: relative;
          z-index: -1;
          opacity: 0;
        }
      }

      .name {
        margin-right: 64px;
        width: 100%;
        margin-top: 6px;
        text-align: right;
      }

      .line {
        width: 6px;
        height: 100%;
        background-color: #C9C9C9;
        position: absolute;
        right: 32px;
        transform: translateX(50%);
        top: 16px;

        &.active {
          background-color: rgba($primary-color-weight, 0.42);
        }
      }

      .point {
        position: absolute;
        top: 16px;
        right: 0;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        width: 32px;
        height: 32px;
        border: 1px dashed rgba(201, 201, 201, 0.42);

        b {
          position: absolute;
          width: 25px;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          height: 25px;
          background-color: rgba(153, 153, 153, 0.43);
        }

        i {
          position: absolute;
          width: 15px;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          height: 15px;
          background-color: #999999;
        }
      }
    }
  }
}
</style>
