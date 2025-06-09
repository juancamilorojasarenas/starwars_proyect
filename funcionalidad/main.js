document.addEventListener('DOMContentLoaded', () => {
    // Código existente para video e imagen
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

    // Lógica del buscador
    const form = document.querySelector('.busqueda-combinada');
    const resultsDiv = document.querySelector('.results');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const category = document.getElementById('category').value;
        const searchTerm = document.getElementById('search-term').value.trim();

        if (!category) {
            resultsDiv.innerHTML = '<p class="text-danger">Por favor, selecciona una categoría.</p>';
            return;
        }

        resultsDiv.innerHTML = '<p>Cargando...</p>';
        fetch(`https://swapi.py4e.com/api/${category}/?search=${encodeURIComponent(searchTerm)}`)
            .then(response => response.json())
            .then(data => {
                displayResults(data.results, category, data.count);
            })
            .catch(error => {
                resultsDiv.innerHTML = '<p class="text-danger">Error al cargar los datos. Intenta de nuevo.</p>';
                console.error('Error:', error);
            });
    });

    function displayResults(results, category, totalCount) {
        resultsDiv.innerHTML = '';
        if (results.length === 0) {
            resultsDiv.innerHTML = '<p>No se encontraron resultados.</p>';
            return;
        }

        results.forEach(item => {
            const col = document.createElement('div');
            col.className = 'col-md-4 mb-3';

            const card = document.createElement('div');
            card.className = 'card';

            let content = `<div class="card-body"><h5 class="card-title">${item.name}</h5>`;
            switch (category) {
                case 'people':
                    content += `<p class="card-text">Altura: ${item.height} cm</p>`;
                    content += `<p class="card-text">Peso: ${item.mass} kg</p>`;
                    break;
                case 'planets':
                    content += `<p class="card-text">Diámetro: ${item.diameter} km</p>`;
                    content += `<p class="card-text">Clima: ${item.climate}</p>`;
                    break;
                case 'starships':
                    content += `<p class="card-text">Modelo: ${item.model}</p>`;
                    content += `<p class="card-text">Costo: ${item.cost_in_credits} créditos</p>`;
                    break;
                case 'vehicles':
                    content += `<p class="card-text">Modelo: ${item.model}</p>`;
                    content += `<p class="card-text">Velocidad: ${item.max_atmosphering_speed}</p>`;
                    break;
                case 'species':
                    content += `<p class="card-text">Clasificación: ${item.classification}</p>`;
                    content += `<p class="card-text">Idioma: ${item.language}</p>`;
                    break;
            }
            content += '</div>';
            card.innerHTML = content;

            card.addEventListener('click', () => showModal(item));
            col.appendChild(card);
            resultsDiv.appendChild(col);
        });

        // Mostrar información de paginación
        const showing = Math.min(results.length, 10);
        resultsDiv.insertAdjacentHTML('beforeend', `<p class="text-muted mt-2">Mostrando ${showing} de ${totalCount} resultados</p>`);
    }

    function showModal(item) {
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        modalTitle.textContent = item.name;
        modalBody.innerHTML = '';

        for (const [key, value] of Object.entries(item)) {
            const displayValue = Array.isArray(value) ? value.join(', ') : value;
            const p = document.createElement('p');
            p.innerHTML = `<strong>${key}:</strong> ${displayValue}`;
            modalBody.appendChild(p);
        }

        const modal = new bootstrap.Modal(document.getElementById('myModal'));
        modal.show();
    }
});