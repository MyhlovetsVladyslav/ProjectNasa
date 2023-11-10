<template>
    <div class="container-fluid custom-bg">
        <div class="container">
            <img class="mt-4" src="../assets/img/logo.png" alt="logo">
            <button @click="this.$router.go(-1)" class="btn btn-secondary ">&lt; Назад</button>
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <div class="card mt-2">
                        <div class="card-header">{{ isLoginFormVisible ? 'Вход' : 'Регистрация' }}</div>
                        <div class="card-body">
                            <form v-if="!isLoginFormVisible" @submit.prevent="submitForm">
                                <div class="mb-3">
                                    <label for="login" class="form-label">Логин</label>
                                    <input type="login" class="form-control" id="login" v-model="login" required>
                                    <div class="mt-4 mb-4">
                                        <span class="alert alert-danger" role="alert" v-if="errors.login">{{ errors.login
                                        }}</span>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="email" class="form-label">Email адрес</label>
                                    <input type="email" class="form-control" id="email" v-model="email" required>
                                    <div class="mt-4 mb-4">
                                        <span class="alert alert-danger" role="alert" v-if="errors.email">{{ errors.email
                                        }}</span>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="password" class="form-label">Пароль</label>
                                    <input type="password" class="form-control" id="password" v-model="password" required>
                                </div>
                                <div class="alert alert-danger" role="alert" v-if="errorMessage">
                                    {{ errorMessage }}
                                </div>
                                <div class="d-flex justify-content-center align-items-center">
                                    <button type="submit" class="btn btn-primary mr-2">Зарегистрироваться</button>
                                    <button @click="toggleLoginForm" class="btn btn-secondary ml-2">
                                        {{ isLoginFormVisible ? 'Зарегистрироваться' : 'Уже есть аккаунт? Войти' }}
                                    </button>
                                    <br>

                                    <button @click="signInWithGoogle" class="btn btn-danger ml-2">Continue with
                                        Google</button>
                                </div>
                            </form>
                            <form v-else @submit.prevent="loginForm">
                                <div class="mb-3">
                                    <label for="email" class="form-label">Email адрес</label>
                                    <input type="email" class="form-control" id="login" v-model="email" required>
                                </div>
                                <div class="mt-4 mb-4">
                                    <span class="alert alert-danger" role="alert" v-if="errors.email">{{
                                        errors.email }}</span>
                                </div>
                                <div class="mb-3">
                                    <label for="password" class="form-label">Пароль</label>
                                    <input type="password" class="form-control" id="password" v-model="password" required>
                                </div>
                                <div class="alert alert-danger" role="alert" v-if="errorMessage">
                                    {{ errorMessage }}
                                </div>
                                <button type="submit" class="btn btn-primary">Войти</button>
                                <button @click="signInWithGoogle" class="btn btn-danger ml-2">Continue with
                                    Google</button>
                                <button @click="backToRegistration" class="btn btn-secondary ml-2">Вернуться назад к
                                    регистрации</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
import { useStore } from '../storeMain.js'
/* import { mapActions, mapState } from 'pinia';
export default {
    data() {
        return {
            login: '',
            email: '',
            password: '',
            isLoginFormVisible: false,

        };
    },
    methods: {
        ...mapActions(useStore, ['loginIn', 'register', 'signInWithGoogle']),
        submitForm() {
            if (this.loginValid && this.emailValid) {
                console.log("Не вірний логін або email");
            } else {
                this.register(this.login, this.email, this.password)
            }

        },
        loginForm() {
            this.loginIn(this.email, this.password)
        },
        toggleLoginForm() {
            this.isLoginFormVisible = !this.isLoginFormVisible;
            this.login = '';
            this.email = '';
            this.password = '';
        },
        backToRegistration() {
            this.isLoginFormVisible = false;
            this.login = '';
            this.email = '';
            this.password = '';
        },
    },
    computed: {
        ...mapState(useStore, ['errorMessage']),
        loginValid() {
            return this.login.length >= 20;
        },
        emailValid() {

            return this.email.length >= 30
        },
    }
}; */
import { ref } from 'vue';
import { validationMixin } from '../validationMixin.js';
export default {
    mixins: [validationMixin],
    setup() {
        const login = ref('');
        const email = ref('');
        const password = ref('');
        const isLoginFormVisible = ref(false);
        const errors = ref({
            login: '',
            email: ''
        })
        const { loginIn, register, signInWithGoogle } = useStore();


        const submitForm = () => {
            errors.value.login = validationMixin.methods.validateLogin(login.value)
            errors.value.email = validationMixin.methods.validateEmail(email.value)
            if (errors.value.login || errors.value.email) {
                return;
            }
            register(login.value, email.value, password.value);

        };

        const loginForm = () => {
            loginIn(email.value, password.value);
        };

        const toggleLoginForm = () => {
            isLoginFormVisible.value = !isLoginFormVisible.value;
            login.value = '';
            email.value = '';
            password.value = '';
        };

        const backToRegistration = () => {
            isLoginFormVisible.value = false;
            login.value = '';
            email.value = '';
            password.value = '';
        };
        return {
            errors,
            login,
            email,
            password,
            isLoginFormVisible,
            submitForm,
            loginForm,
            toggleLoginForm,
            backToRegistration,
            errorMessage: useStore().errorMessage,
            signInWithGoogle: signInWithGoogle,
        };
    },
};
</script>
  
<style scoped>
.custom-bg {
    background-image: url('../assets/img/body.jpg');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center;
    height: 100vh;
}
</style>
  