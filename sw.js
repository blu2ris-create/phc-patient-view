// Service Worker للتعامل مع إشعارات الدفع والعمل في الخلفية
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// استقبال إشعار النداء من السيرفر وإظهاره بنظام الجوال مباشرة
self.addEventListener('push', (event) => {
    let data = {
        patientNumber: "مراجِع",
        clinicName: "العيادة",
        title: "🔔 وصل دورك الآن في المركز الصحي",
        body: "الرجاء التوجه إلى العيادة فوراً."
    };

    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            data.body = event.data.text();
        }
    }

    const options = {
        body: `رقم التذكرة: ${data.patientNumber} - التوجه إلى: ${data.clinicName}`,
        icon: 'https://github.com/blu2ris-create/clinic-queue-system/blob/main/logo.png%20(2).png?raw=true',
        badge: 'https://github.com/blu2ris-create/clinic-queue-system/blob/main/logo.png%20(2).png?raw=true',
        tag: 'clinic-turn-alert',
        renotify: true,
        requireInteraction: true, // إبقاء الإشعار ظاهراً حتى يتفاعل معه المراجع
        vibrate: [1000, 500, 1000, 500, 1000, 500, 1500], // اهتزاز قوي ومتكرر ينبه الجوال المغلق
        actions: [
            { action: 'open', title: 'فهمت / فتح الشاشة' }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(data.title || "🔔 وصل دورك في المركز", options)
    );
});

// التعامل مع الضغط على الإشعار لفتح الشاشة مباشرة
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (let i = 0; i < clientList.length; i++) {
                let client = clientList[i];
                if ('focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('./');
            }
        })
    );
});
