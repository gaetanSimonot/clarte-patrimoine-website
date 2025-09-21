document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const header = document.querySelector('.header');

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Enhanced header scroll effect with backdrop blur
    let lastScrollTop = 0;
    let ticking = false;

    function updateHeader() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Add scrolled class for enhanced styling
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Hide/show header on scroll
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });

    // Enhanced form submission with better UX
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        const submitBtn = contactForm.querySelector('.btn-primary');
        const originalBtnText = submitBtn.textContent;

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Show loading state
            submitBtn.textContent = 'Envoi en cours...';
            submitBtn.style.opacity = '0.7';
            submitBtn.style.pointerEvents = 'none';

            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);

            // Enhanced form validation
            if (!data.name.trim() || !data.email.trim() || !data.subject || !data.message.trim()) {
                showNotification('Veuillez remplir tous les champs obligatoires.', 'error');
                resetSubmitButton();
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showNotification('Veuillez entrer une adresse email valide.', 'error');
                resetSubmitButton();
                return;
            }

            // Simulate form submission delay
            setTimeout(() => {
                showNotification('Merci pour votre message ! Nous vous recontacterons bientôt.', 'success');
                this.reset();
                resetSubmitButton();
            }, 1500);
        });

        function resetSubmitButton() {
            submitBtn.textContent = originalBtnText;
            submitBtn.style.opacity = '1';
            submitBtn.style.pointerEvents = 'auto';
        }
    }

    // Enhanced notification system
    function showNotification(message, type) {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '✓' : '⚠'}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;

        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? 'linear-gradient(135deg, #059669, #10b981)' : 'linear-gradient(135deg, #dc2626, #ef4444)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            max-width: 400px;
            font-weight: 500;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 4000);
    }

    // Enhanced scroll animations with stagger effect
    const observeElements = document.querySelectorAll('.service-card, .planning-content, .contact-content, .feature');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add stagger delay for service cards
                const delay = entry.target.classList.contains('service-card') ? index * 200 : 0;

                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.classList.add('fade-in-up');
                }, delay);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    observeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });

    // Hero background is now fixed via CSS background-attachment

    // Enhanced navigation active state with smooth transitions
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section');

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // Add loading animation for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.6s ease';

        if (img.complete) {
            img.style.opacity = '1';
        } else {
            img.addEventListener('load', function() {
                this.style.opacity = '1';
            });
        }
    });

    // Add hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('.btn, .service-card, .contact-item, .feature');

    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = this.style.transform.replace('scale(1)', 'scale(1.02)') + ' scale(1.02)';
        });

        element.addEventListener('mouseleave', function() {
            this.style.transform = this.style.transform.replace('scale(1.02)', 'scale(1)');
        });
    });

    // Simple fade-in for hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.style.opacity = '0';

        setTimeout(() => {
            heroTitle.style.opacity = '1';
            heroTitle.style.transition = 'opacity 1s ease';
        }, 300);
    }

    // Contact Modal functionality
    const modal = document.getElementById('contactModal');
    const openModalBtns = document.querySelectorAll('.open-modal');
    const closeModalBtn = document.querySelector('.modal-close');
    const contactFormModal = document.getElementById('contactFormModal');

    // Open modal
    openModalBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal
    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    closeModalBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    // Handle modal form submission
    if (contactFormModal) {
        const submitBtn = contactFormModal.querySelector('.btn-primary');
        const originalBtnText = submitBtn.textContent;

        contactFormModal.addEventListener('submit', function(e) {
            e.preventDefault();

            // Show loading state
            submitBtn.textContent = 'Envoi en cours...';
            submitBtn.style.opacity = '0.7';
            submitBtn.style.pointerEvents = 'none';

            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);

            // Enhanced form validation
            if (!data.name.trim() || !data.email.trim() || !data.subject || !data.message.trim()) {
                showNotification('Veuillez remplir tous les champs obligatoires.', 'error');
                resetSubmitButton();
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showNotification('Veuillez entrer une adresse email valide.', 'error');
                resetSubmitButton();
                return;
            }

            // Simulate form submission delay
            setTimeout(() => {
                showNotification('Merci pour votre demande ! Nous vous recontacterons bientôt.', 'success');
                this.reset();
                resetSubmitButton();
                setTimeout(closeModal, 2000);
            }, 1500);
        });

        function resetSubmitButton() {
            submitBtn.textContent = originalBtnText;
            submitBtn.style.opacity = '1';
            submitBtn.style.pointerEvents = 'auto';
        }
    }

    // Carrousel services mobile avec effet 3D - Version optimisée
    function initServicesCarousel() {
        if (window.innerWidth <= 768) {
            const servicesGrid = document.querySelector('.services-grid');
            const serviceCards = document.querySelectorAll('.service-card');

            if (servicesGrid && serviceCards.length > 0) {
                // Créer les indicateurs
                createServiceIndicators(serviceCards.length);

                // Initialiser le premier service comme actif
                updateActiveService(0);

                // Throttled scroll handler pour de meilleures performances
                let scrollTimeout;
                servicesGrid.addEventListener('scroll', () => {
                    if (scrollTimeout) {
                        clearTimeout(scrollTimeout);
                    }

                    scrollTimeout = setTimeout(() => {
                        const scrollLeft = servicesGrid.scrollLeft;
                        const cardWidth = 296; // 280px + 16px gap
                        const activeIndex = Math.round(scrollLeft / cardWidth);
                        updateActiveService(activeIndex);
                    }, 50);
                });

                // Clic sur indicateurs avec navigation fluide
                setTimeout(() => {
                    const indicators = document.querySelectorAll('.service-indicator');
                    indicators.forEach((indicator, index) => {
                        indicator.addEventListener('click', () => {
                            const cardWidth = 296;
                            servicesGrid.scrollTo({
                                left: index * cardWidth,
                                behavior: 'smooth'
                            });
                        });
                    });
                }, 100);
            }
        }
    }

    function createServiceIndicators(count) {
        const servicesSection = document.querySelector('.services .container');

        // Supprimer les anciens indicateurs
        const existingIndicators = servicesSection.querySelector('.services-indicators');
        if (existingIndicators) {
            existingIndicators.remove();
        }

        // Créer nouveaux indicateurs
        const indicatorsContainer = document.createElement('div');
        indicatorsContainer.className = 'services-indicators';

        for (let i = 0; i < count; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'service-indicator';
            if (i === 0) indicator.classList.add('active');
            indicatorsContainer.appendChild(indicator);
        }

        servicesSection.appendChild(indicatorsContainer);
    }

    function updateActiveService(activeIndex) {
        // Limiter l'index aux bornes valides
        const serviceCards = document.querySelectorAll('.service-card');
        const maxIndex = serviceCards.length - 1;
        activeIndex = Math.max(0, Math.min(activeIndex, maxIndex));

        // Mise à jour des cartes avec RequestAnimationFrame pour fluidité
        requestAnimationFrame(() => {
            serviceCards.forEach((card, index) => {
                card.classList.remove('active', 'adjacent');

                if (index === activeIndex) {
                    card.classList.add('active');
                } else if (Math.abs(index - activeIndex) === 1) {
                    card.classList.add('adjacent');
                }
            });

            // Mise à jour des indicateurs
            const indicators = document.querySelectorAll('.service-indicator');
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === activeIndex);
            });
        });
    }

    // Initialiser avec debounce
    let resizeTimeout;
    function initCarouselWithDebounce() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(initServicesCarousel, 150);
    }

    // Initialisation
    initServicesCarousel();
    window.addEventListener('resize', initCarouselWithDebounce);
});