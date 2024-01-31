<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <AppBar />
  <v-container>
    <v-card>
      <v-toolbar density="compact" color="#53B2E2">
        <template v-slot:extension>
          <v-tabs v-model="tab" align-tabs="title">
            <v-tab
              v-for="(item, index) in missasLocalStorage"
              :key="index"
              :value="index"
            >
              {{ item.dia }}
            </v-tab>
          </v-tabs>
        </template>
      </v-toolbar>

      <v-window v-model="tab">
        <v-window-item
          v-for="(item, index) in missasLocalStorage"
          :key="index"
          :value="index"
        >
          <v-card flat>
            <v-expansion-panels v-if="item.horas" variant="accordion">
              <v-expansion-panel
                v-for="(hora, horaIndex) in item.horas"
                :key="horaIndex"
              >
                <v-expansion-panel-title color="#53B2E2">
                  <template v-slot:default>
                    <v-row no-gutters>
                      <v-col cols="4" class="d-flex justify-start">
                        {{ hora.hora }}
                      </v-col>
                    </v-row>
                  </template>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-dialog width="1000">
                    <template v-slot:activator="{ props }">
                      <h3 v-bind="props">{{ hora.paroquias[0].descricao }}</h3>
                    </template>

                    <template v-slot:default="{ isActive }">
                      <v-card>
                        <v-row>
                          <div>
                            <v-card-text>
                              <h3>{{ paroquiasLocalStorage[0].descricao }}</h3>
                            </v-card-text>
                            <v-card-text>
                              Paroco: {{ paroquiasLocalStorage[0].paroco }}
                            </v-card-text>
                            <v-card-text>
                              Endereço: {{ paroquiasLocalStorage[0].endereco }}
                            </v-card-text>
                            <v-card-text>
                              Site: {{
                                paroquiasLocalStorage[0].site ||
                                "Informação não definida"
                              }}
                            </v-card-text>
                            <v-card-text>
                              Missas: {{
                                paroquiasLocalStorage[0].missas ||
                                "Informação não definida"
                              }}
                            </v-card-text>
                            <v-card-text>
                              Confissões: {{
                                paroquiasLocalStorage[0].confissoes ||
                                "Informação não definida"
                              }}
                            </v-card-text>
                            <v-card-text>
                              Telefone: {{
                                paroquiasLocalStorage[0].telefone ||
                                "Informação não definida"
                              }}
                            </v-card-text>
                          </div>
                          <a  style="margin-left: 200px" target="_blank" :href="paroquiasLocalStorage[0].link_maps">

                            <v-img
                              src="@/assets/google-maps.png"
                              height="100"
                              width="100"
                              style="margin-top: 100px"
                            ></v-img>
                          </a>
                        </v-row>

                        <v-card-actions>
                          <v-spacer></v-spacer>

                          <v-btn
                            text="Fechar"
                            @click="isActive.value = false"
                          ></v-btn>
                        </v-card-actions>
                      </v-card>
                    </template>
                  </v-dialog>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
            <div v-else>
              <h1>Horario ainda não definido</h1>
            </div>
          </v-card>
        </v-window-item>
      </v-window>
    </v-card>
  </v-container>
</template>
<script setup>
import axios from "axios";
import AppBar from "@/layouts/default/AppBar.vue";
</script>
<script>
export default {
  data() {
    return {
      missasLocalStorage: [],
      tokensParoquias: [],
      tab: null,
    };
  },
  created() {
    this.listarMissas();
  },
  methods: {
    async listarMissas() {
      const tokenCidade = localStorage.getItem("cidades");
      const parsedToken = JSON.parse(tokenCidade);
      const token = {
        cidade_token: parsedToken[5].token,
      };

      const response = await axios.post("http://localhost:3333/missas", token);
      const responseData = response.data[0].func_missas;

      this.missasLocalStorage = responseData;

      // Adicionando um array para armazenar os tokens de paróquia
      this.tokensParoquias = [];

      // Iterando sobre todas as missas e coletando os tokens de paróquia
      this.missasLocalStorage.forEach((missa) => {
        if (missa.horas && missa.horas.length > 0) {
          const tokenParoquia = missa.horas[0].paroquias[0].token;
          this.tokensParoquias.push(tokenParoquia);
        }
      });

      // Chamando listarParoquias com o token da primeira paróquia (ou ajuste conforme necessário)
      if (this.tokensParoquias.length > 0) {
        this.listarParoquias(this.tokensParoquias[0]);
      }

      console.log("Tokens de Paróquias:", this.tokensParoquias);
    },
    async listarParoquias(tokenParoquia) {
      const token = {
        paroquia_token: tokenParoquia,
      };

      const response = await axios.post(
        "http://localhost:3333/paroquia",
        token
      );
      const responseData = response.data[0].func_dados_paroquia;
      this.paroquiasLocalStorage = responseData;

      console.log("Paróquias:", this.paroquiasLocalStorage);
    },
  },
};
</script>
