<template>
  <div class="not-found">
    <img src="@/assets/not-found.png" alt="" />
    <router-link to="/"> Back to Homepage? </router-link>
  </div>
</template>

<style scoped lang="scss">
.not-found {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  img {
    width: 100%;
    height: 100%;
  }
  a {
    z-index: 1;
    position: absolute;
    left: 50%;
    bottom: 50px;
    transform: translateX(-50%);
    background: white;
    padding: 15px 20px;
    border-radius: 10px;
    font-size: 20px;
    font-weight: 600;
  }
}
</style>
