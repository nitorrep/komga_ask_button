// ==UserScript==
// @name         Komga Telegram Notification Button
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Adds a button to send a Telegram notification next to the Edit button in Komga
// @match        http://192.168.2.92:8086/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Telegram Configuration
    const TELEGRAM_BOT_TOKEN = 'BOT_TOKEN';
    const TELEGRAM_CHAT_ID = 'CHAT_ID';

    // Function to send a Telegram message
    async function sendTelegramNotification(seriesTitle) {
        try {
            const message = encodeURIComponent(`To update : ${seriesTitle}`);
            const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${message}`;

            const response = await fetch(url, { method: 'GET' });

            if (response.ok) {
                alert('Telegram notification sent successfully!');
            } else {
                alert('Error sending Telegram notification.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while sending the notification.');
        }
    }

    // Function to get the series title
    function getSeriesTitle() {
        // Use the page title (what is displayed in the tab)
        if (document.title) {
            return document.title.replace(/^Komga - /, '').trim();
        }

        // Default title if the page title is unavailable
        return 'Komga Series';
    }

    // Main function to add the button
    function addTelegramButton() {
        // Find the edit icon
        const editIcon = document.querySelector('i.mdi-pencil');

        if (editIcon) {
            // Get the series title from the page title
            const seriesTitle = getSeriesTitle();

            // Go up to the parent, which is likely the button
            const editButton = editIcon.closest('button');

            if (editButton) {
                // Check if the Telegram button doesn't already exist
                if (!document.querySelector('.telegram-notification-btn')) {
                    // Create the Telegram button
                    const telegramButton = document.createElement('button');
                    telegramButton.type = 'button';
                    telegramButton.innerHTML = '✉️';
                    telegramButton.className = editButton.className + ' telegram-notification-btn';
                    telegramButton.style.marginLeft = '10px';

                    // Add an event listener
                    telegramButton.addEventListener('click', () => {
                        sendTelegramNotification(seriesTitle);
                    });

                    // Insert the button right after the Edit button
                    editButton.parentNode.insertBefore(telegramButton, editButton.nextSibling);
                }
            }
        }
    }

    // Initialization
    function init() {
        // Use MutationObserver to handle dynamic loading
        const observer = new MutationObserver(() => {
            addTelegramButton();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Start initialization
    init();
})();
