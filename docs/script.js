// DOM ready
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const icon = this.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Language selector
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            const selectedLanguage = this.value;
            // Simuler le changement de langue
            alert(`La langue a été changée en ${this.options[this.selectedIndex].text}. Dans une version réelle, cela chargerait les traductions appropriées.`);
            
            // Ici, vous pourriez charger des traductions via AJAX ou rediriger
            // window.location.href = `?lang=${selectedLanguage}`;
        });
    }
    
    // Animated statistics counter
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (statNumbers.length > 0) {
        // Fonction pour vérifier si un élément est dans la vue
        function isInViewport(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }
        
        // Fonction pour animer les compteurs
        function animateCounters() {
            statNumbers.forEach(stat => {
                if (isInViewport(stat) && !stat.classList.contains('animated')) {
                    const target = parseInt(stat.getAttribute('data-count'));
                    const duration = 2000; // 2 secondes
                    const step = target / (duration / 16); // 60fps
                    let current = 0;
                    
                    stat.classList.add('animated');
                    
                    const timer = setInterval(() => {
                        current += step;
                        if (current >= target) {
                            clearInterval(timer);
                            stat.textContent = target;
                        } else {
                            stat.textContent = Math.floor(current);
                        }
                    }, 16);
                }
            });
        }
        
        // Démarrer l'animation quand la page est chargée
        animateCounters();
        
        // Écouter le défilement pour les éléments qui apparaissent plus tard
        window.addEventListener('scroll', animateCounters);
    }
    
    // Quick help button functionality
    const quickHelpBtn = document.querySelector('.quick-help-btn');
    if (quickHelpBtn) {
        quickHelpBtn.addEventListener('click', function() {
            // Ouvrir le chatbot ou afficher des options rapides
            const helpOptions = [
                "Besoin d'aide immédiate ? Appelez le 138",
                "Signaler une violence",
                "Parler au chatbot",
                "Trouver un centre d'aide"
            ];
            
            let message = "Options d'aide rapide :\n\n";
            helpOptions.forEach((option, index) => {
                message += `${index + 1}. ${option}\n`;
            });
            
            const userChoice = prompt(message + "\nEntrez le numéro de votre choix (1-4) :");
            
            switch(userChoice) {
                case '1':
                    alert("Numéro vert national : 138\nCe service est disponible 24h/24 et 7j/7.");
                    break;
                case '2':
                    window.location.href = 'pages/denonciation.html';
                    break;
                case '3':
                    window.location.href = 'pages/chatbot.html';
                    break;
                case '4':
                    window.location.href = 'pages/annuaire.html';
                    break;
                default:
                    // Ne rien faire si l'utilisateur annule
            }
        });
    }
    
    // Simuler un chatbot simple sur toutes les pages
    function initSimpleChatbot() {
        // Créer l'interface du chatbot si on est sur la page chatbot
        if (window.location.pathname.includes('chatbot.html')) {
            // Ce code sera étendu dans la page chatbot.html
            console.log("Page chatbot détectée");
        } else {
            // Ajouter un bouton flottant de chatbot sur les autres pages
            const chatbotBtn = document.createElement('button');
            chatbotBtn.className = 'chatbot-btn';
            chatbotBtn.innerHTML = '<i class="fas fa-comment"></i>';
            chatbotBtn.setAttribute('aria-label', 'Ouvrir le chatbot');
            chatbotBtn.style.position = 'fixed';
            chatbotBtn.style.bottom = '100px';
            chatbotBtn.style.right = '30px';
            chatbotBtn.style.width = '50px';
            chatbotBtn.style.height = '50px';
            chatbotBtn.style.borderRadius = '50%';
            chatbotBtn.style.backgroundColor = 'var(--accent-color)';
            chatbotBtn.style.color = 'white';
            chatbotBtn.style.border = 'none';
            chatbotBtn.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
            chatbotBtn.style.cursor = 'pointer';
            chatbotBtn.style.zIndex = '100';
            chatbotBtn.style.fontSize = '1.5rem';
            chatbotBtn.style.display = 'flex';
            chatbotBtn.style.alignItems = 'center';
            chatbotBtn.style.justifyContent = 'center';
            
            chatbotBtn.addEventListener('click', function() {
                window.location.href = 'pages/chatbot.html';
            });
            
            document.body.appendChild(chatbotBtn);
        }
    }
    
    initSimpleChatbot();
    
    // Sécurité : Effacer les données du formulaire si l'utilisateur quitte la page
    window.addEventListener('beforeunload', function() {
        // Cette fonction efface les données des formulaires potentiellement sensibles
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            if (form.classList.contains('sensitive-form')) {
                form.reset();
            }
        });
    });
    
    // Notification de confidentialité
    if (!localStorage.getItem('privacyNoticeShown')) {
        setTimeout(() => {
            const privacyNotice = document.createElement('div');
            privacyNotice.className = 'privacy-notice';
            privacyNotice.innerHTML = `
                <div class="privacy-content">
                    <h3><i class="fas fa-shield-alt"></i> Votre sécurité et confidentialité</h3>
                    <p>Ce site respecte votre anonymat. Nous ne collectons pas d'informations personnelles et toutes les données sont chiffrées.</p>
                    <button class="btn btn-primary" id="privacy-understood">J'ai compris</button>
                </div>
            `;
            
            // Styles pour la notification
            privacyNotice.style.position = 'fixed';
            privacyNotice.style.bottom = '20px';
            privacyNotice.style.left = '20px';
            privacyNotice.style.right = '20px';
            privacyNotice.style.maxWidth = '400px';
            privacyNotice.style.backgroundColor = 'white';
            privacyNotice.style.borderRadius = 'var(--border-radius)';
            privacyNotice.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.2)';
            privacyNotice.style.padding = '20px';
            privacyNotice.style.zIndex = '1000';
            privacyNotice.style.borderLeft = '5px solid var(--primary-color)';
            
            document.body.appendChild(privacyNotice);
            
            // Fermer la notification
            document.getElementById('privacy-understood').addEventListener('click', function() {
                privacyNotice.style.display = 'none';
                localStorage.setItem('privacyNoticeShown', 'true');
            });
        }, 3000); // Afficher après 3 secondes
    }
});
