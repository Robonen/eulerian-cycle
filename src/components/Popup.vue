<template>
  <div class="popup-cont">
    <div class="popup">
      <div class="popup-el popup-header">
        <div class="header">
          <slot name="title"></slot>
        </div>
        <div class="menu-icon close-icon" @click="closeBtn"></div>
      </div>
      <div class="popup-el popup-text">
        <slot name="content"></slot>
      </div>
      <!-- <div class="popup-el popup-text gray">by Robonen</div> -->
      <div class="popup-el popup-button-cont">
        <div v-if="leftBtnText" class="popup-button" @click="leftBtn">
          {{ leftBtnText }}
        </div>
        <div v-if="rightBtnText" class="main-popup-button" @click="rightBtn">
          {{ rightBtnText }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "View",
  props: {
    leftBtnText: {
      type: String,
    },
    rightBtnText: {
      type: String,
    },
  },
  setup(_, { emit }) {
    // Methods
    const closeBtn = () => {
      emit("close");
    };

    const leftBtn = () => {
      emit("left");
    };

    const rightBtn = () => {
      emit("right");
    };

    return {
      closeBtn,
      leftBtn,
      rightBtn,
    };
  },
};
</script>
