<template>
  <TheNave />
  <div class="see-results">
    <TheLoading />
    <div class="container">
      <p
        class="exam-title text-center"
        v-if="resultData != '' || resultData.length > 0"
      >
        {{ resultData[0].title }}
      </p>
      <table
        v-if="resultData != '' || resultData.length > 0"
        class="table-control mx-auto text-center"
      >
        <thead>
          <tr>
            <th>Student</th>
            <th>Student Result</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody v-for="(result, index) in resultData" :key="index">
          <tr>
            <td v-if="result.profileImg" class="student">
              <img :src="result.profileImg" alt="" /><span
                >{{ result.firstName }} {{ result.lastName }}</span
              >
            </td>
            <td v-else class="student">
              <img src="https://e.top4top.io/p_2363fihh21.jpg" alt="" /><span
                >{{ result.firstName }} {{ result.lastName }}</span
              >
            </td>
            <td v-if="!result.result" class="result">Missed Exam</td>
            <td v-else class="result">{{ result.result }}</td>
            <td v-if="result.result > 0" class="percentage">
              {{ (parseInt(result.result) * 100) / result.totalDegree }}%
            </td>
            <td v-else class="percentage">Missed Exam</td>
          </tr>
        </tbody>
      </table>
      <div v-else class="no-students">
        <p>You have not shared the exam with any student</p>
      </div>
      <button
        v-if="resultData != '' || resultData.length > 0"
        @click="exportTableToCsv"
      >
        Export
      </button>
    </div>
  </div>
</template>

<script>
import TheLoading from "@/components/global/loading/TheLoading.vue";
import TheNave from "@/components/global/thenav/TheNav.vue";
// import axios from "axios";
import { mapActions, mapState } from "vuex";

export default {
  name: "SeeResults",
  data() {
    return {
      resultData: "",
    };
  },
  components: {
    TheNave,
    TheLoading,
  },
  watch: {
    "showResult.examResult"(newVal) {
      if (newVal) {
        this.resultData = newVal;
        setTimeout(() => {
          document.querySelector(".see-results .loading").style.cssText = `
            opacity: 0;visibility: hidden;
          `;
        }, 500);
      }
    },
  },
  computed: {
    ...mapState(["showResult"]),
  },
  methods: {
    ...mapActions(["doGetExamResult", "doCheckAuth"]),
    downloadCsv(csv, filename) {
      var csvFile;
      var downloadLink;
      // CSV FILE
      csvFile = new Blob([csv], { type: "text/csv" });
      // Download link
      downloadLink = document.createElement("a");
      // File name
      downloadLink.download = filename;
      // We have to create a link to the file
      downloadLink.href = window.URL.createObjectURL(csvFile);
      // Make sure that the link is not displayed
      downloadLink.style.display = "none";
      // Add the link to your DOM
      document.body.appendChild(downloadLink);
      // Lanzamos
      downloadLink.click();
    },
    exportTableToCsv() {
      var csv = [];
      var rows = document.querySelectorAll("table tr");
      for (var i = 0; i < rows.length; i++) {
        var row = [],
          cols = rows[i].querySelectorAll("td, th");
        for (var j = 0; j < cols.length; j++) row.push(cols[j].innerText);
        csv.push(row.join(","));
      }
      // Download CSV
      const theTitle =
        "Result Of" +
        " " +
        document.querySelector(".see-results .exam-title").innerText +
        "_" +
        new Date();
      this.downloadCsv(csv.join("\n"), theTitle);
    },
  },
  async mounted() {
    const checkAuth = await this.doCheckAuth(this.$store.state.apiLink);
    if (!checkAuth) {
      this.$router.push("/signin");
    } else {
      if (checkAuth.userRole == "INSTRUCTOR") {
        const payload = {
          instId: this.$route.params.instId,
          examId: this.$route.params.examId,
        };
        await this.doGetExamResult(payload);
      } else {
        this.$router.push("/");
      }
    }
  },
};
</script>

<style lang="scss">
@import "../../../assets/sass/main";

.see-results {
  .container {
    box-shadow: 0px 0px 5px -2px black;
    background-color: white;
    border-radius: 10px;
    overflow: hidden;
    margin-top: 30px;
    width: 97%;
    margin-left: auto;
    margin-right: auto;
    padding: 0;
    min-height: 77vh;
  }
  @media (max-width: 576px) {
    .container {
      border-radius: 20px;
    }
  }
  .exam-title {
    margin-top: 0;
    margin-bottom: 0;
    font-size: 30px;
    font-weight: 900;
    background-color: $mainColor;
    color: $titleColor;
    padding: 10px 0;
    text-transform: capitalize;
  }
}
@media (max-width: 576px) {
  .see-results .exam-title {
    font-size: 20px;
  }
}
.see-results table {
  width: 100%;
  th {
    border: 1px solid #b7b7b766;
    padding: 7px 0;
    font-size: 20px;
  }
  @media (max-width: 576px) {
    th {
      font-size: 12px;
    }
  }
  td {
    border: 1px solid #b7b7b766;
    padding: 10px 0;
    font-size: 17px;
    font-weight: 500;
    text-transform: capitalize;
  }
  @media (max-width: 576px) {
    td {
      font-size: 12px;
    }
  }
  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 15px;
  }
}
.see-results .no-students {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  p {
    font-style: italic;
    color: #928c8c;
    font-size: 20px;
  }
}
.see-results button {
  background: $mainColor;
  color: $titleColor;
  padding: 9px 29px;
  border: 1px solid #283d3b;
  border-radius: 13px;
  position: absolute;
  left: 50%;
  bottom: 75px;
  transform: translateX(-50%);
  font-size: 25px;
  font-weight: 900;
}
@media (max-width: 576px) {
  .see-results button {
    font-size: 15px;
    bottom: 87px;
  }
}
</style>
