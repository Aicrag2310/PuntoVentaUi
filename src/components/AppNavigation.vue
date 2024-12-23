<template>
    <div>
        <v-app-bar clipped-left flat color="rgba(190, 149, 91, 0.010)" class="mb-0" height="100"
            style="border-bottom: 2px solid var(--v-primary-base);">
            <v-app-bar-nav-icon @click.stop="drawer = !drawer" color="primary"></v-app-bar-nav-icon>
            <div class="align-start mr-16">
                <v-img src="../assets/logo.png" width="100" height="100" contain></v-img>
            </div>
            <div class="d-flex align-center">
                <span class="primary--text-GM title-text-GM">Punto De Venta</span>
            </div>
            <v-spacer></v-spacer>
            <div class="d-flex align-center">
                <v-icon color="primary">mdi-account-circle</v-icon>
                <span class="primary--text user-text ml-2">Bienvenido</span>
            </div>
        </v-app-bar>
        <v-navigation-drawer v-model="drawer" app clipped absolute temporary
            style="border-right: 5px solid var(--v-primary-base);">
            <v-list>
                <v-list-item class="px-2" to="/dashboard">
                    <v-list-item-avatar>
                        <v-icon color="var(--v-primary-base)">mdi-beach</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-title>
                        <v-btn text color="var(--v-primary-base)">Productos</v-btn>
                    </v-list-item-title>
                </v-list-item>
                <v-list-item class="px-2" to="/ventas">
                    <v-list-item-avatar>
                        <v-icon color="var(--v-primary-base)">mdi-cash</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-title>
                        <v-btn text color="var(--v-primary-base)">Ventas</v-btn>
                    </v-list-item-title>
                </v-list-item>
                <v-list-item to="/login">
                    <v-list-item-avatar>
                        <v-icon color="var(--v-primary-base)">mdi-exit-to-app</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-title>
                        <v-btn text color="var(--v-primary-base)">Salir</v-btn>
                    </v-list-item-title>
                </v-list-item>

            </v-list>

        </v-navigation-drawer>
    </div>
</template>
<script>
/* eslint-disable */
export default {
    data() {
        return {
            drawer: false,
        };
    },
    methods: {
        navigateTo(route) {
            this.$router.push(route);
        },
    },
};
</script>
<style>
.primary--text {
    font-family: "Ubuntu", sans-serif;
}

.title-text {
    @media screen and (max-width: 600px) {
        font-size: 20px;
    }
}

v-list-item-title {
    color: var(--v-primary-base);
}
</style>
