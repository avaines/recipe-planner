<template>
  <div>
    <h1>Edit Post</h1>
    <form @submit.prevent="updatePost">
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label>Post Title:</label>
            <input type="text" class="form-control" v-model="post.title">
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label>Post Description:</label>
            <input type="text" class="form-control" v-model="post.descript">
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label>Post Body:</label>
            <textarea
            class="form-control"
            v-model="post.body"
            rows="5"
            :min-height="50"
            >
          </textarea>
        </div>
      </div>
    </div><br />
    <div class="form-group">
      <button class="btn green">Update</button>
    </div>
  </form>
</div>
</template>

<script>
import { db } from '@/main'
export default {
  data() {
    return {
      post: []
    }
  },
  created () {
    const ref = db.collection('posts').doc(this.$route.params.id);
    ref.get().then((doc) => {
      if (doc.exists) {
        this.post = doc.data();
      } else {
        alert("No such document!");
      }
    });
  },
  methods: {
    async updatePost () {
      const updateRef = await db.collection('posts').doc(this.$route.params.id)
      updateRef.set({
        title: this.post.title,
        descript: this.post.descript,
        body: this.post.body
      })
      this.$router.push({name: 'posts'});
    }
  }
}
</script>
