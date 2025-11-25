<template>
  <v-app>
    <CoachNavbar @menu-click="handleMenuClick" />
    <v-main>
      <v-container fluid>
        <CoachTopBar
          @search="handleSearch"
          @notification-click="handleNotification"
          @theme-toggle="toggleTheme"
        />

        <div v-if="activeMenu === 'Dashboard'">
          <v-row class="mb-6">
            <v-col cols="12" sm="6" md="3">
              <v-card class="pa-4" elevation="2" style="cursor: pointer">
                <div class="d-flex align-center justify-space-between">
                  <div>
                    <h3 class="text-h5 font-weight-bold text-primary">
                      {{ dashboardStats.totalUsers }}
                    </h3>
                    <p class="text-caption text-medium-emphasis mb-1">
                      Total Users
                    </p>
                    <p class="text-caption text-green">
                      + {{ dashboardStats.userGrowth }} from last month
                    </p>
                  </div>
                  <v-avatar color="primary" size="48" class="elevation-1">
                    <v-icon color="white" size="24">mdi-account-group</v-icon>
                  </v-avatar>
                </div>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-card class="pa-4" elevation="2" style="cursor: pointer">
                <div class="d-flex align-center justify-space-between">
                  <div>
                    <h3 class="text-h5 font-weight-bold text-green">
                      ${{ dashboardStats.totalRevenue.toLocaleString() }}
                    </h3>
                    <p class="text-caption text-medium-emphasis mb-1">
                      Total Revenue
                    </p>
                    <p class="text-caption text-green">
                      + {{ dashboardStats.revenueGrowth }} from last month
                    </p>
                  </div>
                  <v-avatar color="green" size="48" class="elevation-1">
                    <v-icon color="white" size="24">mdi-currency-usd</v-icon>
                  </v-avatar>
                </div>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-card class="pa-4" elevation="2" style="cursor: pointer">
                <div class="d-flex align-center justify-space-between">
                  <div>
                    <h3 class="text-h5 font-weight-bold text-orange">
                      {{ dashboardStats.activeSessions }}
                    </h3>
                    <p class="text-caption text-medium-emphasis mb-1">
                      Active Sessions
                    </p>
                    <p class="text-caption text-orange">
                      + {{ dashboardStats.sessionGrowth }} from last month
                    </p>
                  </div>
                  <v-avatar color="orange" size="48" class="elevation-1">
                    <v-icon color="white" size="24">mdi-chart-line</v-icon>
                  </v-avatar>
                </div>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-card class="pa-4" elevation="2" style="cursor: pointer">
                <div class="d-flex align-center justify-space-between">
                  <div>
                    <h3 class="text-h5 font-weight-bold text-blue">
                      {{ dashboardStats.successRate }}
                    </h3>
                    <p class="text-caption text-medium-emphasis mb-1">
                      Success Rate
                    </p>
                    <p class="text-caption text-blue">
                      + {{ dashboardStats.successGrowth }} from last month
                    </p>
                  </div>
                  <v-avatar color="blue" size="48" class="elevation-1">
                    <v-icon color="white" size="24">mdi-check-circle</v-icon>
                  </v-avatar>
                </div>
              </v-card>
            </v-col>
          </v-row>

          <v-row class="mb-6">
            <v-col cols="12" md="6">
              <v-card class="pa-4" elevation="2">
                <div class="d-flex justify-space-between align-center mb-4">
                  <h3 class="text-h6 font-weight-bold">
                    Student Status Distribution
                  </h3>
                  <v-chip variant="outlined" color="primary">
                    Total: {{ studentStats.total }}
                  </v-chip>
                </div>
                <apexchart
                  type="donut"
                  height="350"
                  :options="studentStatusOptions"
                  :series="studentStatusSeries"
                ></apexchart>
              </v-card>
            </v-col>
            <v-col cols="12" md="6">
              <v-card class="pa-4" elevation="2">
                <div class="d-flex justify-space-between align-center mb-4">
                  <h3 class="text-h6 font-weight-bold">
                    Student Performance Metrics
                  </h3>
                  <v-chip variant="outlined" color="green">
                    Multi-axis Chart
                  </v-chip>
                </div>
                <apexchart
                  type="line"
                  height="338.5"
                  :options="locationChartOptions"
                  :series="locationSeries"
                ></apexchart>
              </v-card>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6">
              <v-card class="pa-4" elevation="2">
                <div class="d-flex justify-space-between align-center mb-4">
                  <h3 class="text-h6 font-weight-bold">
                    Student Activity Trend
                  </h3>
                  <v-chip variant="outlined" color="orange">
                    {{ currentYear }}
                  </v-chip>
                </div>
                <apexchart
                  type="area"
                  height="350"
                  :options="activityChartOptions"
                  :series="activitySeries"
                ></apexchart>
              </v-card>
            </v-col>
            <v-col cols="12" md="6">
              <v-card class="pa-4" elevation="2">
                <div class="d-flex justify-space-between align-center mb-4">
                  <h3 class="text-h6 font-weight-bold">Student Performance</h3>
                  <v-chip variant="outlined" color="blue"> Overall </v-chip>
                </div>
                <apexchart
                  type="radialBar"
                  height="362"
                  :options="performanceChartOptions"
                  :series="performanceSeries"
                ></apexchart>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <div v-if="activeMenu === 'Students'">
          <StudentsManagement />
        </div>

        <div v-if="activeMenu === 'History'">
          <v-row>
            <v-col cols="12">
              <v-card class="pa-4">
                <h2 class="text-h4 mb-4">History</h2>
                <p>History content will be displayed here...</p>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <div v-if="activeMenu === 'Messages'">
          <v-row>
            <v-col cols="12">
              <v-card class="pa-4">
                <h2 class="text-h4 mb-4">Messages</h2>
                <p>Messages content will be displayed here...</p>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import CoachNavbar from "../../components/CoachComponents/CoachNavBar.vue";
