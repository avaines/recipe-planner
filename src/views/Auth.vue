<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
    <div class="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
      <!-- Left panel (marketing) -->
      <div class="hidden lg:flex flex-col justify-center p-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg">
        <h2 class="text-3xl font-bold mb-4">Plan smarter meals</h2>
        <p class="text-blue-100 mb-6 leading-relaxed">Centralize recipes, build weekly menus, and generate shopping lists automatically. Join us and streamline your kitchen workflow.</p>
        <ul class="space-y-3 text-sm">
          <li class="flex items-start gap-2"><i class="pi pi-check-circle mt-0.5"></i><span>Secure authentication with email & Google</span></li>
          <li class="flex items-start gap-2"><i class="pi pi-check-circle mt-0.5"></i><span>4-week rotating weekday menu grid</span></li>
          <li class="flex items-start gap-2"><i class="pi pi-check-circle mt-0.5"></i><span>Automatic deduplicated shopping lists</span></li>
          <li class="flex items-start gap-2"><i class="pi pi-check-circle mt-0.5"></i><span>Recipe tagging for dietary & prep notes</span></li>
        </ul>
      </div>

      <!-- Auth card -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
        <div class="px-8 pt-8 pb-4">
          <h1 class="text-2xl font-bold mb-1">{{ isLogin ? 'Sign in to your account' : 'Create your account' }}</h1>
          <p class="text-sm text-gray-500 mb-6">{{ isLogin ? 'Welcome back, please enter your details.' : 'Start organizing recipes & meal plans.' }}</p>
          <div class="space-y-3 mb-6">
            <button @click="googleSignIn" class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-sm font-medium">
              <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google" />
              <span>{{ isLogin ? 'Sign in with Google' : 'Sign up with Google' }}</span>
            </button>
          </div>
          <div class="relative mb-6">
            <div class="absolute inset-0 flex items-center" aria-hidden="true">
              <div class="w-full border-t border-gray-200"></div>
            </div>
            <div class="relative flex justify-center">
              <span class="px-3 bg-white text-xs uppercase tracking-wide text-gray-500">Or continue with email</span>
            </div>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-5">
            <div v-if="!isLogin">
              <label for="fullName" class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input id="fullName" v-model="form.name" type="text" autocomplete="name" class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" :class="{ 'border-red-500': errors.name }" />
              <p v-if="errors.name" class="text-xs text-red-600 mt-1">{{ errors.name }}</p>
            </div>
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input id="email" v-model="form.email" type="email" autocomplete="email" class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" :class="{ 'border-red-500': errors.email }" />
              <p v-if="errors.email" class="text-xs text-red-600 mt-1">{{ errors.email }}</p>
            </div>
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div class="relative">
                <input :type="showPassword ? 'text' : 'password'" id="password" v-model="form.password" autocomplete="current-password" class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10" :class="{ 'border-red-500': errors.password }" />
                <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700" aria-label="Toggle password visibility">
                  <i :class="['pi', showPassword ? 'pi-eye-slash' : 'pi-eye']"></i>
                </button>
              </div>
              <p v-if="errors.password" class="text-xs text-red-600 mt-1">{{ errors.password }}</p>
            </div>
            <div class="flex items-center justify-between" v-if="isLogin">
              <label class="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" v-model="rememberMe" class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <span>Remember me</span>
              </label>
              <router-link to="/forgot" class="text-sm text-blue-600 hover:text-blue-700">Forgot password?</router-link>
            </div>
            <button type="submit" class="w-full inline-flex justify-center items-center gap-2 px-4 py-2.5 rounded-md text-white font-medium bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60" :disabled="submitting">
              <span v-if="!submitting">{{ isLogin ? 'Sign In' : 'Create Account' }}</span>
              <span v-else class="flex items-center gap-2 text-sm"><span class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>Processing...</span>
            </button>
          </form>
          <p class="text-sm text-gray-600 mt-6">
            {{ isLogin ? "Don't have an account?" : 'Already have an account?' }}
            <button @click="toggleMode" class="text-blue-600 hover:text-blue-700 font-medium ml-1">{{ isLogin ? 'Create one' : 'Sign in' }}</button>
          </p>
          <router-link to="/" class="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mt-4"><i class="pi pi-arrow-left mr-1"></i>Back to home</router-link>
        </div>
        <!-- Toast notifications -->
        <div class="fixed top-4 right-4 space-y-2 z-50" v-if="toasts.length">
          <div v-for="t in toasts" :key="t.id" :class="['px-4 py-3 rounded shadow text-white flex items-start gap-3', toastClass(t.severity)]">
            <i :class="['pi', t.severity==='success' ? 'pi-check-circle' : 'pi-exclamation-triangle', 'mt-0.5']"></i>
            <div class="text-sm"><p class="font-semibold">{{ t.summary }}</p><p>{{ t.detail }}</p></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { login, register } from '@/stores/auth';
import firebase from 'firebase/app';
import { auth, db } from '@/plugins/firebase';
import { v4 as uuidv4 } from 'uuid';

