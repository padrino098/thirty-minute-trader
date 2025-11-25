<template>
  <div>
    <v-row class="mb-4">
      <v-col cols="12">
        <div class="d-flex align-center">
          <v-icon size="32" color="primary" class="mr-3">
            mdi-account-group
          </v-icon>
          <div>
            <h1 class="text-h4 font-weight-bold">Students Metrics</h1>
            <p class="text-body-1 text-medium-emphasis">
              Manage and track your students' progress and status
            </p>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-row v-if="loading" class="mb-6">
      <v-col cols="12" class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        ></v-progress-circular>
        <p class="mt-4">Loading student data from API...</p>
      </v-col>
    </v-row>

    <v-row v-else-if="error" class="mb-6">
      <v-col cols="12">
        <v-alert type="error" variant="outlined">
          <strong>Failed to load data:</strong> {{ error }}
        </v-alert>
        <v-btn color="primary" @click="fetchStudentsFromAPI" class="mt-2">
          Try Again
        </v-btn>
      </v-col>
    </v-row>

    <div v-else>
      <v-row class="mb-6">
        <v-col cols="12" sm="6" md="3">
          <v-card
            class="pa-4"
            elevation="2"
            @click="filterStudents('all')"
            style="cursor: pointer"
          >
            <div class="d-flex align-center justify-space-between">
              <div>
                <h3 class="text-h5 font-weight-bold text-primary">
                  {{ studentStats.total }}
                </h3>
                <p class="text-caption text-medium-emphasis mb-1">
                  Total Students
                </p>
                <p class="text-caption text-green">
                  ↑ {{ studentStats.newThisMonth }} new students
                </p>
              </div>
              <v-avatar color="primary" size="56" class="elevation-1">
                <v-icon color="white" size="28">mdi-account-group</v-icon>
              </v-avatar>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card
            class="pa-4"
            elevation="2"
            @click="filterStudents('active')"
            style="cursor: pointer"
          >
            <div class="d-flex align-center justify-space-between">
              <div>
                <h3 class="text-h5 font-weight-bold text-green">
                  {{ studentStats.active }}
                </h3>
                <p class="text-caption text-medium-emphasis mb-1">
                  Active Students
                </p>
                <p class="text-caption text-green">
                  {{
                    Math.round(
                      (studentStats.active / studentStats.total) * 100
                    )
                  }}% of total
                </p>
              </div>
              <v-avatar color="green" size="56" class="elevation-1">
                <v-icon color="white" size="28">mdi-account-check</v-icon>
              </v-avatar>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card
            class="pa-4"
            elevation="2"
            @click="filterStudents('inactive')"
            style="cursor: pointer"
          >
            <div class="d-flex align-center justify-space-between">
              <div>
                <h3 class="text-h5 font-weight-bold text-orange">
                  {{ studentStats.inactive }}
                </h3>
                <p class="text-caption text-medium-emphasis mb-1">
                  Inactive Students
                </p>
                <p class="text-caption text-orange">
                  {{
                    Math.round(
                      (studentStats.inactive / studentStats.total) * 100
                    )
                  }}% of total
                </p>
              </div>
              <v-avatar color="orange" size="56" class="elevation-1">
                <v-icon color="white" size="28">mdi-account-clock</v-icon>
              </v-avatar>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card
            class="pa-4"
            elevation="2"
            @click="filterStudents('new')"
            style="cursor: pointer"
          >
            <div class="d-flex align-center justify-space-between">
              <div>
                <h3 class="text-h5 font-weight-bold text-blue">
                  {{ studentStats.newStudents }}
                </h3>
                <p class="text-caption text-medium-emphasis mb-1">
                  High Priority
                </p>
                <p class="text-caption text-blue">Premium Students</p>
              </div>
              <v-avatar color="blue" size="56" class="elevation-1">
                <v-icon color="white" size="28">mdi-account-plus</v-icon>
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
            <div class="chart-container">
              <div class="status-chart">
                <div
                  class="chart-row"
                  v-for="status in studentStatus"
                  :key="status.name"
                >
                  <div class="chart-label">
                    <v-icon :color="status.color" size="16" class="mr-2">
                      {{ status.icon }}
                    </v-icon>
                    <span>{{ status.name }}</span>
                  </div>
                  <div class="chart-bar-container">
                    <div
                      class="chart-bar"
                      :style="{
                        width: status.percentage + '%',
                        backgroundColor: status.color,
                      }"
                    ></div>
                    <span class="chart-value"
                      >{{ status.count }} ({{ status.percentage }}%)</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card class="pa-10" elevation="2">
            <div class="d-flex justify-space-between align-center mb-4">
              <h3 class="text-h6 font-weight-bold">
                Student Location Distribution
              </h3>
              <v-chip variant="outlined" color="green">
                {{ cities.length }} Cities
              </v-chip>
            </div>
            <div class="enrollment-chart">
              <div
                v-for="city in topCities"
                :key="city.name"
                class="enrollment-bar"
              >
                <div class="month-label">{{ city.name }}</div>
                <div class="bar-container">
                  <div
                    class="bar"
                    :style="{ height: city.percentage + '%' }"
                  ></div>
                </div>
                <div class="count-label">{{ city.count }}</div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <v-card elevation="2">
        <v-card-title class="d-flex justify-space-between align-center">
          <div>
            <span class="text-h6 font-weight-bold">Students List</span>
            <v-chip
              v-if="currentFilter !== 'all'"
              class="ml-2"
              :color="getFilterColor(currentFilter)"
              size="small"
            >
              {{
                currentFilter.charAt(0).toUpperCase() + currentFilter.slice(1)
              }}
            </v-chip>
          </div>
          <div class="d-flex align-center gap-2">
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              @click="showAddDialog = true"
            >
              Add Student
            </v-btn>
            <v-text-field
              v-model="search"
              append-inner-icon="mdi-magnify"
              label="Search students..."
              single-line
              hide-details
              density="compact"
              class="search-field"
            ></v-text-field>
          </div>
        </v-card-title>

        <v-data-table
          :headers="headers"
          :items="filteredStudents"
          :search="search"
          :items-per-page="10"
          class="elevation-1"
        >
          <template v-slot:item.status="{ item }">
            <v-chip
              :color="item.status === 'active' ? 'green' : 'orange'"
              size="small"
              :variant="item.status === 'active' ? 'flat' : 'outlined'"
            >
              {{ item.status === "active" ? "Active" : "Inactive" }}
            </v-chip>
          </template>

          <template v-slot:item.address="{ item }">
            <span>{{ item.address.city }}, {{ item.address.zipcode }}</span>
          </template>

          <template v-slot:item.company="{ item }">
            <span>{{ item.company.name }}</span>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-icon size="small" class="me-2" @click="editStudent(item)">
              mdi-pencil
            </v-icon>
            <v-icon size="small" @click="viewStudent(item)"> mdi-eye </v-icon>
            <v-icon
              size="small"
              class="ms-2"
              @click="toggleStatus(item)"
              :color="item.status === 'active' ? 'orange' : 'green'"
            >
              {{
                item.status === "active"
                  ? "mdi-account-off"
                  : "mdi-account-check"
              }}
            </v-icon>
            <!-- DELETE BUTTON -->
            <v-icon
              size="small"
              class="ms-2"
              @click="confirmDeleteStudent(item)"
              color="red"
            >
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
      </v-card>
    </div>

    <v-dialog v-model="showAddDialog" max-width="500px" persistent>
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span class="text-h5">Add New Student</span>
          <v-btn icon @click="closeAddDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-form ref="addForm" v-model="validForm">
            <v-text-field
              v-model="newStudent.name"
              label="Student Name"
              :rules="[(v) => !!v || 'Student name is required']"
              required
              class="mb-4"
            ></v-text-field>

            <v-text-field
              v-model="newStudent.email"
              label="Email"
              :rules="[
                (v) => !!v || 'Email is required',
                (v) => /.+@.+\..+/.test(v) || 'Email must be valid',
              ]"
              required
              class="mb-4"
            ></v-text-field>

            <v-text-field
              v-model="newStudent.phone"
              label="Phone"
              class="mb-4"
            ></v-text-field>

            <v-text-field
              v-model="newStudent.website"
              label="Website"
              class="mb-4"
            ></v-text-field>

            <v-text-field
              v-model="newStudent.city"
              label="City"
              class="mb-4"
            ></v-text-field>

            <v-checkbox
              v-model="newStudent.status"
              label="Mark as active"
              color="primary"
            ></v-checkbox>

            <v-checkbox
              v-model="newStudent.highPriority"
              label="High Priority Student"
              color="red"
            ></v-checkbox>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="closeAddDialog">
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            @click="addNewStudent"
            :loading="addingStudent"
            :disabled="!validForm"
          >
            Add Student
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showDeleteDialog" max-width="400px" persistent>
      <v-card>
        <v-card-title class="text-h6">
          <v-icon color="red" class="mr-2">mdi-alert</v-icon>
          Confirm Delete
        </v-card-title>

        <v-card-text>
          Are you sure you want to remove this student:
          <strong>"{{ studentToDelete?.name }}"</strong>? <br /><br />
          <span class="text-caption text-medium-emphasis">
            This action cannot be undone.
          </span>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey"
            variant="text"
            @click="showDeleteDialog = false"
            :disabled="deletingStudent"
          >
            Cancel
          </v-btn>
          <v-btn
            color="red"
            variant="flat"
            @click="deleteStudent"
            :loading="deletingStudent"
          >
            <v-icon left>mdi-delete</v-icon>
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="showSuccessMessage" color="success" timeout="3000">
      {{ successMessage }}
    </v-snackbar>

    <v-snackbar v-model="showErrorMessage" color="error" timeout="3000">
      {{ errorMessage }}
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: "StudentsManagement",
  data() {
    return {
      loading: true,
      error: null,
      search: "",
      currentFilter: "all",
      studentStats: {
        total: 0,
        active: 0,
        inactive: 0,
        newStudents: 0,
        newThisMonth: 0,
      },
      headers: [
        { title: "ID", key: "id", width: "80px" },
        { title: "Name", key: "name" },
        { title: "Email", key: "email" },
        { title: "Phone", key: "phone" },
        { title: "Status", key: "status" },
        { title: "to be named", key: "address" },
        { title: "to be named", key: "company" },
        { title: "Actions", key: "actions", sortable: false, width: "150px" },
      ],
      students: [],
      cities: [],

      showAddDialog: false,
      addingStudent: false,
      validForm: false,
      showSuccessMessage: false,
      successMessage: "",
      newStudent: {
        name: "",
        email: "",
        phone: "",
        website: "",
        city: "",
        status: true,
        highPriority: false,
      },

      showDeleteDialog: false,
      deletingStudent: false,
      studentToDelete: null,
      showErrorMessage: false,
      errorMessage: "",
    };
  },

  mounted() {
    this.fetchStudentsFromAPI();
  },

  computed: {
    studentStatus() {
      const total = this.studentStats.total;
      return [
        {
          name: "Active",
          count: this.studentStats.active,
          percentage: Math.round((this.studentStats.active / total) * 100),
          color: "#4caf50",
          icon: "mdi-check-circle",
        },
        {
          name: "Inactive",
          count: this.studentStats.inactive,
          percentage: Math.round((this.studentStats.inactive / total) * 100),
          color: "#ff9800",
          icon: "mdi-clock",
        },
        {
          name: "High Priority",
          count: this.studentStats.newStudents,
          percentage: Math.round((this.studentStats.newStudents / total) * 100),
          color: "#2196f3",
          icon: "mdi-account-plus",
        },
      ];
    },
    topCities() {
      const cityCounts = {};
      this.cities.forEach((city) => {
        cityCounts[city] = (cityCounts[city] || 0) + 1;
      });

      const sortedCities = Object.entries(cityCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 6)
        .map(([name, count]) => ({ name, count }));

      const maxCount = Math.max(...sortedCities.map((c) => c.count));
      return sortedCities.map((city) => ({
        ...city,
        percentage: maxCount > 0 ? (city.count / maxCount) * 100 : 0,
      }));
    },
    filteredStudents() {
      if (this.currentFilter === "all") return this.students;
      if (this.currentFilter === "active")
        return this.students.filter((s) => s.status === "active");
      if (this.currentFilter === "inactive")
        return this.students.filter((s) => s.status === "inactive");
      if (this.currentFilter === "new") {
        return this.students.filter((s) => s.id <= 3);
      }
      return this.students;
    },
  },
  methods: {
    async fetchStudentsFromAPI() {
      try {
        this.loading = true;
        this.error = null;

        console.log(
          " FETCHING: Getting data from JSONPlaceholder Users API..."
        );

        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users?_start=0&_limit=50"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        console.log(" SUCCESS: Users API data received", data.length, "users");

        this.students = data.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          program: user.program,
          basic: user.basic,
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
          status: Math.random() > 0.3 ? "active" : "inactive",
          isHighPriority: user.id <= 3,
        }));

        this.cities = this.students.map((student) => student.address.city);

        this.updateStatistics();
        this.loading = false;
      } catch (error) {
        console.error("❌ ERROR: Failed to fetch data from API", error);
        this.loading = false;
        this.error = error.message;
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

      console.log("📊 STATS UPDATED:", this.studentStats);
    },

    getFallbackData() {
      console.log(" USING FALLBACK DATA");
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

    addNewStudent() {
      if (!this.validForm) return;

      this.addingStudent = true;

      setTimeout(() => {
        const newId = Math.max(...this.students.map((s) => s.id)) + 1;

        const newStudentObj = {
          id: newId,
          name: this.newStudent.name,
          email: this.newStudent.email,
          phone: this.newStudent.phone,
          website: this.newStudent.website,
          address: {
            street: "",
            city: this.newStudent.city,
            zipcode: "",
          },
          company: {
            name: "New Company",
          },
          status: this.newStudent.status ? "active" : "inactive",
          isHighPriority: this.newStudent.highPriority,
        };

        this.students.unshift(newStudentObj);

        this.cities.push(this.newStudent.city);

        this.updateStatistics();

        this.resetAddForm();
        this.showAddDialog = false;
        this.addingStudent = false;

        this.successMessage = "Student added successfully!";
        this.showSuccessMessage = true;

        console.log("✅ STUDENT ADDED:", newStudentObj);
      }, 1000);
    },

    resetAddForm() {
      this.newStudent = {
        name: "",
        email: "",
        phone: "",
        website: "",
        city: "",
        status: true,
        highPriority: false,
      };
      if (this.$refs.addForm) {
        this.$refs.addForm.reset();
      }
    },

    closeAddDialog() {
      this.showAddDialog = false;
      this.resetAddForm();
    },

    confirmDeleteStudent(student) {
      this.studentToDelete = student;
      this.showDeleteDialog = true;
      console.log("CONFIRM DELETE:", student);
    },

    deleteStudent() {
      if (!this.studentToDelete) return;

      this.deletingStudent = true;

      setTimeout(() => {
        try {
          console.log("🔍 DELETE - Looking for student:", this.studentToDelete);
          console.log(
            "🔍 DELETE - Student ID to find:",
            this.studentToDelete.id
          );
          console.log(
            "  DELETE - Available students:",
            this.students.map((s) => ({ id: s.id, name: s.name }))
          );
          const index = this.students.findIndex(
            (s) => s.id == this.studentToDelete.id
          );

          console.log(" DELETE - Found at index:", index);
          if (index !== -1) {
            const deletedStudent = this.students.splice(index, 1)[0];
            this.cities = this.students.map((student) => student.address.city);
            this.updateStatistics();
            this.successMessage = `Student "${deletedStudent.name}" deleted successfully!`;
            this.showSuccessMessage = true;

            console.log("✅ STUDENT DELETED:", deletedStudent);
          } else {
            throw new Error(
              `Student with ID ${this.studentToDelete.id} not found in students array`
            );
          }
        } catch (error) {
          this.errorMessage = "Failed to delete student: " + error.message;
          this.showErrorMessage = true;
          console.error("DELETE ERROR:", error);
        } finally {
          this.showDeleteDialog = false;
          this.deletingStudent = false;
          this.studentToDelete = null;
        }
      }, 800);
    },

    toggleStatus(item) {
      item.status = item.status === "active" ? "inactive" : "active";
      this.updateStatistics();
      console.log("TOGGLED STATUS:", item.id, "status:", item.status);
    },

    filterStudents(filter) {
      this.currentFilter = filter;
      console.log("FILTER: Showing", filter, "students");
    },

    getFilterColor(filter) {
      const colors = {
        all: "primary",
        active: "green",
        inactive: "orange",
        new: "blue",
      };
      return colors[filter] || "primary";
    },

    editStudent(student) {
      console.log("EDIT STUDENT:", student);
    },

    viewStudent(student) {
      console.log("VIEW STUDENT:", student);
    },
  },
};
</script>

