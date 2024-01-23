import { obtenerCategorias,filtroPorCategoria,buscarPorNombre,btnBusqueda, generarPreview, mostrarFavoritos } from "./src/manager/manager"

const app = () => {
  obtenerCategorias();
  btnBusqueda();
  mostrarFavoritos();
}

app();