export default defineComponent({
  setup(){
    const router = useRouter();
    const isLogin = ref(true);
    const rememberMe = ref(false);
    const submitting = ref(false);
    const form = reactive({ name:'', email:'', password:'' });
    const errors = reactive({ name:'', email:'', password:'' });
  const showPassword = ref(false);

    // simple toast system
    const toasts = ref([]);
    const pushToast = (t) => {
      const id = Date.now() + Math.random();
      toasts.value.push({ id, ...t });
      setTimeout(()=> { toasts.value = toasts.value.filter(x=> x.id !== id); }, t.life || 3000);
    };

    const validate = () => {
      errors.name = errors.email = errors.password = '';
      let ok = true;
      if (!isLogin.value && !form.name.trim()) { errors.name = 'Name is required'; ok = false; }
      if (!form.email.trim()) { errors.email = 'Email is required'; ok = false; }
      else if (!/\S+@\S+\.\S+/.test(form.email)) { errors.email = 'Please enter a valid email'; ok = false; }
      if (!form.password.trim()) { errors.password = 'Password is required'; ok = false; }
      else if (form.password.length < 6) { errors.password = 'Password must be at least 6 characters'; ok = false; }
      return ok;
    };

    const handleSubmit = async () => {
      if (!validate()) return;
      submitting.value = true;
      try {
        if (isLogin.value) await login(form.email, form.password); else await register(form.email, form.password, form.name);
        pushToast({ severity:'success', summary:'Success', detail: isLogin.value ? 'Welcome back!' : 'Account created successfully!', life:3000 });
        router.push('/menu');
      } catch (e) {
        pushToast({ severity:'error', summary:'Error', detail: e.message || 'Something went wrong', life:3000 });
      } finally { submitting.value = false; }
    };

    const googleSignIn = async () => {
      try {
        submitting.value = true;
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await auth.signInWithPopup(provider);
        const user = result.user;
        if (user) {
          const doc = await db.collection('allow-users').doc(user.uid).get();
          if (!doc.exists) {
            await db.collection('allow-users').doc(user.uid).set({
              displayName: user.displayName,
              email: user.email,
              enabled: false,
              groupId: uuidv4()
            });
          }
          pushToast({ severity:'success', summary:'Google Sign-In', detail:'Signed in successfully', life:3000 });
          router.push('/menu');
        }
      } catch (e) {
        pushToast({ severity:'error', summary:'Google Sign-In Failed', detail: e.message || 'Try again', life:3000 });
      } finally {
        submitting.value = false;
      }
    };

    const toggleMode = () => { isLogin.value = !isLogin.value; form.name = form.email = form.password = ''; errors.name = errors.email = errors.password = ''; };

    const toastClass = (sev) => {
      switch(sev){
        case 'success': return 'bg-green-600';
        case 'error': return 'bg-red-600';
        case 'warn': return 'bg-yellow-600';
        default: return 'bg-gray-700';
      }
    };

    return { isLogin, rememberMe, form, errors, handleSubmit, toggleMode, submitting, showPassword, toasts, toastClass, googleSignIn };
  }
});
</script>
<style scoped>
.min-h-screen { min-height: 100vh; }
.flex { display:flex; }
.items-center { align-items:center; }
.justify-center { justify-content:center; }
.justify-between { justify-content: space-between; }
.p-4 { padding:1rem; }
.p-6 { padding:1.5rem; }
.pt-0 { padding-top:0; }
.w-full { width:100%; }
.max-w-md { max-width:28rem; }
.space-y-6 > * + * { margin-top:1.5rem; }
.bg-gray-50 { background:#f9fafb; }
.bg-gradient-to-r { background-image: linear-gradient(to right, var(--tw-gradient-from), var(--tw-gradient-to)); }
.from-blue-500 { --tw-gradient-from:#3b82f6; }
.to-purple-600 { --tw-gradient-to:#9333ea; }
.text-white { color:#fff; }
.text-blue-100 { color:#dbeafe; }
.text-blue-600 { color:#2563eb; }
.text-blue-800 { color:#1e40af; }
.text-gray-500 { color:#6b7280; }
.text-gray-600 { color:#4b5563; }
.text-gray-700 { color:#374151; }
.rounded-t-lg { border-top-left-radius:0.5rem; border-top-right-radius:0.5rem; }
/* Utility for spinner */
@keyframes spin { to { transform: rotate(360deg); } }
.animate-spin { animation: spin 1s linear infinite; }
.shadow-lg { box-shadow:0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05); }
.font-bold { font-weight:700; }
.font-medium { font-weight:500; }
.text-sm { font-size:.875rem; }
.text-2xl { font-size:1.5rem; }
.text-4xl { font-size:2.25rem; }
.mb-4 { margin-bottom:1rem; }
.ml-1 { margin-left:.25rem; }
.ml-2 { margin-left:.5rem; }
.mr-1 { margin-right:.25rem; }
.inline-flex { display:inline-flex; }
</style>
