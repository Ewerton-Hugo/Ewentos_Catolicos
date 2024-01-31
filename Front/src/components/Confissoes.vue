<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <AppBar />
  <v-container>
    <v-card>
      <v-toolbar density="compact" color="#53B2E2">
        <template v-slot:extension>
          <v-tabs v-model="tab" align-tabs="title">
            <v-tab
              v-for="item in confissoesLocalStorage"
              :key="item"
              :value="item"
            >
              {{ item.dia }}
            </v-tab>
          </v-tabs>
        </template>
      </v-toolbar>

      <v-window v-model="tab">
        <v-window-item
          v-for="item in confissoesLocalStorage"
          :key="item.dia"
          :value="item"
        >
          <v-card flat>
            <v-expansion-panels variant="accordion">
              <v-expansion-panel>
                <v-expansion-panel-title color="#53B2E2">
                  <template v-slot:default>
                    <v-row no-gutters>
                      <v-col cols="4" class="d-flex justify-start">
                        {{
                          item &&
                          item.horas &&
                          item.horas[0] &&
                          item.horas[0].hora !== null
                            ? item.horas[0].hora
                            : "Horario não definido"
                        }}
                      </v-col>
                    </v-row>
                  </template>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-dialog width="1000">
                    <template v-slot:activator="{ props }">
                      <h3 v-bind="props">
                        {{
                          item.horas &&
                          item.horas[0].paroquias[0].descricao !== null
                            ? item.horas[0].paroquias[0].descricao
                            : "Informação não disponivel"
                        }}
                      </h3>
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
                              Site:
                              {{
                                paroquiasLocalStorage[0].site ||
                                "Informação não definida"
                              }}
                            </v-card-text>
                            <v-card-text>
                              Missas:
                              {{
                                paroquiasLocalStorage[0].missas ||
                                "Informação não definida"
                              }}
                            </v-card-text>
                            <v-card-text>
                              Confissões:
                              {{
                                paroquiasLocalStorage[0].confissoes ||
                                "Informação não definida"
                              }}
                            </v-card-text>
                            <v-card-text>
                              Telefone:
                              {{
                                paroquiasLocalStorage[0].telefone ||
                                "Informação não definida"
                              }}
                            </v-card-text>
                          </div>
                          <a
                            style="margin-left: 200px"
                            target="_blank"
                            :href="paroquiasLocalStorage[0].link_maps"
                          >
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
      confissoesLocalStorage: [],
      tokensParoquias: [],
      tab: null,
    };
  },
  created() {
    this.listarConfissoes();
  },
  methods: {
    async listarConfissoes() {
      const tokenCidade = localStorage.getItem("cidades");
      const parsedToken = JSON.parse(tokenCidade);
      const token = {
        cidade_token: parsedToken[5].token,
      };

      const response = await axios.post(
        "http://localhost:3333/confissoes",
        token
      );
      const responseData = response.data[0].func_confissoes;
      this.confissoesLocalStorage = responseData;
      this.tokensParoquias = [];

      // Iterando sobre todas as missas e coletando os tokens de paróquia
      this.confissoesLocalStorage.forEach((confissao) => {
        if (confissao.horas && confissao.horas.length > 0) {
          const tokenParoquia = confissao.horas[0].paroquias[0].token;
          this.tokensParoquias.push(tokenParoquia);
        }
      });

      // Chamando listarParoquias com o token da primeira paróquia (ou ajuste conforme necessário)
      if (this.tokensParoquias.length > 0) {
        this.listarParoquias(this.tokensParoquias[0]);
      }

      console.log("Tokens de Paróquias:", this.tokensParoquias);
      console.log(this.confissoesLocalStorage);
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
