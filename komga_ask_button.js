// ==UserScript==
// @name         Komga Telegram Notification Button
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Add a button to Komga to send a telegram message with the serie name
// @match        YOUR KOMGA URL/*
// @grant        none

// ==/UserScript==

(function() {
    'use strict';

    // Configuration Telegram
    const TELEGRAM_BOT_TOKEN = 'YOUR_BOT_TOKEN';
    const TELEGRAM_CHAT_ID = 'YOUR_CHAT_ID';

    // Fonction pour envoyer un message Telegram
    async function sendTelegramNotification(seriesTitle) {
        try {
            const message = encodeURIComponent(`📚 Série Komga : ${seriesTitle}`);
            const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${message}`;

            const response = await fetch(url, { method: 'GET' });

            if (response.ok) {
                alert('Notification Telegram envoyée avec succès !');
            } else {
                alert('Erreur lors de l\'envoi de la notification Telegram.');
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Une erreur s\'est produite lors de l\'envoi de la notification.');
        }
    }

    // Fonction pour récupérer le titre de la série
    function getSeriesTitle() {
        // Utiliser le titre de la page (ce qui s'affiche dans l'onglet)
        if (document.title) {
            return document.title.trim();
        }

        // Si le titre de la page n'est pas disponible, titre par défaut
        return 'Série Komga';
    }

    // Fonction principale pour ajouter le bouton
    function addTelegramButton() {
        // Trouver l'icône de modification
        const editIcon = document.querySelector('i.mdi-pencil');

        if (editIcon) {
            // Récupérer le titre de la série depuis le titre de la page
            const seriesTitle = getSeriesTitle();

            // Remonter au parent qui est probablement le bouton
            const editButton = editIcon.closest('button');

            if (editButton) {
                // Vérifier si le bouton Telegram n'existe pas déjà
                if (!document.querySelector('.telegram-notification-btn')) {
                    // Créer le bouton Telegram
                    const telegramButton = document.createElement('button');
                    telegramButton.type = 'button';
                    telegramButton.innerHTML = '📨';
                    telegramButton.className = editButton.className + ' telegram-notification-btn';
                    telegramButton.style.marginLeft = '10px';

                    // Ajouter un gestionnaire d'événement
                    telegramButton.addEventListener('click', () => {
                        sendTelegramNotification(seriesTitle);
                    });

                    // Insérer le bouton juste après le bouton Éditer
                    editButton.parentNode.insertBefore(telegramButton, editButton.nextSibling);
                }
            }
        }
    }

    // Initialisation
    function init() {
        // Utiliser MutationObserver pour gérer le chargement dynamique
        const observer = new MutationObserver(() => {
            addTelegramButton();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Lancer l'initialisation
    init();
})();