import CoachTopBar from "../../components/CoachComponents/CoachTopBar.vue";
import StudentsManagement from "../../components/CoachComponents/StudentsManagement.vue";
import VueApexCharts from "vue3-apexcharts";

export default {
  name: "CoachDashboard",
  components: {
    CoachNavbar,
    CoachTopBar,
    StudentsManagement,
    apexchart: VueApexCharts,
  },
  data() {
    return {
      activeMenu: "Dashboard",
      loading: true,
      students: [],
      cities: [],
      dashboardStats: {
        totalUsers: 10,
        userGrowth: "14%",
        totalRevenue: 10,
        revenueGrowth: "23%",
        activeSessions: 11,
        sessionGrowth: "5%",
        successRate: "70%",
        successGrowth: "8%",
      },
      studentStats: {
        total: 0,
        active: 0,
        inactive: 0,
        newStudents: 0,
        newThisMonth: 0,
      },
      currentYear: new Date().getFullYear(),

      studentStatusSeries: [0, 0, 0],
      studentStatusOptions: {
        chart: {
          type: "donut",
        },
        colors: ["#4CAF50", "#FF9800", "#2196F3"],
        labels: ["Active Students", "Inactive Students", "High Priority"],
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                total: {
                  show: true,
                  label: "Total Students",
                },
              },
            },
          },
        },
      },

      // Updated Location Distribution Chart to multi-axis line/column chart
      locationSeries: [
        {
          name: "Column A",
          type: "column",
          data: [21.1, 23, 33.1, 34, 44.1, 44.9, 56.5, 58.5],
        },
        {
          name: "Column B",
          type: "column",
          data: [10, 19, 27, 26, 34, 35, 40, 38],
        },
        {
          name: "Line C",
          type: "line",
          data: [1.4, 2, 2.5, 1.5, 2.5, 2.8, 3.8, 4.6],
        },
      ],
      locationChartOptions: {
        chart: {
          height: 350,
          type: "line",
          stacked: false,
        },
        dataLabels: {
          enabled: false,
        },
        colors: ["#99C2A2", "#C5EDAC", "#66C7F4"],
        stroke: {
          width: [4, 4, 4],
        },
        plotOptions: {
          bar: {
            columnWidth: "20%",
          },
        },
        xaxis: {
          categories: [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016],
        },
        yaxis: [
          {
            seriesName: "Column A",
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
            },
            title: {
              text: "Columns",
            },
          },
          {
            seriesName: "Column A",
            show: false,
          },
          {
            opposite: true,
            seriesName: "Line C",
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
            },
            title: {
              text: "Line",
            },
          },
        ],
        tooltip: {
          shared: false,
          intersect: true,
          x: {
            show: false,
          },
        },
        legend: {
          horizontalAlign: "left",
          offsetX: 40,
        },
      },

      // Activity Trend Chart
      activitySeries: [
        {
          name: "Active Students",
          data: [30, 40, 35, 50, 49, 60, 70, 91, 125, 110, 95, 80],
        },
      ],
      activityChartOptions: {
        chart: {
          type: "area",
          height: 350,
          zoom: {
            enabled: false,
          },
        },
        colors: ["#4CAF50"],
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
          width: 3,
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.3,
            stops: [0, 90, 100],
          },
        },
        xaxis: {
          categories: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
        },
        yaxis: {
          title: {
            text: "Active Students",
          },
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val + " students";
            },
          },
        },
      },

      // Performance Chart
      performanceSeries: [0],
      performanceChartOptions: {
        chart: {
          type: "radialBar",
        },
        colors: ["#4CAF50"],
        plotOptions: {
          radialBar: {
            startAngle: -135,
            endAngle: 225,
            hollow: {
              margin: 0,
              size: "70%",
              background: "#fff",
              position: "front",
            },
            track: {
              background: "#f2f2f2",
              strokeWidth: "67%",
              margin: 0,
            },
            dataLabels: {
              show: true,
              name: {
                offsetY: -10,
                show: true,
                color: "#888",
                fontSize: "17px",
              },
              value: {
                formatter: function (val) {
                  return parseInt(val) + "%";
                },
                color: "#111",
                fontSize: "36px",
                show: true,
              },
            },
          },
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "dark",
            type: "horizontal",
            shadeIntensity: 0.5,
            gradientToColors: ["#45a049"],
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100],
          },
        },
        stroke: {
          lineCap: "round",
        },
        labels: ["Engagement Rate"],
      },
    };
  },

  async mounted() {
    await this.fetchStudentsFromAPI();
    this.updateCharts();
  },

  methods: {
    async fetchStudentsFromAPI() {
      try {
        this.loading = true;
        console.log(
          " FETCHING: Getting data from JSONPlaceholder Users API..."
        );

        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        console.log(
          "✅ SUCCESS: Users API data received",
          data.length,
          "users"
        );

        this.students = data.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          website: user.website,
          address: {
            street: user.address.street,
            city: user.address.city,
            zipcode: user.address.zipcode,
          },
          company: {
            name: user.company.name,
          },
          status: Math.random() > 0.3 ? "active" : "inactive", // Random status for demo
          isHighPriority: user.id <= 3,
        }));

        this.cities = this.students.map((student) => student.address.city);

        this.updateStatistics();
        this.loading = false;
      } catch (error) {
        console.error("❌ ERROR: Failed to fetch data from API", error);
        this.loading = false;
        this.students = this.getFallbackData();
        this.updateStatistics();
      }
    },

    updateStatistics() {
      const total = this.students.length;
      const active = this.students.filter((s) => s.status === "active").length;
      const inactive = this.students.filter(
        (s) => s.status === "inactive"
      ).length;
      const highPriority = this.students.filter((s) => s.isHighPriority).length;

      this.studentStats = {
        total: total,
        active: active,
        inactive: inactive,
        newStudents: highPriority,
        newThisMonth: Math.floor(total * 0.2),
      };
    },

    updateCharts() {
      // Update Student Status Chart
      this.studentStatusSeries = [
        this.studentStats.active,
        this.studentStats.inactive,
        this.studentStats.newStudents,
      ];

      // Update Performance Chart (engagement rate based on active students)
      const engagementRate =
        this.studentStats.total > 0
          ? Math.round(
              (this.studentStats.active / this.studentStats.total) * 100
            )
          : 0;
      this.performanceSeries = [engagementRate];
    },

    getFallbackData() {
      return [
        {
          id: 1,
          name: "Leanne Graham",
          email: "Sincere@april.biz",
          phone: "1-770-736-8031 x56442",
          website: "hildegard.org",
          address: {
            street: "Kulas Light",
            city: "Gwenborough",
            zipcode: "92998-3874",
          },
          company: {
            name: "Romaguera-Crona",
          },
          status: "active",
          isHighPriority: true,
        },
        {
          id: 2,
          name: "Ervin Howell",
          email: "Shanna@melissa.tv",
          phone: "010-692-6593 x09125",
          website: "anastasia.net",
          address: {
            street: "Victor Plains",
            city: "Wisokyburgh",
            zipcode: "90566-7771",
          },
          company: {
            name: "Deckow-Crist",
          },
          status: "inactive",
          isHighPriority: true,
        },
      ];
    },

    handleMenuClick(menuItem) {
      this.activeMenu = menuItem.title;
      console.log("Menu clicked:", menuItem.title);
    },
    handleSearch(query) {
      console.log("Search query:", query);
    },
    handleNotification() {
      console.log("Notification handled");
    },
    toggleTheme() {
      console.log("Theme toggled");
    },
  },

  watch: {
    students: {
      handler() {
        this.updateCharts();
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.text-green {
  color: #4caf50;
}
.text-red {
  color: #f44336;
}
.text-primary {
  color: #1867c0;
}
.text-orange {
  color: #ff9800;
}
.text-blue {
  color: #2196f3;
}
</style>
