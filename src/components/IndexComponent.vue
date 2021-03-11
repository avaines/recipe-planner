<template>
  <div>
    <table class="table table-hover">
      <thead>
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="post in posts" :key="post.id">
          <td>{{ post.title }}</td>
          <td>{{ post.descript }}</td>
          <td><router-link :to="{name: 'edit', params: { id: post.id }}" class="btn blue">Edit</router-link>
              <button class="btn red" @click.prevent="deletePost(post.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import db from '@/main'
import { mapGetters } from "vuex";

export default {
  data() {
    return {}
  },
  mounted () {
    this.getPosts()
  },
  methods: {
    getPosts () {
      this.$store.dispatch('loadPosts')
    },
    async deletePost (id) {
      await db.collection('posts').doc(id).delete()
      this.getPosts()
    }
  },
  computed: {
    ...mapGetters({
      posts: "posts"
    })
  }
};
</script>
