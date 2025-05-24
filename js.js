        // Mobile Menu Toggle
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navLinks = document.getElementById('navLinks');
        
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // API Configuration
        const API_BASE_URL = 'https://api.jikan.moe/v4';
        let currentSlide = 0;
        let featuredAnime = [];
        const API_RATE_LIMIT_DELAY = 1000; // Delay 1 detik antara request untuk menghindari rate limit
        let lastRequestTime = 0;

        // Fetch Popular Anime
        async function fetchPopularAnime() {
            try {
                const response = await fetch(`${API_BASE_URL}/top/anime?filter=airing&limit=8`);
                const data = await response.json();
                displayAnime(data.data, 'popularAnime');
            } catch (error) {
                console.error('Error fetching popular anime:', error);
                document.getElementById('popularAnime').innerHTML = `
                    <div class="card" style="text-align: center; padding: 2rem;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: var(--danger-color); margin-bottom: 1rem;"></i>
                        <p>Failed to load popular anime. Please try again later.</p>
                    </div>
                `;
            }
        }

        // Fetch Top Rated Anime
        async function fetchTopAnime() {
            try {
                const response = await fetch(`${API_BASE_URL}/top/anime?limit=8`);
                const data = await response.json();
                displayAnime(data.data, 'topAnime');
            } catch (error) {
                console.error('Error fetching top anime:', error);
                document.getElementById('topAnime').innerHTML = `
                    <div class="card" style="text-align: center; padding: 2rem;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: var(--danger-color); margin-bottom: 1rem;"></i>
                        <p>Failed to load top anime. Please try again later.</p>
                    </div>
                `;
            }
        }

        // Fetch Upcoming Anime
        async function fetchUpcomingAnime() {
            try {
                const response = await fetch(`${API_BASE_URL}/seasons/upcoming?limit=8`);
                const data = await response.json();
                displayAnime(data.data, 'upcomingAnime');
            } catch (error) {
                console.error('Error fetching upcoming anime:', error);
                document.getElementById('upcomingAnime').innerHTML = `
                    <div class="card" style="text-align: center; padding: 2rem;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: var(--danger-color); margin-bottom: 1rem;"></i>
                        <p>Failed to load upcoming anime. Please try again later.</p>
                    </div>
                `;
            }
        }

        // Fetch Featured Anime for Slider
        async function fetchFeaturedAnime() {
            try {
                const response = await fetch(`${API_BASE_URL}/top/anime?filter=airing&limit=5`);
                const data = await response.json();
                featuredAnime = data.data;
                initSlider();
            } catch (error) {
                console.error('Error fetching featured anime:', error);
                document.querySelector('.slider-container').innerHTML = `
                    <div class="card" style="text-align: center; padding: 2rem;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: var(--danger-color); margin-bottom: 1rem;"></i>
                        <p>Failed to load featured anime. Please try again later.</p>
                    </div>
                `;
            }
        }

        // Display Anime in Gallery
        function displayAnime(animeList, containerId) {
            const container = document.getElementById(containerId);
            container.innerHTML = '';
            
            animeList.forEach(anime => {
                const animeCard = document.createElement('div');
                animeCard.className = 'anime-card';
                animeCard.innerHTML = `
                    <img src="${anime.images.jpg.large_image_url}" alt="${anime.title}" class="anime-card-img">
                    <div class="anime-card-content">
                        <h3 class="anime-card-title">${anime.title}</h3>
                        <div class="anime-card-meta">
                            <span>${anime.type} • ${anime.episodes || '?'} eps</span>
                            <span class="anime-card-score"><i class="fas fa-star"></i> ${anime.score || 'N/A'}</span>
                        </div>
                        <p class="anime-card-synopsis">${anime.synopsis ? anime.synopsis.substring(0, 150) + '...' : 'No synopsis available.'}</p>
                        <button class="anime-card-btn" onclick="showAnimeDetails(${anime.mal_id})">View Details</button>
                    </div>
                `;
                container.appendChild(animeCard);
            });
        }

        // Initialize Slider
        function initSlider() {
            const slider = document.getElementById('featuredSlider');
            const dotsContainer = document.getElementById('sliderDots');
            
            slider.innerHTML = '';
            dotsContainer.innerHTML = '';
            
            featuredAnime.forEach((anime, index) => {
                // Create slider item
                const sliderItem = document.createElement('div');
                sliderItem.className = 'slider-item';
                sliderItem.innerHTML = `
                    <img src="${anime.images.jpg.large_image_url}" alt="${anime.title}" class="slider-img">
                    <div class="slider-content">
                        <h2 class="slider-title">${anime.title}</h2>
                        <div class="slider-meta">
                            <span class="slider-meta-item"><i class="fas fa-tv"></i> ${anime.type}</span>
                            <span class="slider-meta-item"><i class="fas fa-star"></i> ${anime.score || 'N/A'}</span>
                            <span class="slider-meta-item"><i class="fas fa-calendar-alt"></i> ${anime.aired?.string || 'Unknown'}</span>
                        </div>
                        <p class="slider-description">${anime.synopsis ? anime.synopsis.substring(0, 200) + '...' : ''}</p>
                        <button class="slider-btn" onclick="showAnimeDetails(${anime.mal_id})">View Details</button>
                    </div>
                `;
                slider.appendChild(sliderItem);
                
                // Create dot
                const dot = document.createElement('div');
                dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
                dot.addEventListener('click', () => {
                    goToSlide(index);
                });
                dotsContainer.appendChild(dot);
            });
            
            // Set initial slide
            goToSlide(0);
        }

        // Go to specific slide
        function goToSlide(index) {
            const slides = document.querySelectorAll('.slider-item');
            const dots = document.querySelectorAll('.slider-dot');
            
            if (index >= slides.length) index = 0;
            if (index < 0) index = slides.length - 1;
            
            currentSlide = index;
            
            slides.forEach((slide, i) => {
                slide.style.transform = `translateX(${100 * (i - index)}%)`;
            });
            
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }

        // Next slide
        function nextSlide() {
            goToSlide(currentSlide + 1);
        }

        // Previous slide
        function prevSlide() {
            goToSlide(currentSlide - 1);
        }

        // Show anime details in modal
        async function showAnimeDetails(animeId) {
            try {
                const modal = document.getElementById('animeModal');
                const response = await fetch(`${API_BASE_URL}/anime/${animeId}/full`);
                const { data } = await response.json();
                
                // Set basic info
                document.getElementById('modalTitle').textContent = data.title;
                document.getElementById('modalBackdrop').src = data.images.jpg.large_image_url;
                document.getElementById('modalPoster').src = data.images.jpg.image_url;
                document.getElementById('modalDescription').textContent = data.synopsis || 'No synopsis available.';
                
                // Set meta info
                const metaContainer = document.getElementById('modalMeta');
                metaContainer.innerHTML = `
                    <div class="modal-meta-item">
                        <i class="fas fa-tv"></i> ${data.type || 'Unknown'}
                    </div>
                    <div class="modal-meta-item">
                        <i class="fas fa-star"></i> ${data.score || 'N/A'}
                    </div>
                    <div class="modal-meta-item">
                        <i class="fas fa-calendar-alt"></i> ${data.aired?.string || 'Unknown date'}
                    </div>
                    <div class="modal-meta-item">
                        <i class="fas fa-clock"></i> ${data.duration || 'Unknown duration'}
                    </div>
                `;
                
                // Set stats
                const statsContainer = document.getElementById('modalStats');
                statsContainer.innerHTML = `
                    <div class="stat-item">
                        <div class="stat-value">${data.rank || 'N/A'}</div>
                        <div class="stat-label">Rank</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${data.popularity || 'N/A'}</div>
                        <div class="stat-label">Popularity</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${data.members?.toLocaleString() || 'N/A'}</div>
                        <div class="stat-label">Members</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${data.favorites?.toLocaleString() || 'N/A'}</div>
                        <div class="stat-label">Favorites</div>
                    </div>
                `;
                
                // Set trailer if available
                const trailerSection = document.getElementById('trailerSection');
                const trailer = document.getElementById('modalTrailer');
                if (data.trailer?.embed_url) {
                    trailer.src = data.trailer.embed_url;
                    trailerSection.style.display = 'block';
                } else {
                    trailerSection.style.display = 'none';
                }
                
                // Show modal
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            } catch (error) {
                console.error('Error fetching anime details:', error);
                alert('Failed to load anime details. Please try again later.');
            }
        }

        // Close modal
        function closeModal() {
            const modal = document.getElementById('animeModal');
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            
            // Pause trailer if it's playing
            const trailer = document.getElementById('modalTrailer');
            trailer.src = '';
        }

        // Event Listeners
        document.getElementById('prevSlide').addEventListener('click', prevSlide);
        document.getElementById('nextSlide').addEventListener('click', nextSlide);
        document.getElementById('modalClose').addEventListener('click', closeModal);
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('animeModal');
            if (e.target === modal) {
                closeModal();
            }
        });

        // Keyboard navigation for slider
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
                nextSlide();
            } else if (e.key === 'ArrowLeft') {
                prevSlide();
            } else if (e.key === 'Escape') {
                closeModal();
            }
        });

        // Auto-advance slider
        let slideInterval = setInterval(nextSlide, 5000);

        // Pause auto-advance when hovering over slider
        const sliderContainer = document.querySelector('.slider-container');
        sliderContainer.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        sliderContainer.addEventListener('mouseleave', () => {
            slideInterval = setInterval(nextSlide, 5000);
        });

        // Initialize the page
        document.addEventListener('DOMContentLoaded', () => {
            fetchPopularAnime();
            fetchTopAnime();
            fetchUpcomingAnime();
            fetchFeaturedAnime();
        });