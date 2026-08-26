// ==========================================
// 🔔 SERVICE WORKER REGISTRATION
// ==========================================

if ("serviceWorker" in navigator) {

    window.addEventListener("load", async () => {

        try {

            const registration =
                await navigator.serviceWorker.register("/sw.js");

            console.log(
                "✅ Service Worker registered:",
                registration.scope
            );

            // Check whether notifications
            // are already enabled.
            await checkNotificationStatus();

        } catch (error) {

            console.error(
                "❌ Service Worker registration failed:",
                error
            );

        }

    });

}


// ==========================================
// 🔔 CHECK NOTIFICATION STATUS
// ==========================================

async function checkNotificationStatus() {

    const enableButton =
        document.getElementById(
            "enableNotificationsBtn"
        );


    if (!enableButton) {
        return;
    }


    try {

        // Browser does not support notifications.
        if (!("Notification" in window)) {

            enableButton.remove();

            return;

        }


        // User has already blocked notifications.
        if (
            Notification.permission === "denied"
        ) {

            enableButton.remove();

            return;

        }


        // Permission has not been granted yet.
        if (
            Notification.permission !== "granted"
        ) {

            return;

        }


        // Get the service worker.
        const registration =
            await navigator.serviceWorker.ready;


        // Check whether this browser already
        // has a push subscription.
        const subscription =
            await registration.pushManager.getSubscription();


        if (subscription) {

            console.log(
                "🔔 Push notifications are already enabled."
            );


            // Remove the button completely.
            enableButton.remove();

        }

    } catch (error) {

        console.error(
            "❌ Failed to check notification status:",
            error
        );

    }

}


// ==========================================
// 🔔 ENABLE NOTIFICATIONS
// ==========================================

async function enableNotifications() {

    try {

        // ------------------------------------------
        // Browser support
        // ------------------------------------------

        if (!("Notification" in window)) {

            alert(
                "This browser does not support notifications."
            );

            return;

        }


        // ------------------------------------------
        // Permission already blocked
        // ------------------------------------------

        if (Notification.permission === "denied") {

            alert(
                "Notifications are blocked. Please enable them in your browser settings."
            );

            return;

        }


        // ------------------------------------------
        // Request permission
        // ------------------------------------------

        let permission = Notification.permission;


        if (permission !== "granted") {

            permission =
                await Notification.requestPermission();

        }


        if (permission !== "granted") {

            console.log(
                "🔕 Notification permission was not granted."
            );

            return;

        }


        // ------------------------------------------
        // Get Service Worker
        // ------------------------------------------

        const registration =
            await navigator.serviceWorker.ready;


        // ------------------------------------------
        // Get VAPID public key
        // ------------------------------------------

        const keyResponse =
            await fetch(
                "/notifications/public-key"
            );


        const keyData =
            await keyResponse.json();


        if (!keyResponse.ok || !keyData.publicKey) {

            throw new Error(
                "Unable to retrieve notification configuration."
            );

        }


        const applicationServerKey =
            urlBase64ToUint8Array(
                keyData.publicKey
            );


        // ------------------------------------------
        // Check for existing subscription
        // ------------------------------------------

        let subscription =
            await registration.pushManager.getSubscription();


        // ------------------------------------------
        // Create subscription if needed
        // ------------------------------------------

        if (!subscription) {

            subscription =
                await registration.pushManager.subscribe({

                    userVisibleOnly: true,

                    applicationServerKey

                });

            console.log(
                "🔔 New push subscription created."
            );

        } else {

            console.log(
                "🔔 Existing push subscription found."
            );

        }


        // ------------------------------------------
        // Save subscription to UniNotes
        // ------------------------------------------

        const response =
            await fetch(
                "/notifications/subscribe",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(subscription)

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to save notification subscription."
            );

        }


        console.log(
    "✅ Notifications enabled:",
    data
);


// Remove the Enable Notifications button
// immediately after successful setup.
const enableButton =
    document.getElementById(
        "enableNotificationsBtn"
    );

if (enableButton) {

    enableButton.remove();

}


alert(
    "Notifications enabled successfully!"
);


    } catch (error) {

        console.error(
            "❌ Notification setup failed:",
            error
        );


        alert(
            error.message ||
            "Failed to enable notifications."
        );

    }

}


// ==========================================
// 🔑 BASE64 → UINT8ARRAY
// ==========================================

function urlBase64ToUint8Array(base64String) {

    const padding =
        "=".repeat(
            (4 - base64String.length % 4) % 4
        );


    const base64 =
        (base64String + padding)
            .replace(/-/g, "+")
            .replace(/_/g, "/");


    const rawData =
        window.atob(base64);


    return Uint8Array.from(

        [...rawData].map(
            character =>
                character.charCodeAt(0)
        )

    );

}


// ==========================================
// 🔔 ENABLE BUTTON
// ==========================================

const enableNotificationsBtn =
    document.getElementById(
        "enableNotificationsBtn"
    );


if (enableNotificationsBtn) {

    enableNotificationsBtn.addEventListener(
        "click",
        enableNotifications
    );

}