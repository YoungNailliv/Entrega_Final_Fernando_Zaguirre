//IMPORTO LOS ELEMENTOS DEL DOM Y LA LIBRERIA DE TOASTIFY
import elemento from "../elements/elements.js";
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"

// TRAEMOS LO DEL LOCALSTORAGE O CREAMOS UN ARRAY VACIO EN CASO DE NO HABER NADA

let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

//FUNCION PARA ELIMINAR LAS RECETAS DE FAVORITOS
const eliminarFavoritos = (mealId) => {
    //USAMOS EL METODO FILTER PARA ELIMNINAR LA RECETA CON EL ID DESEADO
    favoritos = favoritos.filter(fav => mealId !== fav.idMeal );
    //ALMACENAMOS EL RESULTADO EN EL LOCALSTORAGE
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    //USAMOS LA FUNCION PARA MOSTRAR DE NUEVO LO QUE HAYA EN FAVORITOS
    mostrarFavoritos();
    //ALERTAMOS LA ACCION MEDIANTE LA LIBRERIA TOASTIFY
    Toastify({
        text:"Se ha eliminado de favoritos",
        className: "yaEsFavNotificacion",
        duration: 3000,
        close: true,
        gravity: "bottom",
        position: "right", 
        stopOnFocus: true, 
        style: {
            background: "linear-gradient(to right, #e02020, #841818)",    
        },
        }).showToast();
};

//MUESTRA LO QUE HAY EN FAVORITOS, SI NO HAY NADA CAMBIA EL INNER HTML PARA PONER UN TEXTO QUE LO INDIQUE
export const mostrarFavoritos = () => {
    
    //VERIFICAMOS EL LENGHT DE FAVORITOS
    if(favoritos.length > 0){
        //VACIAMOS EL INNER HTML
        elemento.seccionFav.innerHTML = "";
        //Y POR CADA RECETA EN FAVORITOS, CREAMOS UNA CARD PARA MOSTRAR
        favoritos.forEach(receta => {
            let tarjetaReceta = document.createElement("div");
            tarjetaReceta.className = "receta textoReceta";
            tarjetaReceta.id = "textoReceta";
            tarjetaReceta.innerHTML = 
            `
            <h5>${receta.strMeal}</h5>
            `;
            tarjetaReceta.style.backgroundImage = `url(${receta.strMealThumb})`;
            tarjetaReceta.style.backgroundSize = "cover";

            

            let divBtn = document.createElement("div");
            divBtn.id = "botonesCardReceta";


            let btn = document.createElement("button");
            btn.innerText = "Ver Receta";
            btn.className = "btnMostrarReceta";
            btn.id = "btnMostrarReceta";

            let btnFavEliminar = document.createElement("button");
            btnFavEliminar.innerText = "Eliminar de favoritos";
            btnFavEliminar.className = "btnFav";
            btnFavEliminar.id = "btnFavEliminar";

            btn.onclick = () => generarPreview(receta.idMeal);
            btnFavEliminar.onclick = () => eliminarFavoritos(receta.idMeal);


            divBtn.appendChild(btn);
            divBtn.appendChild(btnFavEliminar);
            tarjetaReceta.appendChild(divBtn);
            
            
            
    
            elemento.seccionFav.appendChild(tarjetaReceta);
        });
    }else{
        //SI NO HAY NADA SE MUESTRA LO SIGUIENTE
        elemento.seccionFav.innerHTML = `<p class="textoFavNoHay">Aun no haz agregado ninguna receta a favoritos</p>`
    };
};


//AGREGAR UNA RECETA A FAVORITOS
export const AgregarFavoritos = async(mealId) => {
    //FETCH DE DATOS
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + mealId);
    const data = await resp.json();
    //COMPROBACION DE ATRIBUTOS
    let recetas = data.meals;
    let idBuscado = recetas[0].idMeal;

    //ALMACENAMOS UNA VARIABLE SI EL ID EXISTE EN FAVORITOS
    let idExiste = favoritos.some(obj => obj.idMeal === idBuscado);
    console.log(idExiste);
    //SI NO EXISTE, AGREGAMOS LA RECETA A FAVORITOS
    if (!idExiste) {
        favoritos.push(recetas[0]);
        localStorage.setItem("favoritos",JSON.stringify(favoritos));
        mostrarFavoritos();
        Toastify({
            text: "Se agrego a favoritos",
            className: "agregadoFavNotificacion",
            duration: 3000,
            close: true,
            gravity: "bottom",
            position: "right", 
            stopOnFocus: true, 
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",    
            },
            }).showToast();
    }else{   //DE NO SER ASI NOTIFICAMOS QUE YA SE ENCUENTRA EN FAVORITOS
        Toastify({
            text:`${recetas[0].strMeal} ya se encuentra en tus favoritos`,
            className: "yaEsFavNotificacion",
            duration: 3000,
            close: true,
            gravity: "bottom",
            position: "right", 
            stopOnFocus: true, 
            style: {
                background: "linear-gradient(to right, #e02020, #841818)",    
            },
            }).showToast();
    }
}

