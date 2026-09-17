/**
 * AI Productivity Flow - Progressive Desktop Experience
 * Browser PWA install and web update toast banners have been removed
 * in favor of native Windows (.exe) and macOS (.dmg) desktop packages.
 */
(function () {
  'use strict';
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
      registrations.forEach(function (registration) {
        registration.unregister();
      });
    }).catch(function () {});
  }
})();
