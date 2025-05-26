<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import LoginCard from './LoginCard.vue'

const router = useRouter()
const authStore = useAuthStore()



const credentials = ref({
  ip: '',
  username: ''
})

const cancel = () => {
  router.back()
}

const login = () => {
  authStore.login(credentials.value)
}

const handleLoginSelect = (selectedLogin) => {
  authStore.autoLogin(selectedLogin)
 
}

onMounted(() => {
  authStore.getLoginList()
})
</script>

<template>
  <div class="flex items-center justify-center space-x-4 p-8">
    <Card class="w-[450px] p-4 px-8">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your Kubernetes cluster information</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div class="grid items-center w-full gap-4">
            <div class="flex flex-col space-y-1.5">
              <Label for="ip">Cluster IP</Label>
              <Input id="ip" placeholder="0.0.0.0" v-model="credentials.ip" />
              <ErrorMessage errorMessage=""></ErrorMessage>
            </div>
            <div class="flex flex-col space-y-1.5">
              <Label for="token">Token</Label>
              <Input id="token" placeholder="Token" v-model="credentials.token" />
              <ErrorMessage errorMessage=""></ErrorMessage>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter class="flex justify-between px-6 pb-6">
        <Button variant="outline" @click="cancel">
          Cancel
        </Button>
        <Button class="bg-blue-500" @click="login">
          Login
        </Button>
      </CardFooter>
    </Card>

    <Card class="w-[450px] p-4 px-8">
      <!-- Add content for the second card here -->
      <CardHeader>
        <CardTitle>Stored Logins</CardTitle>
        <CardDescription>Click on the cards to login automatically</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="max-h-64 overflow-y-auto">
          <div v-for="(login, index) in authStore.loginList" :key="index">
            <LoginCard :login="login" @select="handleLoginSelect" />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>