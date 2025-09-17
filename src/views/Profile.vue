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

            <!-- Data Management: Export / Import -->
            <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <h3 class="font-semibold text-gray-800 mb-4">Data Management</h3>
              <p class="text-sm text-gray-600 mb-4">Export your recipes to CSV or import from a CSV. Imports will overwrite existing recipes when both name and book match (case-insensitive).</p>
              <div class="flex flex-wrap gap-3">
                <button type="button" @click="exportRecipesCsv" :disabled="busyData" class="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"><i class="pi pi-download"></i><span>Export CSV</span></button>
                <button type="button" @click="triggerImport" :disabled="busyData" class="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"><i class="pi pi-upload"></i><span>Import CSV</span></button>
                <input ref="importInput" type="file" accept=".csv,text/csv" class="hidden" @change="onImportFileChange" />
              </div>
              <div v-if="busyData" class="mt-3 text-xs text-gray-500 flex items-center gap-2"><i class="pi pi-spin pi-spinner"></i><span>Processing…</span></div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, inject, ref } from 'vue';
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
      loadingProfile: true,
      busyData: false
    };
  },
  setup(){
    const toast = inject('toast');
    const importInput = ref(null);
    return { toast, importInput };
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
    },
    // CSV helpers
    csvEscape(val){
      const s = val==null ? '' : String(val);
      if (/[",\n]/.test(s)) return '"' + s.replace(/"/g,'""') + '"';
      return s;
    },
    toBool(v){
      if (typeof v === 'boolean') return v;
      const s = String(v||'').trim().toLowerCase();
      return ['true','1','yes','y'].includes(s);
    },
    parseCSV(text){
      const rows = [];
      let i = 0, field = '', row = [], inQuotes = false;
      const pushField = () => { row.push(field); field = ''; };
      const pushRow = () => { rows.push(row); row = []; };
      while (i < text.length) {
        const ch = text[i++];
        if (inQuotes) {
          if (ch === '"') {
            if (text[i] === '"') { field += '"'; i++; }
            else { inQuotes = false; }
          } else { field += ch; }
        } else {
          if (ch === '"') inQuotes = true;
          else if (ch === ',') pushField();
          else if (ch === '\n') { pushField(); pushRow(); }
          else if (ch === '\r') { /* ignore CR */ }
          else field += ch;
        }
      }
      // flush last field/row
      pushField(); if (row.length>1 || (row.length===1 && row[0]!=='')) pushRow();
      return rows;
    },
    headerMap(cols){
      const map = {};
      cols.forEach((c, idx)=>{
        const k = c.trim().toLowerCase();
        if (['name','recipe'].includes(k)) map['name'] = idx;
        else if (k==='book') map['book'] = idx;
        else if (k==='ingredients') map['ingredients'] = idx;
        else if (k==='leftovers') map['leftovers'] = idx;
        else if (k==='glutenfree' || k==='gluten_free' || k==='gluten free') map['glutenFree'] = idx;
        else if (k==='marinaterequired' || k==='marinate_required' || k==='marinate required' || k==='marinade') map['marinateRequired'] = idx;
        else if (k==='timeconsuming' || k==='time_consuming' || k==='time consuming') map['timeConsuming'] = idx;
      });
      return map;
    },
    triggerImport(){ this.importInput && this.importInput.click(); },
    async onImportFileChange(e){
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      try {
        this.busyData = true;
        const text = await file.text();
        const rows = this.parseCSV(text);
        if (!rows.length) { this.toast && this.toast({ type:'warn', title:'Import', message:'CSV is empty.' }); return; }
        const header = rows[0];
        const map = this.headerMap(header);
        if (!map.name || !map.book) { this.toast && this.toast({ type:'error', title:'Import', message:'CSV must include name (or recipe) and book columns.' }); return; }
        // Build objects
        const items = rows.slice(1).map(r=> ({
          name: (r[map.name]||'').trim(),
          book: (r[map.book]||'').trim(),
          ingredients: (map.ingredients!=null ? (r[map.ingredients]||'').trim() : ''),
          leftovers: this.toBool(map.leftovers!=null ? r[map.leftovers] : false),
          glutenFree: this.toBool(map.glutenFree!=null ? r[map.glutenFree] : false),
          marinateRequired: this.toBool(map.marinateRequired!=null ? r[map.marinateRequired] : false),
          timeConsuming: this.toBool(map.timeConsuming!=null ? r[map.timeConsuming] : false)
        })).filter(x=> x.name && x.book);
        if (!items.length) { this.toast && this.toast({ type:'warn', title:'Import', message:'No valid rows with both name and book.' }); return; }
        const user = auth.currentUser; if(!user) throw new Error('Not authenticated');
        const allow = await db.collection('allow-users').doc(user.uid).get(); if(!allow.exists) throw new Error('Missing allow-users');
        const groupId = allow.data().groupId; const col = db.collection(`recipes-${groupId}`);
        // Load existing and build lookup
        const existingSnap = await col.get();
        const existing = new Map();
        existingSnap.forEach(d=>{
          const data = d.data();
          const nm = (data.name || data.recipe || '').trim().toLowerCase();
          const bk = (data.book || '').trim().toLowerCase();
          if (nm && bk) existing.set(nm + '|' + bk, d.id);
        });
        // Upsert
        let created=0, updated=0;
        for (const it of items){
          const key = it.name.trim().toLowerCase() + '|' + it.book.trim().toLowerCase();
          const data = {
            name: it.name,
            book: it.book,
            ingredients: it.ingredients,
            leftovers: !!it.leftovers,
            glutenFree: !!it.glutenFree,
            marinateRequired: !!it.marinateRequired,
            timeConsuming: !!it.timeConsuming
          };
          const id = existing.get(key);
          if (id) { await col.doc(id).set(data, { merge:false }); updated++; }
          else { await col.add(data); created++; }
        }
        this.toast && this.toast({ type:'success', title:'Import Complete', message:`${updated} updated, ${created} created.` });
        this.fetchRecipeCount();
      } catch(err){
        console.error(err);
        this.toast && this.toast({ type:'error', title:'Import Failed', message: String(err && err.message || err) });
      } finally {
        this.busyData = false;
        if (this.importInput) this.importInput.value = '';
      }
    },
    async exportRecipesCsv(){
      try {
        this.busyData = true;
        const user = auth.currentUser; if(!user) throw new Error('Not authenticated');
        const allow = await db.collection('allow-users').doc(user.uid).get(); if(!allow.exists) throw new Error('Missing allow-users');
        const groupId = allow.data().groupId; const col = db.collection(`recipes-${groupId}`);
        const snap = await col.get();
        const rows = [];
        const header = ['name','book','ingredients','leftovers','glutenFree','marinateRequired','timeConsuming'];
        rows.push(header);
        snap.forEach(d=>{
          const r = d.data();
          const name = (r.name || r.recipe || '').trim();
          const book = (r.book || '').trim();
          const ingredients = Array.isArray(r.ingredients)? r.ingredients.join(', ') : (r.ingredients || '');
          const leftovers = !!r.leftovers;
          const glutenFree = !!r.glutenFree;
          const marinateRequired = !!(r.marinateRequired || r.marinade);
          const timeConsuming = !!r.timeConsuming;
          rows.push([name, book, ingredients, leftovers, glutenFree, marinateRequired, timeConsuming]);
        });
        const csv = rows.map(row=> row.map(this.csvEscape).join(',')).join('\n');
        const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const date = new Date();
        const pad = (n)=> String(n).padStart(2,'0');
        const fname = `recipes-${groupId}-${date.getFullYear()}${pad(date.getMonth()+1)}${pad(date.getDate())}.csv`;
        a.href = url; a.download = fname; document.body.appendChild(a); a.click(); a.remove();
        URL.revokeObjectURL(url);
        this.toast && this.toast({ type:'success', title:'Export', message:'CSV downloaded.' });
      } catch(err){
        console.error(err);
        this.toast && this.toast({ type:'error', title:'Export Failed', message: String(err && err.message || err) });
      } finally {
        this.busyData = false;
      }
    }
  }
});
</script>
