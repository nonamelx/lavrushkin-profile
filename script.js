document.addEventListener('DOMContentLoaded', () => {
    // --- WATCH DOGS LOADER ---
    const loader = document.getElementById('loader');
    const loaderStatus = document.getElementById('loader-status');
    const loaderBar = document.getElementById('loader-bar');
    const statusMessages = [
        "INITIATING KERNEL...",
        "DECRYPTING PROFILES...",
        "LOADING INTERACTIVE UI...",
        "SYSTEM ONLINE.",
        "WELCOME."
    ];
    let currentMessageIndex = 0;
    let progress = 0;

    function updateLoader() {
        if (currentMessageIndex < statusMessages.length) {
            loaderStatus.textContent = statusMessages[currentMessageIndex];
            progress = (currentMessageIndex + 1) / statusMessages.length * 100;
            loaderBar.style.width = `${progress}%`;
            
            if(currentMessageIndex === statusMessages.length - 1) {
                loaderStatus.style.animation = 'text-flicker 1.5s linear forwards';
            }

            currentMessageIndex++;
            // Ускоряем смену сообщений
            setTimeout(updateLoader, 300 + Math.random() * 150);
        } else {
            // Добавляем глитч-эффект перед закрытием
            setTimeout(() => {
                loader.classList.add('glitch');
                // Убираем глитч и скрываем загрузчик
                setTimeout(() => {
                    loader.style.opacity = '0';
                    setTimeout(() => loader.style.display = 'none', 500);
                }, 400); // Длительность глитч-анимации
            }, 500);
        }
    }
    updateLoader();

    // --- SCROLL ANIMATIONS ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.animated-section').forEach(section => {
        observer.observe(section);
    });
    
    // --- SKILLS ANIMATION ---
    const skills = ['Управление VIP-клиентами', 'Разрешение конфликтов', 'Оптимизация процессов', 'Наставничество', 'CRM & Helpdesk', 'Автоматизация (Python)'];
    const skillsGrid = document.getElementById('skills-grid');
    skills.forEach((skill, index) => {
        const skillEl = document.createElement('div');
        skillEl.className = 'glass-card p-6 text-center skill-item';
        skillEl.textContent = skill;
        skillEl.style.animationDelay = `${index * 100}ms`;
        skillsGrid.appendChild(skillEl);
    });

    // --- EMAIL COPY ---
    const emailButton = document.getElementById('email-btn');
    const notificationContainer = document.getElementById('notification-container');
    const email = "who.lx@icloud.com";

    emailButton.addEventListener('click', () => {
        const textarea = document.createElement('textarea');
        textarea.value = email;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        const notification = document.createElement('div');
        notification.className = 'glass-card p-4 notification';
        notification.innerHTML = `
            <p class="font-bold">Успешно скопировано!</p>
            <p class="text-sm text-gray-400">${email}</p>
        `;
        notificationContainer.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    });

    // --- TELEGRAM REDIRECT ---
    const telegramLink = document.getElementById('telegram-link');
    const redirectScreen = document.getElementById('telegram-redirect');

    telegramLink.addEventListener('click', (e) => {
        e.preventDefault();
        redirectScreen.classList.add('visible');
        setTimeout(() => {
            // ИЗМЕНЕНО: Прямое перенаправление вместо window.open для лучшей совместимости
            window.location.href = telegramLink.href;
        }, 2000); // Задержка для полной анимации
    });

    // --- PARTICLE BACKGROUND ---
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray;

    const mouse = { x: null, y: null, radius: (canvas.height/100) * (canvas.width/100) };

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });
    window.addEventListener('mouseout', () => {
        mouse.x = undefined;
        mouse.y = undefined;
    });
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        mouse.radius = (canvas.height/100) * (canvas.width/100);
        init();
    });

    class Particle {
        constructor(x, y, directionX, directionY, size) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = 'rgba(224, 224, 224, 0.1)';
            ctx.fill();
        }
        update() {
            if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
            if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function init() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 12000;
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * .4) - 0.2;
            let directionY = (Math.random() * .4) - 0.2;
            particlesArray.push(new Particle(x, y, directionX, directionY, size));
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0,0,innerWidth, innerHeight);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
    }
    
    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            // Connect particles to each other
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                if (distance < (canvas.width/8) * (canvas.height/8)) {
                    opacityValue = 1 - (distance/20000);
                    ctx.strokeStyle = `rgba(224, 224, 224, ${opacityValue * 0.1})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
            // Connect particles to mouse
            if (mouse.x) {
                let distanceToMouse = ((particlesArray[a].x - mouse.x) * (particlesArray[a].x - mouse.x))
                + ((particlesArray[a].y - mouse.y) * (particlesArray[a].y - mouse.y));
                if(distanceToMouse < mouse.radius * mouse.radius) {
                     opacityValue = 1 - (distanceToMouse / (mouse.radius * mouse.radius));
                     ctx.strokeStyle = `rgba(224, 224, 224, ${opacityValue * 0.3})`;
                     ctx.lineWidth = 1;
                     ctx.beginPath();
                     ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                     ctx.lineTo(mouse.x, mouse.y);
                     ctx.stroke();
                }
            }
        }
    }

    init();
    animate();
});
