document.addEventListener('DOMContentLoaded', () => {
    const video = document.querySelector('video');
    const img = document.querySelector('img');

    let scrollTotal = 0;
    const maxScroll = 300;

    video.style.opacity = '0';
    img.style.opacity = '1';
    video.muted = true;
    video.loop = true;
    video.style.display = 'block'; 

    document.addEventListener('wheel', (e) => {
        scrollTotal += e.deltaY;

        if (scrollTotal < 0) scrollTotal = 0;
        if (scrollTotal > maxScroll) scrollTotal = maxScroll;

        const porcentaje = scrollTotal / maxScroll;
        img.style.opacity = 1 - porcentaje;
        video.style.opacity = porcentaje;

        if (porcentaje >= 1) {
            video.style.zIndex = 1;
            img.style.zIndex = 0;
            video.play().catch(err => console.error("Error reproduciendo video:", err));
        } else if (porcentaje <= 0) {
            video.style.zIndex = 0;
            img.style.zIndex = 1;
            video.pause();
        } else {
            video.style.zIndex = 1;
            img.style.zIndex = 1;
            video.play().catch(() => {});
        }
    });
});

document.querySelector('.busqueda-combinada').addEventListener('submit', (e) => {
    e.preventDefault();
    const filtro = document.querySelector('.filtro').value;
    console.log("Buscar categoría:", filtro);
});


