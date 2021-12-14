<template>
  <div class="adjacency_matrix-cont">
    <div class="adjacency_matrix">
      <div class="adjacency_matrix-menu">
        <div class="header header-matrix">Матрица смежности</div>
        <div class="menu-icon close-icon"></div>
      </div>
      <div class="matrix-cont">
        <div class="value-rows-matrix-cont">
          <div class="value-row-matrix">0</div>
          <div class="value-row-matrix">1</div>
          <div class="value-row-matrix">2</div>
        </div>
        <div class="body-matrix">
          <div class="matrix">
            <div class="matrix-column">
              <div class="value-matrix-column">0</div>
              <div class="auto-matrix-cell"></div>
              <div class="auto-matrix-cell"></div>
              <div class="auto-matrix-cell"></div>
            </div>
            <div class="matrix-column">
              <div class="value-matrix-column">1</div>
              <div class="auto-matrix-cell"></div>
              <div class="auto-matrix-cell"></div>
              <div class="auto-matrix-cell"></div>
            </div>
            <div class="matrix-column">
              <div class="value-matrix-column">2</div>
              <div class="auto-matrix-cell"></div>
              <div class="auto-matrix-cell"></div>
              <div class="auto-matrix-cell"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Matrix",
};
</script>
