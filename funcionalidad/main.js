class StarWarsInterface {
    constructor() {
        this.currentCategory = 'people';
        this.currentPage = 1;
        this.searchQuery = '';
        this.allData = [];
        this.filteredData = [];
        this.itemsPerPage = 10;
        
        this.init();
    }

    init() {
        this.createStars();
        this.setupEventListeners();
        this.loadData();
    }

    createStars() {
        const starsContainer = document.getElementById('stars');
        const starCount = 100;

        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.animationDelay = Math.random() * 3 + 's';
            starsContainer.appendChild(star);
        }
    }

    setupEventListeners() {
        // Navegación
        document.querySelectorAll('.nav-button').forEach(button => {
            button.addEventListener('click', (e) => {
                this.switchCategory(e.target.dataset.category);
            });
        });

        // Búsqueda
        document.getElementById('searchButton').addEventListener('click', () => {
            this.performSearch();
        });

        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });

        // Paginación
        document.getElementById('prevPage').addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.renderCurrentPage();
            }
        });

        document.getElementById('nextPage').addEventListener('click', () => {
            const maxPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
            if (this.currentPage < maxPages) {
                this.currentPage++;
                this.renderCurrentPage();
            }
        });
    }

    async switchCategory(category) {
        if (category === this.currentCategory) return;

        this.currentCategory = category;
        this.currentPage = 1;
        this.searchQuery = '';
        document.getElementById('searchInput').value = '';

        // Actualizar UI
        document.querySelectorAll('.nav-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');

        const titles = {
            people: 'PERSONAJES',
            planets: 'PLANETAS',
            starships: 'NAVES',
            vehicles: 'VEHÍCULOS',
            species: 'ESPECIES',
            films: 'PELÍCULAS'
        };

        document.getElementById('contentTitle').textContent = titles[category];

        await this.loadData();
    }

    async loadData() {
        this.showLoading();
        
        try {
            const allItems = [];
            let page = 1;
            let hasMore = true;

            while (hasMore) {
                const response = await fetch(`https://swapi.py4e.com/api/${this.currentCategory}/?page=${page}`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                allItems.push(...data.results);
                
                if (data.next) {
                    page++;
                } else {
                    hasMore = false;
                }
            }

            this.allData = allItems;
            this.filteredData = [...this.allData];
            this.renderCurrentPage();
            
        } catch (error) {
            console.error('Error loading data:', error);
            this.showError();
        }
    }

    performSearch() {
        this.searchQuery = document.getElementById('searchInput').value.toLowerCase();
        this.currentPage = 1;

        if (this.searchQuery === '') {
            this.filteredData = [...this.allData];
        } else {
            this.filteredData = this.allData.filter(item => {
                const searchableFields = this.getSearchableFields(item);
                return searchableFields.some(field => 
                    field.toLowerCase().includes(this.searchQuery)
                );
            });
        }

        this.renderCurrentPage();
    }

    getSearchableFields(item) {
        const fields = [];
        for (const key in item) {
            if (typeof item[key] === 'string') {
                fields.push(item[key]);
            } else if (Array.isArray(item[key])) {
                fields.push(...item[key].filter(subItem => typeof subItem === 'string'));
            }
        }
        return fields;
    }

    renderCurrentPage() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const currentItems = this.filteredData.slice(startIndex, endIndex);

        this.renderItems(currentItems);
        this.updatePagination();
    }

    renderItems(items) {
        const container = document.getElementById('contentContainer');
        
        if (items.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 4rem; color: #FFB400;">
                    <h3>🔍 No se encontraron resultados en los archivos imperiales</h3>
                    <p>Intenta con otros términos de búsqueda o explora otra categoría</p>
                    <div style="margin-top: 2rem; opacity: 0.7;">
                        <p>💡 Sugerencias:</p>
                        <ul style="list-style: none; padding: 0; margin-top: 1rem;">
                            <li>• Usa términos más generales</li>
                            <li>• Revisa la ortografía</li>
                            <li>• Prueba en inglés para mejores resultados</li>
                        </ul>
                    </div>
                </div>
            `;
            return;
        }

        const grid = document.createElement('div');
        grid.className = 'items-grid';

        items.forEach((item, index) => {
            const card = this.createItemCard(item, index);
            grid.appendChild(card);
        });

        container.innerHTML = '';
        container.appendChild(grid);

        // Animación de entrada para las tarjetas
        setTimeout(() => {
            const cards = container.querySelectorAll('.item-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }, 50);
    }

    createItemCard(item, index) {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease';

        const title = this.getItemTitle(item);
        const details = this.getItemDetails(item);
        const icon = this.getCategoryIcon();

        card.innerHTML = `
            <div class="item-header">
                <span class="item-icon">${icon}</span>
                <h3 class="item-title">${title}</h3>
            </div>
            <div class="item-details">
                ${details.map(detail => `
                    <div class="item-detail">
                        <span class="detail-label">${detail.label}:</span>
                        <span class="detail-value">${detail.value}</span>
                    </div>
                `).join('')}
            </div>
            <div class="item-footer">
                <span class="item-id">ID: ${this.getItemId(item)}</span>
            </div>
        `;

        // Agregar evento de click para efectos adicionales
        card.addEventListener('click', () => {
            this.showItemDetail(item);
        });

        return card;
    }

    getCategoryIcon() {
        const icons = {
            people: '',
            planets: '',
            starships: '',
            vehicles: '',
            species: '',
            films: ''
        };
        return icons[this.currentCategory] || '';
    }

    getItemId(item) {
        if (item.url) {
            const matches = item.url.match(/\/(\d+)\/$/);
            return matches ? matches[1] : 'N/A';
        }
        return 'N/A';
    }

    getItemTitle(item) {
        return item.name || item.title || 'Desconocido';
    }

    getItemDetails(item) {
        const details = [];
        const fieldsMap = {
            people: [
                { key: 'height', label: 'Altura' },
                { key: 'mass', label: 'Masa' },
                { key: 'hair_color', label: 'Color de cabello' },
                { key: 'skin_color', label: 'Color de piel' },
                { key: 'eye_color', label: 'Color de ojos' },
                { key: 'birth_year', label: 'Año de nacimiento' },
                { key: 'gender', label: 'Género' }
            ],
            planets: [
                { key: 'rotation_period', label: 'Período de rotación' },
                { key: 'orbital_period', label: 'Período orbital' },
                { key: 'diameter', label: 'Diámetro' },
                { key: 'climate', label: 'Clima' },
                { key: 'gravity', label: 'Gravedad' },
                { key: 'terrain', label: 'Terreno' },
                { key: 'population', label: 'Población' }
            ],
            starships: [
                { key: 'model', label: 'Modelo' },
                { key: 'manufacturer', label: 'Fabricante' },
                { key: 'cost_in_credits', label: 'Costo' },
                { key: 'length', label: 'Longitud' },
                { key: 'max_atmosphering_speed', label: 'Velocidad máx.' },
                { key: 'crew', label: 'Tripulación' },
                { key: 'passengers', label: 'Pasajeros' },
                { key: 'starship_class', label: 'Clase' }
            ],
            vehicles: [
                { key: 'model', label: 'Modelo' },
                { key: 'manufacturer', label: 'Fabricante' },
                { key: 'cost_in_credits', label: 'Costo' },
                { key: 'length', label: 'Longitud' },
                { key: 'max_atmosphering_speed', label: 'Velocidad máx.' },
                { key: 'crew', label: 'Tripulación' },
                { key: 'passengers', label: 'Pasajeros' },
                { key: 'vehicle_class', label: 'Clase' }
            ],
            species: [
                { key: 'classification', label: 'Clasificación' },
                { key: 'designation', label: 'Designación' },
                { key: 'average_height', label: 'Altura promedio' },
                { key: 'skin_colors', label: 'Colores de piel' },
                { key: 'hair_colors', label: 'Colores de cabello' },
                { key: 'eye_colors', label: 'Colores de ojos' },
                { key: 'average_lifespan', label: 'Esperanza de vida' },
                { key: 'language', label: 'Idioma' }
            ],
            films: [
                { key: 'episode_id', label: 'Episodio' },
                { key: 'director', label: 'Director' },
                { key: 'producer', label: 'Productor' },
                { key: 'release_date', label: 'Fecha de estreno' },
                { key: 'opening_crawl', label: 'Texto de apertura', truncate: true }
            ]
        };

        const fields = fieldsMap[this.currentCategory] || [];
        
        fields.forEach(field => {
            const value = item[field.key];
            if (value && value !== 'n/a' && value !== 'unknown') {
                let formattedValue = this.formatValue(value, field.key);
                
                // Truncar texto largo si es necesario
                if (field.truncate && formattedValue.length > 100) {
                    formattedValue = formattedValue.substring(0, 100) + '...';
                }
                
                details.push({
                    label: field.label,
                    value: formattedValue
                });
            }
        });

        return details.slice(0, 8); // Limitar a 8 detalles por tarjeta
    }

    formatValue(value, key) {
        if (key === 'cost_in_credits') {
            return value === 'unknown' ? 'Desconocido' : `${parseInt(value).toLocaleString()} créditos`;
        }
        if (key === 'height' || key === 'length') {
            return `${value} cm`;
        }
        if (key === 'mass') {
            return `${value} kg`;
        }
        if (key === 'max_atmosphering_speed') {
            return `${value} km/h`;
        }
        if (key === 'population') {
            return value === 'unknown' ? 'Desconocida' : parseInt(value).toLocaleString();
        }
        if (key === 'diameter') {
            return `${parseInt(value).toLocaleString()} km`;
        }
        return value;
    }

    updatePagination() {
        const pagination = document.getElementById('pagination');
        const maxPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
        
        if (maxPages <= 1) {
            pagination.style.display = 'none';
            return;
        }

        pagination.style.display = 'flex';
        
        const prevButton = document.getElementById('prevPage');
        const nextButton = document.getElementById('nextPage');
        const currentPageSpan = document.getElementById('currentPage');

        prevButton.disabled = this.currentPage === 1;
        nextButton.disabled = this.currentPage === maxPages;
        currentPageSpan.textContent = `${this.currentPage} / ${maxPages}`;

        // Actualizar información adicional
        const totalItems = this.filteredData.length;
        const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
        const endItem = Math.min(this.currentPage * this.itemsPerPage, totalItems);
        
        // Agregar información de paginación si no existe
        let infoSpan = document.getElementById('paginationInfo');
        if (!infoSpan) {
            infoSpan = document.createElement('span');
            infoSpan.id = 'paginationInfo';
            infoSpan.style.cssText = 'color: #FFB400; font-size: 0.9rem; opacity: 0.8;';
            pagination.appendChild(infoSpan);
        }
        infoSpan.textContent = `Mostrando ${startItem}-${endItem} de ${totalItems} registros`;
    }

    showLoading() {
        document.getElementById('contentContainer').innerHTML = `
            <div class="loading">
                <div class="loading-spinner"></div>
                <p>Accediendo a los archivos imperiales...</p>
                <div style="margin-top: 1rem; opacity: 0.7; font-size: 0.9rem;">
                    <p> Conectando con SWAPI</p>
                    <p> Descargando datos de ${this.currentCategory}</p>
                </div>
            </div>
        `;
    }

    showError() {
        document.getElementById('contentContainer').innerHTML = `
            <div style="text-align: center; padding: 4rem; color: #FF6B6B;">
                <h3>⚠️ Error en la conexión imperial</h3>
                <p>No se pudieron cargar los datos desde los servidores imperiales</p>
                <div style="margin-top: 2rem;">
                    <button onclick="location.reload()" style="
                        padding: 1rem 2rem;
                        background: linear-gradient(45deg, #FFD700, #FFB400);
                        color: #000;
                        border: none;
                        border-radius: 8px;
                        font-weight: bold;
                        cursor: pointer;
                        text-transform: uppercase;
                    ">
                         REINTENTAR CONEXIÓN
                    </button>
                </div>
                <div style="margin-top: 1rem; opacity: 0.7; font-size: 0.9rem;">
                    <p> Verifica tu conexión a internet</p>
                    <p> Los servidores SWAPI pueden estar temporalmente inactivos</p>
                </div>
            </div>
        `;
    }

    showItemDetail(item) {
        // Crear un modal simple para mostrar más detalles
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.9); z-index: 1000; display: flex;
            justify-content: center; align-items: center; backdrop-filter: blur(5px);
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: rgba(26, 26, 26, 0.95); border: 2px solid #FFD700;
            border-radius: 15px; padding: 2rem; max-width: 600px; max-height: 80vh;
            overflow-y: auto; color: #FFD700;
        `;
        
        const title = this.getItemTitle(item);
        const allDetails = this.getAllItemDetails(item);
        
        modalContent.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                <h2 style="color: #FFD700; margin: 0;">${this.getCategoryIcon()} ${title}</h2>
                <button id="closeModal" style="
                    background: #FF6B6B; color: white; border: none;
                    border-radius: 50%; width: 30px; height: 30px;
                    cursor: pointer; font-size: 1.2rem;
                ">×</button>
            </div>
            <div style="display: grid; gap: 0.8rem;">
                ${allDetails.map(detail => `
                    <div style="
                        display: flex; justify-content: space-between;
                        padding: 0.5rem 0; border-bottom: 1px solid rgba(255, 180, 0, 0.2);
                    ">
                        <span style="font-weight: bold; color: #FFB400;">${detail.label}:</span>
                        <span style="color: #FFD700; text-align: right; max-width: 60%;">${detail.value}</span>
                    </div>
                `).join('')}
            </div>
        `;
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // Cerrar modal
        const closeModal = () => {
            document.body.removeChild(modal);
        };
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        
        modalContent.querySelector('#closeModal').addEventListener('click', closeModal);
    }

    getAllItemDetails(item) {
        const details = [];
        const skipKeys = ['created', 'edited', 'url'];
        
        for (const key in item) {
            if (skipKeys.includes(key)) continue;
            
            const value = item[key];
            if (value && value !== 'n/a' && value !== 'unknown') {
                const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                let formattedValue = value;
                
                if (Array.isArray(value)) {
                    formattedValue = value.length > 0 ? `${value.length} elementos` : 'Ninguno';
                } else if (typeof value === 'string') {
                    formattedValue = this.formatValue(value, key);
                }
                
                details.push({
                    label,
                    value: formattedValue
                });
            }
        }
        
        return details;
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new StarWarsInterface();
});

// Manejar errores globales
window.addEventListener('error', (e) => {
    console.error('Error global:', e.error);
});

// Manejar errores de promesas no capturadas
window.addEventListener('unhandledrejection', (e) => {
    console.error('Promesa rechazada:', e.reason);
    e.preventDefault();
});