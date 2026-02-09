// Particle Effect for Hero Section (Cyber-style network effect)
function initParticleEffect() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    const particleCount = 80;
    const connectionDistance = 120;
    const particleColors = ['rgba(30, 58, 95, 0.6)', 'rgba(37, 99, 235, 0.4)', 'rgba(51, 65, 85, 0.3)'];

    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        initParticles();
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                color: particleColors[Math.floor(Math.random() * particleColors.length)]
            });
        }
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();

            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[j].x - p.x;
                const dy = particles[j].y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDistance) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(30, 58, 95, ${0.15 * (1 - dist / connectionDistance)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        });

        animationId = requestAnimationFrame(drawParticles);
    }

    resizeCanvas();
    drawParticles();

    window.addEventListener('resize', () => {
        resizeCanvas();
    });
}

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    initParticleEffect();

    // Dynamic copyright year
    const yearEl = document.getElementById('copyrightYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Mobile Navigation Toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.getElementById('header');

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth Scrolling for Navigation Links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Smooth scrolling for all internal links (including buttons)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                
                if (targetSection) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Sticky Header on Scroll
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // Active Navigation Link on Scroll
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.pageYOffset + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);

    // Scroll-based Animations (Fade In)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add fade-in class to elements that should animate
    const animateElements = document.querySelectorAll(
        '.service-card, .feature-item, .portfolio-item, .testimonial-card, .stat-item, .tech-category'
    );
    
    animateElements.forEach(element => {
        element.classList.add('fade-in');
        observer.observe(element);
    });

    // Contact Form Validation
    const contactForm = document.getElementById('contactForm');
    const formInputs = {
        name: document.getElementById('name'),
        email: document.getElementById('email'),
        subject: document.getElementById('subject'),
        message: document.getElementById('message')
    };
    const formErrors = {
        name: document.getElementById('nameError'),
        email: document.getElementById('emailError'),
        subject: document.getElementById('subjectError'),
        message: document.getElementById('messageError')
    };
    const formSuccess = document.getElementById('formSuccess');

    // Validation Functions
    function validateName(name) {
        if (name.trim() === '') {
            return 'Name is required';
        }
        if (name.trim().length < 2) {
            return 'Name must be at least 2 characters';
        }
        return '';
    }

    function validateEmail(email) {
        if (email.trim() === '') {
            return 'Email is required';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return 'Please enter a valid email address';
        }
        return '';
    }

    function validateSubject(subject) {
        if (subject.trim() === '') {
            return 'Subject is required';
        }
        if (subject.trim().length < 3) {
            return 'Subject must be at least 3 characters';
        }
        return '';
    }

    function validateMessage(message) {
        if (message.trim() === '') {
            return 'Message is required';
        }
        if (message.trim().length < 10) {
            return 'Message must be at least 10 characters';
        }
        return '';
    }

    // Real-time validation
    formInputs.name.addEventListener('blur', function() {
        const error = validateName(this.value);
        formErrors.name.textContent = error;
        if (error) {
            this.style.borderColor = '#e74c3c';
        } else {
            this.style.borderColor = '#27ae60';
        }
    });

    formInputs.email.addEventListener('blur', function() {
        const error = validateEmail(this.value);
        formErrors.email.textContent = error;
        if (error) {
            this.style.borderColor = '#e74c3c';
        } else {
            this.style.borderColor = '#27ae60';
        }
    });

    formInputs.subject.addEventListener('blur', function() {
        const error = validateSubject(this.value);
        formErrors.subject.textContent = error;
        if (error) {
            this.style.borderColor = '#e74c3c';
        } else {
            this.style.borderColor = '#27ae60';
        }
    });

    formInputs.message.addEventListener('blur', function() {
        const error = validateMessage(this.value);
        formErrors.message.textContent = error;
        if (error) {
            this.style.borderColor = '#e74c3c';
        } else {
            this.style.borderColor = '#27ae60';
        }
    });

    // Clear error on input
    Object.keys(formInputs).forEach(key => {
        formInputs[key].addEventListener('input', function() {
            formErrors[key].textContent = '';
            this.style.borderColor = 'transparent';
        });
    });

    // Form Submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all fields
        const errors = {
            name: validateName(formInputs.name.value),
            email: validateEmail(formInputs.email.value),
            subject: validateSubject(formInputs.subject.value),
            message: validateMessage(formInputs.message.value)
        };

        // Display errors
        let hasError = false;
        Object.keys(errors).forEach(key => {
            formErrors[key].textContent = errors[key];
            if (errors[key]) {
                hasError = true;
                formInputs[key].style.borderColor = '#e74c3c';
            } else {
                formInputs[key].style.borderColor = '#27ae60';
            }
        });

        // If no errors, submit form
        if (!hasError) {
            // Simulate form submission
            const submitButton = contactForm.querySelector('.btn-submit');
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            setTimeout(() => {
                // Show success message
                formSuccess.classList.add('show');
                
                // Reset form
                contactForm.reset();
                Object.keys(formInputs).forEach(key => {
                    formInputs[key].style.borderColor = 'transparent';
                });

                // Reset button
                submitButton.textContent = 'Send Message';
                submitButton.disabled = false;

                // Hide success message after 5 seconds
                setTimeout(() => {
                    formSuccess.classList.remove('show');
                }, 5000);
            }, 1500);
        }
    });

    // Newsletter Form Submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const submitButton = this.querySelector('.btn-newsletter');
            
            if (emailInput.value.trim() !== '' && validateEmail(emailInput.value) === '') {
                submitButton.textContent = 'Subscribed!';
                submitButton.style.background = '#27ae60';
                
                setTimeout(() => {
                    emailInput.value = '';
                    submitButton.textContent = 'Subscribe';
                    submitButton.style.background = '';
                }, 2000);
            } else {
                emailInput.style.borderColor = '#e74c3c';
                setTimeout(() => {
                    emailInput.style.borderColor = '';
                }, 2000);
            }
        });
    }

    // Counter Animation for Stats
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + '+';
            }
        }, 16);
    }

    // Trigger counter animation when stats section is visible
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.textContent);
                    animateCounter(stat, target);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // Initialize on load
    updateActiveNavLink();
    
    console.log('TechVision Solutions - Website Initialized Successfully');
});

// Page Load Animation
window.addEventListener('load', function() {
    document.querySelector('.hero-content').style.animation = 'fadeInUp 1s ease';
});
