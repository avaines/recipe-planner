<template>
  <div class="min-h-screen bg-gray-50 py-10 px-4">
    <div class="max-w-3xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Profile</h1>
        <p class="text-gray-600 text-sm">View your account information and manage your group ID used for recipe sharing.</p>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        <!-- User Summary Card -->
        <div class="md:col-span-1 bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col items-start relative">
          <div v-if="loadingProfile" class="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center rounded-xl">
            <div class="animate-pulse flex flex-col items-center gap-2">
              <div class="w-14 h-14 rounded-full bg-gray-200"></div>
              <div class="w-32 h-4 bg-gray-200 rounded"></div>
              <div class="w-40 h-3 bg-gray-100 rounded"></div>
            </div>
          </div>
          <div class="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-semibold mb-4">
            {{ userInitials }}
          </div>
          <h2 class="text-lg font-semibold text-gray-800">{{ user.name || 'Anonymous User' }}</h2>
          <p class="text-sm text-gray-500 break-all">{{ user.email }}</p>
          <div class="mt-4 text-xs inline-flex items-center gap-2 px-2 py-1 rounded bg-blue-50 text-blue-600" v-if="groupId">
            <i class="pi pi-users text-sm"></i>
            <span>Group: {{ groupId }}</span>
          </div>
        </div>

        <!-- Editable Details -->
        <div class="md:col-span-2 space-y-8">
          <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 class="font-semibold text-gray-800 mb-4">Account Details</h3>
            <div class="grid gap-6">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input id="name" type="text" v-model="user.name" disabled class="w-full border rounded-md px-3 py-2 bg-gray-100 text-gray-700" />
              </div>
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input id="email" type="email" v-model="user.email" disabled class="w-full border rounded-md px-3 py-2 bg-gray-100 text-gray-700" />
              </div>
            </div>
          </div>

            <form @submit.prevent="confirmUpdateGroupId" class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <div class="flex items-start justify-between mb-4">
                <h3 class="font-semibold text-gray-800">Group Settings</h3>
                <button type="button" @click="toggleEditGroupId" class="text-sm inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50" :class="{ 'bg-yellow-50 border-yellow-300 text-yellow-700': isEditingGroupId }">
                  <i :class="['pi', isEditingGroupId ? 'pi-times' : 'pi-pencil']"></i>
                  <span>{{ isEditingGroupId ? 'Cancel' : 'Edit Group ID' }}</span>
                </button>
              </div>
              <div class="grid gap-4 mb-4">
                <div>
                  <label for="groupId" class="block text-sm font-medium text-gray-700 mb-1">Group ID</label>
                  <input id="groupId" type="text" v-model="groupId" :disabled="!isEditingGroupId" class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500" />
                </div>
              </div>
              <div v-if="isEditingGroupId" class="rounded-md bg-yellow-50 border border-yellow-200 px-4 py-3 text-sm text-yellow-800 mb-4 flex gap-2">
                <i class="pi pi-exclamation-triangle mt-0.5"></i>
                <p>Changing your Group ID will disconnect you from your existing recipes. Only proceed if you intend to start a new collection or join a different group.</p>
              </div>
              <div class="flex justify-end gap-3">
                <button v-if="isEditingGroupId" type="submit" class="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"><i class="pi pi-save"></i><span>Save Changes</span></button>
              </div>
            </form>

            <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 relative">
              <div v-if="loadingRecipes" class="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center rounded-xl">
                <div class="animate-pulse space-y-3 w-full">
                  <div class="h-4 bg-gray-200 rounded w-32"></div>
                  <div class="h-3 bg-gray-100 rounded w-48"></div>
                  <div class="h-3 bg-gray-100 rounded w-24"></div>
                </div>
              </div>
              <h3 class="font-semibold text-gray-800 mb-3">Account Status</h3>
              <p class="text-sm text-gray-600 mb-4">The features you can access may depend on whether your account has been enabled.</p>
              <div class="flex items-center gap-3">
                <span class="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold" :class="enabled ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'">
                  <i :class="['pi', enabled ? 'pi-check-circle' : 'pi-clock']"></i>
                  {{ enabled ? 'Enabled' : 'Pending Enablement' }}
                </span>
                <span class="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-700" v-if="!loadingRecipes">
                  <i class="pi pi-book"></i>
                  {{ recipeCount }} recipe{{ recipeCount===1 ? '' : 's' }}
                </span>
              </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, inject } from 'vue';
import { auth, db } from '@/plugins/firebase.js';

export default defineComponent({
  data() {
    return {
      user: { name: '', email: '' },
      groupId: '',
      enabled: false,
      isEditingGroupId: false,
      recipeCount: 0,
      loadingRecipes: true,
      loadingProfile: true
    };
  },
  setup(){
    const toast = inject('toast');
    return { toast };
  },
  created() {
    const user = auth.currentUser;
    if (!user) { this.loadingProfile=false; return; }
    this.user.name = user.displayName;
    this.user.email = user.email;
    db.collection('allow-users').doc(user.uid).get()
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          this.groupId = data.groupId;
          if (Object.prototype.hasOwnProperty.call(data,'enabled')) this.enabled = !!data.enabled;
          this.fetchRecipeCount();
        } else {
          this.toast && this.toast({ type:'error', title:'Profile', message:'User metadata missing.' });
        }
      })
      .catch((error) => {
        console.error('Error getting document:', error);
        this.toast && this.toast({ type:'error', title:'Profile', message:'Failed to load profile.' });
      })
      .finally(()=> { this.loadingProfile=false; });
  },
  computed: {
    userInitials() {
      if(!this.user.name) return '?';
      return this.user.name.split(/\s+/).slice(0,2).map(p=> p.charAt(0).toUpperCase()).join('');
    }
  },
  methods: {
    toggleEditGroupId() {
      this.isEditingGroupId = !this.isEditingGroupId;
    },
    confirmUpdateGroupId() {
      // inline confirmation toast style: we just proceed; could add a secondary confirm modal later
      this.updateGroupId();
    },
    updateGroupId() {
      const user = auth.currentUser;
      if (user) {
        db.collection('allow-users').doc(user.uid).update({
          groupId: this.groupId
        })
        .then(() => {
          this.isEditingGroupId = false;
          this.toast && this.toast({ type:'success', title:'Group ID Updated', message:'Your group ID was changed successfully.' });
          this.fetchRecipeCount();
        })
        .catch((error) => {
          console.error('Error updating Group ID:', error);
          this.toast && this.toast({ type:'error', title:'Update Failed', message:'Could not update group ID.' });
        });
      }
    },
    async fetchRecipeCount(){
      const user = auth.currentUser; if(!user) return;
      try {
        this.loadingRecipes = true;
        const allow = await db.collection('allow-users').doc(user.uid).get();
        if(!allow.exists) { this.loadingRecipes=false; return; }
        const groupId = allow.data().groupId;
        const snap = await db.collection(`recipes-${groupId}`).get();
        this.recipeCount = snap.size;
      } catch(e){
        console.error(e);
      } finally {
        this.loadingRecipes=false;
      }
    }
  }
});
</script>
