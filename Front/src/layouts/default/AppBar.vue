<!-- combolist -->
<template>
  <v-app-bar color="#CCCCCC" height="150">
    <v-spacer></v-spacer>
    <div class="buttons">
      <v-btn height="140" variant="outlined" stacked @click="Eventos">
        <v-icon>
          <img
            src="@/assets/medalha.png"
            alt="Medalha"
            style="width: 80px; margin-top: 18px; height: 80px"
          />
        </v-icon>
        <div style="display: flex; ">
          <span style="margin-top: 54px">Eventos</span>
        </div>
      </v-btn>
      <v-btn height="140" variant="outlined" stacked @click="Missas">
        <v-icon>
          <img
            src="@/assets/medalha.png"
            alt="Medalha"
            style="width: 80px; margin-top: 18px; height: 80px"
          />
        </v-icon>
        <div style="display: flex; ">
          <span style="margin-top: 54px">Missas</span>
        </div>
      </v-btn>
      <v-btn height="140" variant="outlined" stacked @click="Confissoes">
        <v-icon>
          <img
            src="@/assets/medalha.png"
            alt="Medalha"
            style="width: 80px; margin-top: 18px; height: 80px"
          />
        </v-icon>
        <div style="display: flex; flex-direction: column; align-items: center">
          <span style="margin-top: 54px">Confissões</span>
        </div>
      </v-btn>
    </div>

    <v-spacer></v-spacer>
    <div class="logo">
      <v-autocomplete
        bg-color="white"
        :label="selectedItem ? selectedItem.descricao : (cidades.length > 0 ? cidades[0].descricao : 'Estado/Municipio')"
        width
        v-model="selectedItem"
        :items="cidades"
        item-value="token"
        item-title="descricao"
        hide-details
        variant="outlined"
        @keyup.enter="handleChange"
      ></v-autocomplete>
    </div>
  </v-app-bar>
</template>

<script>
import axios from "axios";
import { useAppStore } from "../../store/app";
export default {
  data: () => ({
    selectedItem: null,
  }),

  created() {
    this.listarCidades();
  },
  computed: {
    cidades() {
      const store = useAppStore();
      return store.cidades;
    },
  },
  methods: {
    Eventos() {
      this.$router.push("eventos");
    },
    Missas() {
      this.$router.push("missas");
    },
    Confissoes() {
      this.$router.push("confissoes");
    },
    async listarCidades() {
      const store = useAppStore();
      if (store.cidades.length === 0) {
        // Somente busca as cidades se o array no store estiver vazio
        const response = await axios.post("http://localhost:3333/cidades");
        const responseData = response.data[0].func_json_cidades;
        store.cidades = responseData;
        localStorage.setItem("cidades", JSON.stringify(store.cidades));
        console.log(store.cidades);
      }
    },
    handleChange() {
      if (this.selectedItem) {
        const cidadeToken = this.selectedItem;
        console.log(this.selectedItem)
        localStorage.setItem("cidade_token", cidadeToken);
        window.location.reload();
      }
    },
  },
};
</script>

<style scoped>
.router-link {
  text-decoration: none; /* Remove o sublinhado */
  color: inherit; /* Usa a cor do texto padrão (não altera a cor) */
}
.buttons {
  display: flex;
  gap: 2rem;
}
.user {
  background-color: #ffffff;
  color: #1b5175;
}
.text {
  color: #ffffff;
}
</style>
