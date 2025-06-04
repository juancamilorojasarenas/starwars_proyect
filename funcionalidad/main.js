// main.js

document.addEventListener('DOMContentLoaded', () => {
    const video = document.querySelector('video');
    const img = document.querySelector('img');

    // Función para mostrar el video y reproducirlo
    function showAndPlayVideo() {
        if (img) img.style.display = 'none';       // Ocultamos la imagen
        if (video) {
            video.style.display = 'block';         // Mostramos el video           // Opcional: silenciar para autoplay
            video.play().catch(error => {
                console.error("Error al intentar reproducir el video:", error);
            });
        }
    }

    document.addEventListener('mousemove', (event) => {
        if (video.style.display !== 'block') {
            showAndPlayVideo();
        }
    });
});