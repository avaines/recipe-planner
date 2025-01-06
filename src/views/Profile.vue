<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">Profile</div>
          <div class="card-body">
            <form @submit.prevent="confirmUpdateGroupId">
              <div class="mb-3 row">
                <label for="name" class="col-md-4 col-form-label text-md-end">Name</label>
                <div class="col-md-6">
                  <input
                    id="name"
                    type="text"
                    class="form-control"
                    v-model="user.name"
                    disabled
                  />
                </div>
              </div>

              <div class="mb-3 row">
                <label for="email" class="col-md-4 col-form-label text-md-end">Email</label>
                <div class="col-md-6">
                  <input
                    id="email"
                    type="email"
                    class="form-control"
                    v-model="user.email"
                    disabled
                  />
                </div>
              </div>

              <div class="mb-3 row">
                <label for="groupId" class="col-md-4 col-form-label text-md-end">Group ID</label>
                <div class="col-md-6">
                  <input
                    id="groupId"
                    type="text"
                    class="form-control"
                    v-model="groupId"
                    :disabled="!isEditingGroupId"
                  />
                </div>
              </div>

              <div v-if="isEditingGroupId" class="alert alert-warning" role="alert">
                Changing your Group ID will result in losing access to any created recipes. Do not change this value unless you know what you are doing.
              </div>

              <div class="row mb-0">
                <div class="col-md-8 offset-md-4">
                  <button type="button" class="btn btn-secondary" @click="toggleEditGroupId">
                    {{ isEditingGroupId ? 'Cancel' : 'Edit Group ID' }}
                  </button>
                  <button v-if="isEditingGroupId" type="submit" class="btn btn-primary">Save</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { auth, db } from '@/plugins/firebase.js';

export default defineComponent({
  data() {
    return {
      user: {
        name: '',
        email: ''
      },
      groupId: '',
      isEditingGroupId: false
    };
  },
  created() {
    const user = auth.currentUser;
    if (user) {
      this.user.name = user.displayName;
      this.user.email = user.email;

      db.collection('allow-users').doc(user.uid).get()
        .then((doc) => {
          if (doc.exists) {
            this.groupId = doc.data().groupId;
          } else {
            console.error('No such document!');
          }
        })
        .catch((error) => {
          console.error('Error getting document:', error);
        });
    }
  },
  methods: {
    toggleEditGroupId() {
      this.isEditingGroupId = !this.isEditingGroupId;
    },
    confirmUpdateGroupId() {
      if (confirm('Are you sure you want to change your Group ID? This will result in losing access to any created recipes.')) {
        this.updateGroupId();
      }
    },
    updateGroupId() {
      const user = auth.currentUser;
      if (user) {
        db.collection('allow-users').doc(user.uid).update({
          groupId: this.groupId
        })
        .then(() => {
          this.isEditingGroupId = false;
          alert('Group ID updated successfully.');
        })
        .catch((error) => {
          console.error('Error updating Group ID:', error);
          alert('Error updating Group ID.');
        });
      }
    }
  }
});
</script>