<style scoped>
.chart-container {
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.status-chart {
  width: 100%;
  max-width: 400px;
}
.chart-row {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}
.chart-label {
  display: flex;
  align-items: center;
  width: 150px;
  font-size: 14px;
}
.chart-bar-container {
  flex: 1;
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 4px;
  height: 24px;
  position: relative;
}
.chart-bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}
.chart-value {
  position: absolute;
  right: 8px;
  font-size: 12px;
  font-weight: 500;
}
.enrollment-chart {
  display: flex;
  align-items: end;
  justify-content: space-around;
  height: 200px;
  padding: 20px 0;
}
.enrollment-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}
.month-label {
  font-size: 12px;
  margin-bottom: 8px;
  font-weight: 500;
}
.bar-container {
  height: 120px;
  width: 30px;
  background-color: #f5f5f5;
  border-radius: 4px 4px 0 0;
  position: relative;
  display: flex;
  align-items: end;
}
.bar {
  width: 100%;
  background-color: #4caf50;
  border-radius: 4px 4px 0 0;
  transition: height 0.3s ease;
}
.count-label {
  font-size: 12px;
  margin-top: 4px;
  font-weight: 500;
}
.search-field {
  max-width: 300px;
}
.gap-2 {
  gap: 8px;
}
.text-green {
  color: #4caf50;
}
.text-orange {
  color: #ff9800;
}
.text-blue {
  color: #2196f3;
}
.text-primary {
  color: #1867c0;
}
</style>
