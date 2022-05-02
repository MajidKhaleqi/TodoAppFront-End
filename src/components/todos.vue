<template>
  <div>
    <div class="container">
      <div class="add-todo-bgc p-3">
        <h6 class="text-primary text-bold">اضافه کردن کار جدید</h6>
        <div class="row px-4 py-2">
          <textarea
            name="text"
            id=""
            cols="20"
            rows="5"
            class="form-control"
            placeholder="متن"
            v-model="text"
          ></textarea>
          <select
            v-model="priority"
            class="form-select mt-2"
            aria-label="Default select example"
          >
            <option value="def" selected>اولویت را انتخاب کنید</option>
            <option value="بالا">بالا</option>
            <option value="متوسط">متوسط</option>
            <option value="پایین">پایین</option>
          </select>
          <button
            :disabled="disabled"
            @click="addTodo()"
            class="btn btn-md bg-success text-white btn-register mt-2"
          >
            ثبت
          </button>
        </div>
      </div>
    </div>
    <div class="container-fluid p-5 my-5">
      <div v-if="todos == ''">
        <h5 class="bg-danger p-2 text-white w-100">موردی یافت نشد</h5>
      </div>
      <div class="todo-bgc">
        <div
          class="todo-box col-md-4 p-2"
          v-for="(item, index) in todos"
          :key="item.id"
        >
          <div class="d-flex justify-content-between">
            <h6 class="text-right">عنوان :{{ item.text }}</h6>
            <font-awesome-icon
              v-b-modal="'edit-modal'"
              icon="fas fa-pen"
              color="blue"
              @click="editItemAc(index)"
            />
          </div>

          <div class="d-flex justify-content-between">
            <h6 class="text-right">اولویت:{{ item.priority }}</h6>
            <font-awesome-icon
              icon="fas fa-trash"
              color="red"
              @click="deleteItem(item._id)"
            />
          </div>
          <h6
            class="text-right text-white p-1 my-3"
            :class="
              item.status == 'pending'
                ? 'bg-warning'
                : item.status == 'done'
                ? 'bg-success'
                : 'bg-danger'
            "
          >
            وضعیت :
            {{
              item.status == "pending"
                ? "در انتظار"
                : item.status == "canceled"
                ? "کنسل شده"
                : "انجام شده"
            }}
          </h6>
        </div>
      </div>
      <b-modal id="edit-modal" :hide-footer="true">
        <div class="p-3">
          <h6 class="text-primary text-bold">ویرایش</h6>
          <div class="row px-4 py-2">
            <textarea
              name="text"
              id=""
              cols="20"
              rows="5"
              class="form-control"
              placeholder="متن"
              v-model="editItem.text"
            ></textarea>
            <select
              v-model="editItem.priority"
              class="form-select mt-2"
              aria-label="Default select example"
            >
              <option value="def" selected>اولویت را انتخاب کنید</option>
              <option value="بالا">بالا</option>
              <option value="متوسط">متوسط</option>
              <option value="پایین">پایین</option>
            </select>
            <select
              v-model="editItem.status"
              class="form-select mt-2"
              aria-label="Default select example"
            >
              <option value="def" selected>وضعیت را انتخاب کنید</option>
              <option value="pending">در انتظار</option>
              <option value="canceled">کنسل شده</option>
              <option value="done">انجام شده</option>
            </select>
            <button
              :disabled="disabled"
              @click="editTodo()"
              class="btn btn-md bg-success text-white btn-register mt-2"
            >
              ویرایش
            </button>
          </div>
        </div>
      </b-modal>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      text: "",
      priority: "def",
      disabled: false,
      todos: [],
      editItem: {},
    };
  },
  created() {
    this.loadTodos();
  },
  methods: {
    loadTodos() {
      this.$axios.get("http://localhost:5050/api/v1/todos").then((response) => {
        this.todos = response.data.todos;
      });
    },
    addTodo() {
      this.$axios
        .post(
          "http://localhost:5050/api/v1/todos",
          {
            text: this.text || "",
            priority: this.priority || "",
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          this.text = "";
          this.priority = "";
          this.$root.success_notification(response.data.message);
          this.todos.push(response.data.todo.newTodo);
        })
        .catch((err) => {
          this.$root.error_notification(err.response.data.error.msg);
        });
    },
    editTodo() {
      this.$axios
        .patch(
          `http://localhost:5050/api/v1/todos/${this.editItem._id}`,
          {
            text: this.editItem.text || "",
            priority: this.editItem.priority || "",
            status: this.editItem.status || "",
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          this.$root.$set(this.todos, this.editItem.index, response.data.todo);
          this.$root.success_notification(response.data.message);
          this.$root.$emit("bv::hide::modal", "edit-modal");
        })
        .catch((err) => {
          this.$root.error_notification(err.response.data.error.msg);
        });
    },
    deleteItem(id) {
      this.$axios
        .delete(`http://localhost:5050/api/v1/todos/${id}`)
        .then((response) => {
          this.todos = response.data.todos;
          console.log(response);
          this.$root.success_notification(response.data.message);
        })
        .catch((err) => {
          this.$root.error_notification(err.response.data.error.msg);
        });
    },
    editItemAc(index) {
      let item = window.clone(this.todos[index]);
      item.index = index;
      this.editItem = item;
    },
  },
};
</script>
<style>
.close {
  border: none;
  background: none;
}
.modal-header {
  padding: 10px !important;
  justify-content: unset !important;
}
.todo-bgc {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  grid-auto-rows: 120px;
}
.add-todo-bgc {
  box-shadow: 1px 3px 14px 0px rgb(0 0 0 / 35%);
}
.text-bold {
  font-weight: bold;
}
.todo-box {
  width: 100% !important;
  box-shadow: 1px 3px 14px 0px rgb(0 0 0 / 35%);
}
.text-right {
  text-align: right;
}
.text-left {
  text-align: left;
}
</style>
