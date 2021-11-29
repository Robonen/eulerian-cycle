<template>
  <div class="matrix-cont">
    <div class="value-rows-matrix-cont">
      <div class="value-row-matrix" v-for="ni in size" :key="ni">
        {{ ni }}
      </div>
    </div>
    <div class="body-matrix">
      <div class="matrix">
        <div class="matrix-column" v-for="nj in size" :key="nj">
          <div class="value-matrix-column">{{ nj }}</div>
          <div
            class="matrix-cell"
            v-for="ni in size"
            :key="ni"
            :class="{
              'active-cell': isActive(ni - 1, nj - 1),
              'auto-matrix-cell': isAbove(ni - 1, nj - 1),
            }"
            @click="change(ni - 1, nj - 1)"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// active-cell - one with background
// matrix-cell - default
// auto-matrix-cell - without background
// active-auto-cell - one

const newArray = (size) =>
  Array(size)
    .fill(0)
    .map(() => Array(size).fill(0));

export default {
  name: "Matrix",
  props: {
    size: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      matrix: newArray(this.size),
    };
  },
  watch: {
    size(val) {
      this.matrix = newArray(val);
    },
  },
  methods: {
    isActive(i, j) {
      return this.matrix[i][j] === 1;
    },
    isAbove(i, j) {
      return i > j;
    },
    change(i, j) {
      const val = this.matrix[i][j] === 1 ? 0 : 1;

      this.matrix[i][j] = val;

      if (i != j) this.matrix[j][i] = val;

      this.checkEuler();
    },
    checkEuler() {
      const isValid = this.matrix.reduce(
        (res, current) => {
          const relations = current.reduce((sum, i) => sum + i);

          res.sum += relations;
          res.even &= !(relations % 2);

          return res;
        },
        { sum: 0, even: 1 }
      );

      const result = isValid.sum && isValid.even;

      this.$emit("valid", result);
    },
  },
};
</script>
