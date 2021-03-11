<template>
  <div>
    <h1>Create A Post</h1>
    <form @submit.prevent="addPost">
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label>Post Title:</label>
            <input type="text" class="form-control" v-model="title">
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label>Description:</label>
            <input type="text" class="form-control" v-model="descript">
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label>Body:</label>
            <textarea
            class="form-control"
            v-model="body"
            rows="5"
            :min-height="50"
            >
          </textarea>
        </div>
      </div>
    </div><br />
    <div class="form-group">
      <button class="btn btn-primary">Create</button>
    </div>
  </form>
</div>
</template>

<script>
import { db } from '@/main'
export default {
  data(){
    return {
      title: null,
      descript: null,
      body: null
    }
  },
  methods: {
    async addPost () {
      await db.collection('posts').add({
        title: this.title,
        descript: this.descript,
        body: this.body
      })
      this.$router.push({name: 'posts'});
    }
  }
}
</script>
