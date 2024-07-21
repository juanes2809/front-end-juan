document.addEventListener('DOMContentLoaded', function() {
    const Departamento = localStorage.getItem("Departamento");
    const dep = document.getElementById("Departamento");
    dep.textContent = Departamento

    const cargo = localStorage.getItem("Cargo");
    const carg = document.getElementById("Cargo");
    carg.textContent = cargo.charAt(0).toUpperCase()+ cargo.slice(1);

    const municipio = localStorage.getItem("Municipio");
    const mcipio = document.getElementById("Municipio");
    mcipio.textContent = municipio.charAt(0).toUpperCase()+ municipio.slice(1);
    
});