//FILTRAR POR CATEGORIA
export const filtroPorCategoria = async (categoria) => {
    //FETCH DE DATOS
    try{
        const resp = await fetch ("https://www.themealdb.com/api/json/v1/1/filter.php?c=" + categoria)
        const data = await resp.json();

        //VACIAMOS EL INNER HTML
        elemento.contenedorRecetas.innerHTML = ""
        //POR CADA RECETA CREAMOS UNA CARD
        data.meals.forEach(receta => {
            let tarjetaReceta = document.createElement("div");
            tarjetaReceta.className = "receta textoReceta"
            tarjetaReceta.id = "textoReceta"
            tarjetaReceta.innerHTML = 
            `
            <h5>${receta.strMeal}</h5>
            `
            tarjetaReceta.style.backgroundImage = `url(${receta.strMealThumb})`;
            tarjetaReceta.style.backgroundSize = "cover";

            

            let divBtn = document.createElement("div");
            divBtn.id = "botonesCardReceta";


            let btn = document.createElement("button");
            btn.innerText = "Ver Receta"
            btn.className = "btnMostrarReceta";
            btn.id = "btnMostrarReceta";

            let btnFav = document.createElement("button");
            btnFav.innerText = "Agregar a favoritos";
            btnFav.className = "btnFav";
            btnFav.id = "btnFav";

            btn.onclick = () => generarPreview(receta.idMeal);
            btnFav.onclick = () => AgregarFavoritos(receta.idMeal);

            divBtn.appendChild(btn);
            divBtn.appendChild(btnFav);
            tarjetaReceta.appendChild(divBtn);
            
            
            
    
            elemento.contenedorRecetas.appendChild(tarjetaReceta)
        });  
    }catch{
    }
};


// FETCH DE LAS CATEGORIAS //
export const obtenerCategorias = async () => {
    //HACEMOS EL FETCH DE LA INFORMACION DE THEMEALDB
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
    const data = await resp.json();
    
    //POR CADA ELEMENTO QUE TENGAMOS VAMOS A CREAR UNA TARJETA
    data.categories.forEach((categoria) => {
        
        
        //CREAMOS LA TARJETA PARA LA CATERGORIA
        let tarjeta = document.createElement("div");
        tarjeta.className = "cardCategoria";
        tarjeta.style.backgroundImage = `url(${categoria.strCategoryThumb})`;
        tarjeta.style.backgroundPosition = "center";
        tarjeta.innerHTML = `<p>${categoria.strCategory}</p>`;

        tarjeta.onclick = () => filtroPorCategoria(categoria.strCategory);
        
        elemento.contenedorCategorias.appendChild(tarjeta);
        


    });
    
};

//FUNCION QUE MUESTRA LA RECETA EN PANTALLA, HACIENDO CLICK EN CUALQUIER PARTE SALES DE LA VISTA DE LA RECETA
export const generarPreview = async (mealId) => {
    //FETCH
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + mealId);
    const data = await resp.json();

    //ESTE FOREACH ES SOLAMENTE POR QUE EL DATA ES UN ARRAY CON UN OBJETO
    data.meals.forEach(receta => {
        let preview = document.createElement("div");
        preview.className = "preview activePreview"
        preview.innerHTML = 
        `
        <div class="previewCard">
            <img src="${receta.strMealThumb}" alt="">
            <h2>${receta.strMeal}</h2>
            <div class="ingredientes">
                <ul class="ingredientesPreview" id="ingredientesPreview">
                    <li>${receta.strIngredient1}</li>
                    <li>${receta.strIngredient2}</li>
                    <li>${receta.strIngredient3}</li>
                    <li>${receta.strIngredient4}</li>
                    <li>${receta.strIngredient5}</li>
                    <li>${receta.strIngredient6}</li>
                    <li>${receta.strIngredient7}</li>
                    <li>${receta.strIngredient8}</li>
                    <li>${receta.strIngredient9}</li>
                    <li>${receta.strIngredient10}</li>
                    <li>${receta.strIngredient11}</li>
                    <li>${receta.strIngredient12}</li>
                    <li>${receta.strIngredient13}</li>
                    <li>${receta.strIngredient14}</li>
                    <li>${receta.strIngredient15}</li>
                    <li>${receta.strIngredient16}</li>
                    <li>${receta.strIngredient17}</li>
                    <li>${receta.strIngredient18}</li>
                    <li>${receta.strIngredient19}</li>
                    <li>${receta.strIngredient20}</li>
                </ul>
                <ul class="medidasIngredientesPreview" id="medidasIngredientesPreview">
                    <li>${receta.strMeasure1}</li>
                    <li>${receta.strMeasure2}</li>
                    <li>${receta.strMeasure3}</li>
                    <li>${receta.strMeasure4}</li>
                    <li>${receta.strMeasure5}</li>
                    <li>${receta.strMeasure6}</li>
                    <li>${receta.strMeasure7}</li>
                    <li>${receta.strMeasure8}</li>
                    <li>${receta.strMeasure9}</li>
                    <li>${receta.strMeasure10}</li>
                    <li>${receta.strMeasure11}</li>
                    <li>${receta.strMeasure12}</li>
                    <li>${receta.strMeasure13}</li>
                    <li>${receta.strMeasure14}</li>
                    <li>${receta.strMeasure15}</li>
                    <li>${receta.strMeasure16}</li>
                    <li>${receta.strMeasure17}</li>
                    <li>${receta.strMeasure18}</li>
                    <li>${receta.strMeasure19}</li>
                    <li>${receta.strMeasure20}</li>
                </ul>
            </div>
            <h5>Preparacion</h5>
            <p id="preparacionPreview" class="preparacionPreview">${receta.strInstructions}</p>
        </div>
        `
        //EL OPERADOR TERNARIO PARA CAMBIAR EL ESTILO DE CSS Y CERRAR LA VENTANA
        preview.onclick = () => preview.className = preview.className === "preview activePreview" ? "preview": "preview activePreview"
        
        elemento.seccionPreview.appendChild(preview);
    });



}

