<template>
  <v-row class="login center">
        <v-col sm="5">
            <v-col cols="12" sm="12">
                <v-img src="../assets/logo.png" alt="" contain class="mt-16"></v-img>
            </v-col>
        </v-col>
        <v-col cols="12" sm="7" class="center">
            <v-row align="center" justify="center">
                <v-col cols="6" sm="12" md="8">
                    <v-card class="elevation-12">
                        <!-- LOGIN CARD TOOLBAR -->
                        <v-toolbar color="primary" dark flat>
                            <v-toolbar-title>
                                <v-icon>mdi-login</v-icon>
                                Login
                            </v-toolbar-title>
                            <v-spacer />
                        </v-toolbar>
                        <!-- LOGIN CARD TOOLBAR -->
                        <!-- LOGIN INPUT FORM -->
                        <v-card-text>
                            <v-form @submit.prevent="authUser">
                                <v-text-field outlined v-model="userName" label="Usuario" color="secondary"
                                    name="login" prepend-icon="mdi-account" type="text" />
                                <v-text-field outlined v-model="password" id="password" label="Contraseña"
                                    color="secondary" name="password" prepend-icon="mdi-lock" type="password"
                                    @keypress.enter="authUser" />
                            </v-form>
                        </v-card-text>
                        <!-- LOGIN INPUT FORM -->
                        <!-- LOGIN BUTTONS -->
                        <v-card-actions>
                            <v-spacer />
                            <v-btn @click="authUser" color="secondary">Entrar</v-btn>
                        </v-card-actions>
                        <!-- LOGIN BUTTONS -->
                    </v-card>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</template>

<script>
/* eslint-disable */
import AuthServices from '@/services/AuthServices';
import { TokenUtils } from '@/utils/TokenUtils';
import  * as AppUtils from '@/utils/AppUtils';
import Swal from 'sweetalert2';

export default {
    name: 'login-card',
    data() {
        return {
            password: '',
            showPassword: false,
            userName: '',
        };
    },
    methods: {
        async authUser() {
            if(!this.userName){
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Favor de ingresar usuario.'
                })
                return;
            }
            if(!this.password){
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Favor de ingresar contraseña.'
                })
                return;
            }
            try {
                const resp = await AuthServices.auth(this.userName, this.password);
                TokenUtils.setToken(resp.token);
                const payload = TokenUtils.getJwtData();
                const { identity: userId } = TokenUtils.getJwtData();
                AppUtils.redirectToUserSectionByAttributes(this.$router);
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response.data.message
                })
            }
        }
    },
};
</script>

<style scoped>
.admin-text {
  z-index: 1;
}

h2 {
  letter-spacing: 0.25rem;
  color: white;
  font-size: 2rem;
  font-weight: 300;
}

.login {
  display: flex;
  flex-direction: column;
}

@media (min-width: 768px) {
  .login {
    flex-direction: row

;
  }
}
</style>
