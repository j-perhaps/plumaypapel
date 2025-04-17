document.addEventListener('DOMContentLoaded', () => {
    const preguntas = document.querySelectorAll('.pregunta-titulo');
    preguntas.forEach(pregunta => {
        pregunta.addEventListener('click', () => {
            const respuesta = pregunta.nextElementSibling;
            respuesta.style.display = respuesta.style.display === 'block' ? 'none' : 'block';
        });
    });

    const buscador = document.getElementById('buscador-faq');
    buscador.addEventListener('input', () => {
        const termino = buscador.value.toLowerCase();
        document.querySelectorAll('.pregunta').forEach(pregunta => {
            const titulo = pregunta.querySelector('.pregunta-titulo').textContent.toLowerCase();
            const respuesta = pregunta.querySelector('.pregunta-respuesta').textContent.toLowerCase();
            pregunta.style.display = (titulo.includes(termino) || respuesta.includes(termino)) ? 'block' : 'none';
        });
    });
});