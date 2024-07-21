  document.addEventListener('DOMContentLoaded', function() {
  var contratos_inhabilitados_text = "";
  var contratos_simultaneos_text = "";
  var contratos_entidades_text = "";
  var fuentes_text = "";

  const openContratosElecciones = document.getElementById("open-contratos-elecciones");
  const openContratosSimultaneos = document.getElementById("open-contratos-simultaneos");
  const openContratosEntidades = document.getElementById("open-contratos-entidades");
  const openFuentes = document.getElementById("open-fuentes");

  const loadingIcon = document.querySelector('.loading-icon');
  const messageResponse = document.querySelector('.response');

  const closeButton = document.getElementById('close-button');
  const overlay = document.getElementById('overlay');
  const dialogBox = document.getElementById('dialog-box');
  const dialogSpace = document.getElementById('dialog-space');


  // Function to open the dialog
  function openDialog() {
    console.log("opening")
    overlay.style.display = 'block';
    dialogBox.style.display = 'block';
  }

  // Function to close the dialog
  function closeDialog() {
      overlay.style.display = 'none';
      dialogBox.style.display = 'none';
  }

function setContratosElecciones(data){
  let contratos = data.contratos
  openContratosElecciones.textContent = contratos.inhabilita.length + " Contratos"
  let s = ""
  for(let contractInfo of contratos.inhabilita){
    var additional_class  = ""
    if(
      (["ALCALDE","CONCEJO"].includes(data.cargo)&&
      normalizeAndCompareStrings(contractInfo.departamento,data.departamento) &&
      normalizeAndCompareStrings(contractInfo.ciudad, data.municipio))
       ||
       (["GOBERNADOR","ASAMBLEA"].includes(data.cargo) && 
       normalizeAndCompareStrings(contractInfo.departamento,data.departamento)) ){
       additional_class = "highlight_contract"
    }
    s = s + `
      <div class="contract-details ${additional_class}">
          <p><strong>Ciudad:</strong> ${contractInfo.ciudad}</p>
          <p><strong>Departamento:</strong> ${contractInfo.departamento}</p>
          <p><strong>Fecha de Fin del Contrato:</strong> ${contractInfo.fecha_de_fin_del_contrato}</p>
          <p><strong>Fecha de Firma:</strong> ${contractInfo.fecha_de_firma}</p>
          <p><strong>ID de Contrato:</strong> ${contractInfo.id_contrato}</p>
          <p><strong>Modalidad de Contratación:</strong> ${contractInfo.modalidad_de_contratacion}</p>
          <p><strong>Nombre de Entidad:</strong> ${contractInfo.nombre_entidad}</p>
          <p><strong>Objeto del Contrato:</strong> ${contractInfo.objeto_del_contrato}</p>
          <p><strong>Tipo de Contrato:</strong> ${contractInfo.tipo_de_contrato}</p>
          <p><strong>URL del Proceso:</strong> <a href="${contractInfo.urlproceso.url}" target="_blank">${contractInfo.urlproceso.url}</a></p>
          <p><strong>Valor del Contrato:</strong> ${contractInfo.valor_del_contrato}</p>
      </div>
      <hr class="solid">
  `;
  }
  return s;
}

function setContratosEntidades(contratos){
  let s = ""

  for(let data of contratos.entities){
    s = s + `
    <div class="contract-details">
    <p><strong>Numero de Contratos:</strong> ${data.Numero_de_Contratos}</p>
    <p><strong>Valor Total:</strong> ${data.Valor_Total}</p>
    <p><strong>Fecha de Firma:</strong> ${data.fecha_de_firma}</p>
    <p><strong>Nombre de Entidad:</strong> ${data.nombre_entidad}</p>
  </div>
  <hr class="solid">
  `;
  }
  return s;
}


function setContratosSimultaneos(contratos){
  openContratosSimultaneos.textContent = contratos.hallazgos.contract_ids.length + " Contratos"

  return `
    <div class="contract-details">
    <p><strong>Contratos que se sobrelapan:</strong> ${contratos.hallazgos.contract_ids.toString().replaceAll(',',' , ')}</p>
    <p><strong>${contratos.hallazgos.message}</strong> </p>
  </div>
  `;
}



function setCandidaturas(data){
 // Accede a la información de candidaturas
  let datosString = data.candidaturas.info;
  if (datosString != null){
    let seccion = document.querySelector('.box.candidate-history');
    let datos = eval('(' + datosString + ')');

    // Convertimos el objeto a un array de entradas (clave-valor)
    let entradas = Object.entries(datos);

    // Iteramos sobre cada entrada (ítem) y extraemos la información
    entradas.forEach(item => {
        let año = item[0];
        let nombre = Object.keys(item[1])[0];
        let valor = item[1][nombre];

         // Creamos un contenedor para los elementos <p>
        let contenedor = document.createElement('div');
        contenedor.style.display = "flex";  // Aseguramos que los elementos <p> estén en línea

        // Creamos los elementos <p> para cada dato
        let pAño = document.createElement('p');
        pAño.textContent = año+ ':';

        let pNombre = document.createElement('p');
        pNombre.textContent = ' '+nombre;
        
        let pValor = document.createElement('p');
        pValor.textContent = valor;

        // Agregamos los elementos <p> al contenedor
        contenedor.appendChild(pAño);
        contenedor.appendChild(pNombre);
        contenedor.appendChild(pValor);

        // Agregamos el contenedor a la sección
        seccion.appendChild(contenedor);
        
    });
  }
 
}

function setDatosPrincipales(data){
  tbDepartamento = document.getElementById('tbDepartamento')
  tbCargo = document.getElementById('tbCargo')
  tbMunicipio = document.getElementById('tbMunicipio')
  tbPartido = document.getElementById('tbPartido')

  tbDepartamento.textContent = data.departamento
  tbCargo.textContent = data.cargo
  tbMunicipio.textContent = data.municipio
  tbPartido.textContent = data.partido
}


function setFuentesText(data){
  fuentes = "<hr class='solid'><ul>"
        for(let d of data){
          fuentes = fuentes + `
          <li><a href='${d.url}' target='_blank'>${d.title}</a></li>
        
        `;
        }
        fuentes=fuentes+`</ul>`;

  return fuentes;
}


function startLoading() {
  loadingIcon.style.visibility = 'visible';
  loadingIcon.style.display = "flex";
  setTimeout(() => {
      loadingIcon.querySelector('p').innerText = "Generando un resumen";
  }, 20000);
}

function stopLoading() {
  loadingIcon.style.visibility = 'hidden';
  loadingIcon.style.display = "none";
}

console.log("opening")

const urlParams = new URLSearchParams(window.location.search);
var candidato = urlParams.get('candidato');
//var candidato = 'JOSE GABRIEL GUERRA MANUYAMA'

console.log(candidato)

const nombreCandidato= document.getElementById("nombre_candidato");

// CAMBIAR TEXTOS
  nombreCandidato.textContent = candidato
  console.log(candidato)
  fetchDataUser()

async function fetchDataUser(){
  try{
    var response = await fetch(`https://pauzca.pythonanywhere.com/consultar/persona?nombre=${candidato}`, 
    {method: 'get', withCredential: true, })
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data)
    setCandidaturas(data)
    setDatosPrincipales(data)
    contratos_inhabilitados_text = setContratosElecciones(data)
    contratos_entidades_text = setContratosEntidades(data.contratos)
    contratos_simultaneos_text = setContratosSimultaneos(data.contratos)

    return data;
  }
  catch (err) {
    console.log(err);
    return err;
  }
  }

  startLoading();

  fetch(`https://pauzca.pythonanywhere.com/resumen?nombre=${candidato.replaceAll(' ','%20')}`)
    .then(response => response.json())
    .then(data2 => {
        // Hide the loading message when the API call finishes successfully
        stopLoading(); 
        console.log(data2[0]);
        data2=data2[0];
        if (data2 && Array.isArray(data2.news)) {
          messageResponse.style.visibility = 'visible';
          messageResponse.style.display = "block";
          messageResponse.textContent = data2.summary;
          fuentes_text = setFuentesText(data2.news);
        } else {
            console.error('Unexpected data format:', data);
            messageResponse.textContent = "Error: Unexpected data format from the API";
        }

    })
    .catch(error => {
        setTimeout(() => { stopLoading(); }, 8000);
        console.error('Error al obtener los datos de la API', error);
        // Hide the loading message even if there's an error
        
        messageResponse.style.visibility = 'visible';
        messageResponse.style.display = "block";
        messageResponse.textContent = "Error al obtener los datos de la API";
    });

  // Attach click event listeners
  openContratosElecciones.addEventListener('click', () =>{
    dialogSpace.innerHTML = contratos_inhabilitados_text;
    openDialog();
  });

openFuentes.addEventListener('click', () =>{
    dialogSpace.innerHTML = fuentes_text;
    openDialog();
  });

  openContratosSimultaneos.addEventListener('click', () =>{
    dialogSpace.innerHTML = contratos_simultaneos_text;
    openDialog();
  });

  openContratosEntidades.addEventListener('click', () =>{
    dialogSpace.innerHTML = contratos_entidades_text;
    openDialog();
  });

  closeButton.addEventListener('click', closeDialog);
  overlay.addEventListener('click', closeDialog);

});


function normalizeAndCompareStrings(str1, str2) {
  // Remove special characters and convert to uppercase
  const normalizedStr1 = str1.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
  const normalizedStr2 = str2.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();

  // Compare the normalized strings
  return normalizedStr1 === normalizedStr2;
}
