<template>
  <TheLoading />
  <div class="home-page"></div>
</template>

<script>
import TheLoading from "@/components/global/loading/TheLoading.vue";
import { mapActions } from "vuex";

export default {
  name: "HomePage",
  methods: {
    ...mapActions(["doCheckAuth"]),
  },
  async mounted() {
    const checkAuth = await this.doCheckAuth(this.$store.state.apiLink);
    if (!checkAuth) {
      this.$router.push("/signin");
    } else {
      if (checkAuth.userRole == "INSTRUCTOR") {
        this.$router.push("/instructor-home");
      }
      if (checkAuth.userRole == "STUDENT") {
        this.$router.push("/student-home");
      }
    }
  },
  components: { TheLoading },
};
</script>
