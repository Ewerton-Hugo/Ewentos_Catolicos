<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <AppBar />
  <v-container>
    <v-row class="d-flex align-center justify-center">
      <v-expansion-panels
        v-for="(evento, index) in eventoLocalStorage"
        :key="index"
        variant="accordion"
      >
        <v-expansion-panel>
          <v-expansion-panel-title color="#53B2E2">
            <template v-slot:default>
              <v-row no-gutters>
                <v-col cols="4" class="d-flex justify-start">
                  {{ evento.mes }}
                </v-col>
              </v-row>
            </template>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-row class="d-flex justify-center">
              <a
                v-if="evento.eventos[0]?.imagem"
                :href="evento.eventos[0].link"
                target="_blank"
              >
                <v-img
                  :width="250"
                  :height="250"
                  :src="evento.eventos[0].imagem"

                ></v-img>
              </a>
              <a
                v-if="evento.eventos[1]?.imagem"
                :href="evento.eventos[1].link"
                target="_blank"
              >
                <v-img
                  :width="250"
                  :height="250"
                  :src="evento.eventos[1].imagem"

                ></v-img>
              </a>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
  </v-container>
</template>

<script setup>
import axios from "axios";
import AppBar from "@/layouts/default/AppBar.vue";
</script>

<script>
export default {
  data: () => ({
    cidadeLocalStorage: null,
    eventoLocalStorage: [],
  }),
  created() {
    this.carregarCidadesDoLocalStorage();
    this.listarEventos();
  },
  methods: {
    carregarCidadesDoLocalStorage() {
      const cidadeSalvo = localStorage.getItem("cidades");

      if (cidadeSalvo) {
        const cidade = JSON.parse(cidadeSalvo);
        this.cidadeLocalStorage = cidade; // Armazena o usuário na variável do componente
        console.log(
          "Usuário carregado do localStorage:",
          this.cidadeLocalStorage
        );
      }
    },
    async listarEventos() {
      const tokenCidade = localStorage.getItem("cidades");
      const parsedToken = JSON.parse(tokenCidade);
      const token = {
        cidade_token: parsedToken[5].token,
      };
      console.log("locaalaadas", parsedToken);
      const response = await axios.post("http://localhost:3333/eventos", token);
      const responseData = response.data[0].func_eventos;
      this.eventoLocalStorage = responseData;
      console.log("local", this.eventoLocalStorage);
    },
  },
};
</script>
