<script setup lang="ts">
import { ref } from 'vue'
import { useRegle } from '@regle/core'
import { required, minLength, email } from '@regle/rules'

// A self-referencing type — like a tree of categories or nested comments
type Category = {
  uuid: string
  name: string
  email: string
  parent?: Category
  children: Category[]
}

const state = ref<{ category: Category | null }>({
  category: null
})

const { r$ } = useRegle(state, {
  category: {
    uuid: { required },
    name: { required, minLength: minLength(4) },
    email: { required, email },
  }
})

// This line triggers TS2615 because $validate() return type forces
// TypeScript to eagerly map over all keys of Category, including
// the recursive parent and children fields.
async function submit() {
  const { valid, data } = await r$.$validate()
  if (valid) {
    console.log(data.category?.name)
  }
}
</script>

<template>
  <div class="container p-3">
    <h2>Regle + Self-Referencing Type</h2>
    <p>This reproduces TS2615 error on @regle/core 1.18.0+</p>

    <div class="py-2" v-if="state.category">
      <label class="form-label">Name</label>
      <input
        class="form-control"
        v-model="r$.category.name.$value"
        placeholder="Type name"
      />
    </div>

    <div class="py-2" v-if="state.category">
      <label class="form-label">Email</label>
      <input
        class="form-control"
        v-model="r$.category.email.$value"
        placeholder="Type email"
      />
    </div>

    <button class="btn btn-primary m-2" @click="submit">
      Submit (triggers TS2615)
    </button>
    <code class="status"> Form status {{ r$.$correct ? '✅' : '❌' }}</code>
  </div>
</template>

<style>
@import 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css';
</style>
