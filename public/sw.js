self.addEventListener("push", (event) => {

    let data = {};

    try {

        data = event.data
            ? event.data.json()
            : {};

    } catch (error) {

        console.error(
            "❌ Failed to parse push notification:",
            error
        );

    }


    const title =
        data.title || "UniNotes";


const options = {

    body:
        data.body ||
        "You have a new notification.",

    icon: "/images/icon-192.png",
   
    data: {

        url:
            data.url ||
            "/"

    }

};


    event.waitUntil(

        self.registration.showNotification(
            title,
            options
        )

    );

});


// ==========================================
// 🔔 NOTIFICATION CLICK
// ==========================================

self.addEventListener(
    "notificationclick",
    (event) => {

        event.notification.close();


        const targetUrl =
            event.notification?.data?.url ||
            "/";


        event.waitUntil(

            clients
                .matchAll({
                    type: "window",
                    includeUncontrolled: true
                })
                .then((clientList) => {

                    // ------------------------------------------
                    // Find an existing UniNotes tab
                    // ------------------------------------------

                    for (const client of clientList) {

                        if (
                            "focus" in client
                        ) {

                            return client
                                .focus()
                                .then(() => {

                                    if (
                                        "navigate" in client
                                    ) {

                                        return client.navigate(
                                            targetUrl
                                        );

                                    }

                                });

                        }

                    }


                    // ------------------------------------------
                    // No existing tab → open UniNotes
                    // ------------------------------------------

                    if (
                        clients.openWindow
                    ) {

                        return clients.openWindow(
                            targetUrl
                        );

                    }

                })

        );

    }
);