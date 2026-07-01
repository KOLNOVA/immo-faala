const CACHE_NAME = "immo-faala-v1";

const urlsToCache = [
  "/",
  "/recherche",
  "/compte/connexion",
  "/compte/inscription",
  "/images/logo-icon.jpg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      );
    })
  );
});

// Notifications push
self.addEventListener("push", (event) => {
  const data = event.data?.json() || {};
  self.registration.showNotification(data.title || "Immo-Faala", {
    body: data.body || "Vous avez une nouvelle notification",
    icon: "/images/logo-icon.jpg",
    badge: "/images/logo-icon.jpg",
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});
