import { defineStore } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import axios from 'axios'

export const useAppStore = defineStore('app', {
 state: () => ({
    cidades: [],
 }),
 actions: {
     fetchCidades() {
      try {
        const response =  axios.post("http://localhost:3333/cidades")
        const cidades = response.data[0].func_json_cidades

        // armazene os dados retornados no localStorage
        localStorage.setItem('cidades', JSON.stringify(cidades))

        // atualize a propriedade 'cidades' no estado do store
        this.cidades = cidades
        console.log(this.cidades)
      } catch (error) {
        console.log(error)
      }

    },
 },
 plugins: [createPersistedState({
    key: 'my-app-store',
    paths: ['cidades']
 })]
})