//FUNCION PARA BUSCAR POR NOMBRE
export const buscarPorNombre = async (valueInput) => {
    const resp = await fetch ("https://www.themealdb.com/api/json/v1/1/search.php?s=" + valueInput);
    const data = await resp.json();

    elemento.contenedorRecetas.innerHTML = ""

    if(data.meals){
        data.meals.forEach(receta => {
            let tarjetaReceta = document.createElement("div");
            tarjetaReceta.className = "receta textoReceta"
            tarjetaReceta.id = "textoReceta"
            tarjetaReceta.innerHTML = 
            `
            <h5>${receta.strMeal}</h5>
            `
            tarjetaReceta.style.backgroundImage = `url(${receta.strMealThumb})`;
            tarjetaReceta.style.backgroundSize = "cover";

            

            let divBtn = document.createElement("div");
            divBtn.id = "botonesCardReceta";


            let btn = document.createElement("button");
            btn.innerText = "Ver Receta"
            btn.className = "btnMostrarReceta";
            btn.id = "btnMostrarReceta";

            let btnFav = document.createElement("button");
            btnFav.innerText = "Agregar a favoritos";
            btnFav.className = "btnFav";
            btnFav.id = "btnFav";

            btn.onclick = () => generarPreview(receta.idMeal);
            btnFav.onclick = () => AgregarFavoritos(receta.idMeal);

            divBtn.appendChild(btn);
            divBtn.appendChild(btnFav)
            tarjetaReceta.appendChild(divBtn);
            
            
            
    
            elemento.contenedorRecetas.appendChild(tarjetaReceta)
        });
    
    }else{
        let alertaNoEncontrado = document.createElement("p");
        alertaNoEncontrado.className = "busquedaNoEncontrada";
        alertaNoEncontrado.innerText = `No se encontro nada con: '${elemento.inputBusquedaRecetas.value}' :(`
        elemento.contenedorRecetas.appendChild(alertaNoEncontrado);
    }

    
};

//BOTON DE BUSQUEDA DE UNA RECETA ALEATORIA
export const busquedaAleatoria = async () => {
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
    const data = await resp.json();

    elemento.contenedorRecetas.innerHTML = ""

    let receta = data.meals
    receta = receta[0];
    console.log(receta);

    let tarjetaReceta = document.createElement("div");
    tarjetaReceta.className = "receta textoReceta"
    tarjetaReceta.id = "textoReceta"
    tarjetaReceta.innerHTML = 
    `
    <h5>${receta.strMeal}</h5>
    `
    tarjetaReceta.style.backgroundImage = `url(${receta.strMealThumb})`;
    tarjetaReceta.style.backgroundSize = "cover";

    

    let divBtn = document.createElement("div");
    divBtn.id = "botonesCardReceta";


    let btn = document.createElement("button");
    btn.innerText = "Ver Receta"
    btn.className = "btnMostrarReceta";
    btn.id = "btnMostrarReceta";

    let btnFav = document.createElement("button");
    btnFav.innerText = "Agregar a favoritos";
    btnFav.className = "btnFav";
    btnFav.id = "btnFav";

    btn.onclick = () => generarPreview(receta.idMeal);
    btnFav.onclick = () => AgregarFavoritos(receta.idMeal);

    divBtn.appendChild(btn);
    divBtn.appendChild(btnFav)
    tarjetaReceta.appendChild(divBtn);
    
    
    elemento.contenedorRecetas.appendChild(tarjetaReceta)
}

//LA FUNCION QUE SE EJECUTA EN EL MAIN CON LOS DOS BOTONES DE BUSQUEDA

export const btnBusqueda = () => {
    elemento.btnBusqueda.onclick = () => buscarPorNombre(elemento.inputBusquedaRecetas.value);
    elemento.BotonBusquedaAleatoria.onclick = () => busquedaAleatoria();
};