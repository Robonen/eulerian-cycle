<template>
  <div class="wrapper">
    <div class="input-cont">
      <div class="text-input-cont">размер матрицы:</div>
      <div class="number">
        <button class="number-minus" type="button" @click="sub">-</button>
        <input type="number" v-model="size" />
        <button class="number-plus" type="button" @click="add">+</button>
      </div>
    </div>
    <matrix
      :size="size"
      @valid="isValid = $event"
      @save="matrix = $event"
    ></matrix>
    <router-link
      to="/view"
      class="creation-button"
      :class="{ 'disabled-button': !isValid }"
    >
      СОЗДАТЬ ГРАФ
    </router-link>
  </div>
</template>

<script>
import Matrix from "../components/Matrix.vue";

export default {
  name: "Home",
  components: {
    Matrix,
  },
  mounted() {
    document.addEventListener("keydown", (evt) => {
      if (evt.keyCode === 38) this.add();
      if (evt.keyCode === 40) this.sub();
    });
  },
  data() {
    return {
      size: 5,
      isValid: false,
    };
  },
  methods: {
    add() {
      if (this.size < 30) this.size++;
    },
    sub() {
      if (this.size > 1) this.size--;
    },
  },
  watch: {
    size(val) {
      this.size = Math.min(Math.max(1, val), 30);
    },
  },
};
</script>

<style>
@import "~@/assets/css/creation.css";
</style>
