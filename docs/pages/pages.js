// Script commun pour toutes les pages

document.addEventListener('DOMContentLoaded', function() {
    // Ajouter la classe "sensitive-form" aux formulaires sensibles
    const sensitiveForms = document.querySelectorAll('form');
    sensitiveForms.forEach(form => {
        if (form.id.includes('reporting') || form.id.includes('testimony') || form.id.includes('denonciation')) {
            form.classList.add('sensitive-form');
        }
    });
    
    // Fonction pour générer un ID anonyme
    function generateAnonymousId() {
        return 'anon-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }
    
    // Stocker l'ID anonyme dans localStorage
    if (!localStorage.getItem('anonymousUserId')) {
        localStorage.setItem('anonymousUserId', generateAnonymousId());
    }
    
    // Protection contre la capture d'écran (pour les pages sensibles)
    if (window.location.pathname.includes('denonciation') || 
        window.location.pathname.includes('testimony')) {
        
        // Désactiver le clic droit (pour décourager la capture)
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        });
        
        // Empêcher la copie de texte (optionnel, pour les champs sensibles)
        const sensitiveTextareas = document.querySelectorAll('textarea.sensitive, input.sensitive');
        sensitiveTextareas.forEach(textarea => {
            textarea.addEventListener('copy', function(e) {
                e.preventDefault();
                alert('Pour votre sécurité, la copie est désactivée sur ce champ.');
                return false;
            });
            
            textarea.addEventListener('cut', function(e) {
                e.preventDefault();
                alert('Pour votre sécurité, le couper est désactivé sur ce champ.');
                return false;
            });
        });
    }
    
    // Fonction pour effacer l'historique du navigateur (partiel)
    function clearFormHistory() {
        // Effacer les données des formulaires sensibles
        const forms = document.querySelectorAll('.sensitive-form');
        forms.forEach(form => {
            form.reset();
            
            // Effacer également les valeurs stockées par le navigateur
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.setAttribute('autocomplete', 'off');
                input.setAttribute('aria-autocomplete', 'none');
            });
        });
        
        // Effacer le sessionStorage pour cette page
        sessionStorage.clear();
    }
    
    // Effacer les données lorsque l'utilisateur quitte la page
    window.addEventListener('beforeunload', function() {
        clearFormHistory();
        
        // Pour les pages très sensibles, demander confirmation
        if (window.location.pathname.includes('denonciation')) {
            // Note: dans Chrome, on ne peut plus afficher de messages personnalisés
            return null;
        }
    });
    
    // Fonction pour chiffrer un texte (simulé pour le frontend)
    function simulateEncryption(text) {
        // Dans une vraie application, cela utiliserait Web Crypto API
        // Pour cette démo, on simule juste
        return btoa(encodeURIComponent(text)).split('').reverse().join('');
    }
    
    // Fonction pour déchiffrer (simulé)
    function simulateDecryption(text) {
        try {
            return decodeURIComponent(atob(text.split('').reverse().join('')));
        } catch (e) {
            return text;
        }
    }
    
    // Gestion des sessions anonymes
    const sessionId = 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('currentSession', sessionId);
    
    // Logger les actions importantes (pour le support technique uniquement)
    function logUserAction(action, details = {}) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            sessionId: sessionId,
            anonymousUserId: localStorage.getItem('anonymousUserId'),
            action: action,
            details: details,
            page: window.location.pathname
        };
        
        // Dans une vraie application, cela serait envoyé à un serveur sécurisé
        // Pour cette démo, on stocke localement (limitée)
        const logs = JSON.parse(localStorage.getItem('actionLogs') || '[]');
        logs.push(logEntry);
        
        // Ne garder que les 100 dernières entrées
        if (logs.length > 100) {
            logs.shift();
        }
        
        localStorage.setItem('actionLogs', JSON.stringify(logs));
    }
    
    // Logger les visites de page
    logUserAction('page_visit', {
        referrer: document.referrer,
        screenSize: {
            width: window.screen.width,
            height: window.screen.height
        }
    });
    
    // Logger les soumissions de formulaire
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            const formId = this.id || 'unknown_form';
            const formData = new FormData(this);
            const formValues = {};
            
            // Extraire les valeurs (sans données sensibles)
            for (let [key, value] of formData.entries()) {
                if (!key.includes('password') && !key.includes('secret')) {
                    formValues[key] = value.length > 50 ? value.substring(0, 50) + '...' : value;
                }
            }
            
            logUserAction('form_submission', {
                formId: formId,
                fieldCount: Object.keys(formValues).length
                // Note: dans une vraie application, ne pas logger les valeurs sensibles
            });
        });
    });
    
    // Protection contre les bots et spam
    let lastSubmissionTime = 0;
    const formsWithProtection = document.querySelectorAll('.sensitive-form, #contact-form');
    
    formsWithProtection.forEach(form => {
        form.addEventListener('submit', function(e) {
            const now = Date.now();
            const timeSinceLastSubmission = now - lastSubmissionTime;
            
            // Empêcher les soumissions trop rapides (moins de 5 secondes)
            if (timeSinceLastSubmission < 5000) {
                e.preventDefault();
                alert('Veuillez patienter quelques secondes avant de soumettre à nouveau.');
                return false;
            }
            
            lastSubmissionTime = now;
            
            // Ajouter un honeypot pour les bots
            const honeypot = document.createElement('input');
            honeypot.type = 'text';
            honeypot.name = 'website';
            honeypot.style.display = 'none';
            honeypot.value = '';
            this.appendChild(honeypot);
            
            // Si le honeypot est rempli, c'est probablement un bot
            setTimeout(() => {
                if (honeypot.value !== '') {
                    e.preventDefault();
                    console.log('Bot détecté via honeypot');
                    return false;
                }
            }, 100);
        });
    });
    
    // Fonction pour vérifier la connexion Internet
    function checkInternetConnection() {
        if (!navigator.onLine) {
            const offlineMessage = document.createElement('div');
            offlineMessage.className = 'offline-notice';
            offlineMessage.innerHTML = `
                <div class="offline-content">
                    <i class="fas fa-wifi-slash"></i>
                    <p>Vous êtes hors ligne. Certaines fonctionnalités peuvent être limitées.</p>
                </div>
            `;
            
            // Styles pour le message hors ligne
            offlineMessage.style.position = 'fixed';
            offlineMessage.style.top = '70px';
            offlineMessage.style.left = '0';
            offlineMessage.style.right = '0';
            offlineMessage.style.backgroundColor = 'var(--warning-color)';
            offlineMessage.style.color = 'white';
            offlineMessage.style.padding = '15px';
            offlineMessage.style.textAlign = 'center';
            offlineMessage.style.zIndex = '9999';
            offlineMessage.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            
            document.body.appendChild(offlineMessage);
            
            // Supprimer après 5 secondes
            setTimeout(() => {
                offlineMessage.remove();
            }, 5000);
        }
    }
    
    // Vérifier la connexion au chargement
    checkInternetConnection();
    
    // Écouter les changements de connexion
    window.addEventListener('online', checkInternetConnection);
    window.addEventListener('offline', checkInternetConnection);
    
    // Fonction pour formater les numéros de téléphone
    function formatPhoneNumber(phone) {
        // Format français/international
        const cleaned = ('' + phone).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/);
        if (match) {
            return match[1] + ' ' + match[2] + ' ' + match[3] + ' ' + match[4] + ' ' + match[5];
        }
        return phone;
    }
    
    // Formater tous les numéros de téléphone affichés
    const phoneElements = document.querySelectorAll('.phone-number');
    phoneElements.forEach(el => {
        const original = el.textContent.trim();
        const formatted = formatPhoneNumber(original);
        if (formatted !== original) {
            el.textContent = formatted;
        }
    });
    
    // Gestion des cookies de consentement
    if (!localStorage.getItem('cookiesConsent')) {
        setTimeout(() => {
            const cookieConsent = document.createElement('div');
            cookieConsent.className = 'cookie-consent';
            cookieConsent.innerHTML = `
                <div class="cookie-content">
                    <p>Ce site utilise des cookies nécessaires pour son fonctionnement. Nous ne utilisons pas de cookies de suivi. En utilisant ce site, vous acceptez notre politique de confidentialité.</p>
                    <div class="cookie-actions">
                        <button class="btn btn-primary" id="accept-cookies">
                            J'accepte
                        </button>
                        <button class="btn btn-secondary" id="reject-cookies">
                            Refuser
                        </button>
                    </div>
                </div>
            `;
            
            // Styles pour le consentement aux cookies
            cookieConsent.style.position = 'fixed';
            cookieConsent.style.bottom = '0';
            cookieConsent.style.left = '0';
            cookieConsent.style.right = '0';
            cookieConsent.style.backgroundColor = 'var(--dark-color)';
            cookieConsent.style.color = 'white';
            cookieConsent.style.padding = '20px';
            cookieConsent.style.zIndex = '1000';
            cookieConsent.style.boxShadow = '0 -2px 10px rgba(0,0,0,0.2)';
            
            document.body.appendChild(cookieConsent);
            
            // Gérer les boutons
            document.getElementById('accept-cookies').addEventListener('click', function() {
                localStorage.setItem('cookiesConsent', 'accepted');
                cookieConsent.remove();
            });
            
            document.getElementById('reject-cookies').addEventListener('click', function() {
                localStorage.setItem('cookiesConsent', 'rejected');
                cookieConsent.remove();
                // Dans une vraie application, supprimer les cookies non essentiels
            });
        }, 2000);
    }
    
    // Fonction pour partager la page
    function initShareButtons() {
        const shareButtons = document.querySelectorAll('.share-btn');
        
        if (navigator.share) {
            // Utiliser l'API Web Share si disponible
            shareButtons.forEach(btn => {
                btn.style.display = 'inline-flex';
                btn.addEventListener('click', async () => {
                    try {
                        await navigator.share({
                            title: document.title,
                            text: 'Découvrez la plateforme VBG Bénin',
                            url: window.location.href,
                        });
                    } catch (error) {
                        console.log('Partage annulé:', error);
                    }
                });
            });
        } else {
            // Fallback: copier le lien
            shareButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    const tempInput = document.createElement('input');
                    tempInput.value = window.location.href;
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    document.execCommand('copy');
                    document.body.removeChild(tempInput);
                    
                    // Afficher un message de confirmation
                    const originalText = btn.innerHTML;
                    btn.innerHTML = '<i class="fas fa-check"></i> Lien copié !';
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                    }, 2000);
                });
            });
        }
    }
    
    initShareButtons();
    
    // Animation de chargement
    function showLoading() {
        const loading = document.createElement('div');
        loading.className = 'loading-overlay';
        loading.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-circle-notch fa-spin"></i>
                <p>Chargement...</p>
            </div>
        `;
        
        loading.style.position = 'fixed';
        loading.style.top = '0';
        loading.style.left = '0';
        loading.style.right = '0';
        loading.style.bottom = '0';
        loading.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        loading.style.display = 'flex';
        loading.style.alignItems = 'center';
        loading.style.justifyContent = 'center';
        loading.style.zIndex = '10000';
        
        document.body.appendChild(loading);
        
        return loading;
    }
    
    // Fonction pour masquer le chargement
    function hideLoading(loadingElement) {
        if (loadingElement) {
            loadingElement.remove();
        }
    }
    
    // Utiliser pour les actions longues
    window.showLoading = showLoading;
    window.hideLoading = hideLoading;
});