document.addEventListener("DOMContentLoaded", () => {
    // Cargar el footer (si lo necesitas)
    fetch("footer.html")
        .then(response => {
            if (!response.ok) throw new Error("No se pudo cargar footer.html");
            return response.text();
        })
        .then(data => {
            const footerContainer = document.getElementById("footer-container");
            if (!footerContainer) {
                console.error("No se encontró el contenedor #footer-container");
                return;
            }
            footerContainer.innerHTML = data;
        })
        .catch(error => console.error("Error al cargar el footer:", error));
});