const webpush = require("../services/pushService");
const PushSubscription = require("../models/pushSubscription");
const catchAsync = require("../utils/catchAsync");


// ==========================================
// 🔑 GET VAPID PUBLIC KEY
// ==========================================

exports.getPublicKey = (req, res) => {

    if (!process.env.VAPID_PUBLIC_KEY) {

        return res.status(500).json({
            message:
                "Push notification configuration is missing."
        });

    }


    res.json({

        publicKey:
            process.env.VAPID_PUBLIC_KEY

    });

};


// ==========================================
// 🔔 SAVE PUSH SUBSCRIPTION
// ==========================================

exports.subscribe = catchAsync(async (req, res) => {

    // ------------------------------------------
    // Authentication
    // ------------------------------------------

    if (!req.user) {

        return res.status(401).json({

            message:
                "You must be logged in to enable notifications."

        });

    }


    // ------------------------------------------
    // Validate request body
    // ------------------------------------------

    const {
        endpoint,
        keys
    } = req.body;


    if (
        !endpoint ||
        typeof endpoint !== "string" ||
        !keys ||
        typeof keys !== "object" ||
        !keys.p256dh ||
        !keys.auth
    ) {

        return res.status(400).json({

            message:
                "Invalid push subscription."

        });

    }


    // ------------------------------------------
    // Save / update subscription
    // ------------------------------------------

    const savedSubscription =
        await PushSubscription.findOneAndUpdate(

            {
                endpoint
            },

            {

                user:
                    req.user._id,

                endpoint,

                keys: {

                    p256dh:
                        keys.p256dh,

                    auth:
                        keys.auth

                }

            },

            {

                returnDocument: "after",

                upsert: true,

                runValidators: true

            }

        );


    console.log(
        "🔔 Push subscription saved:"
    );

    console.log(
        "Database:",
        PushSubscription.db.name
    );

    console.log(
        "Collection:",
        PushSubscription.collection.name
    );

    console.log(
        "Document ID:",
        savedSubscription._id
    );


    res.status(201).json({

        message:
            "Push notifications enabled successfully."

    });

});


// ==========================================
// 🧪 TEST NOTIFICATION
// ==========================================

exports.testNotification = catchAsync(async (req, res) => {

    // ------------------------------------------
    // Development-only protection
    // ------------------------------------------

    if (
        process.env.NODE_ENV === "production"
    ) {

        return res.status(404).json({

            message:
                "Test notifications are disabled in production."

        });

    }


    // ------------------------------------------
    // Authentication
    // ------------------------------------------

    if (!req.user) {

        return res.status(401).json({

            message:
                "You must be logged in."

        });

    }


    // ------------------------------------------
    // Find user's subscriptions
    // ------------------------------------------

    const subscriptions =
        await PushSubscription.find({

            user:
                req.user._id

        });


    if (subscriptions.length === 0) {

        return res.status(404).json({

            message:
                "No push subscription found."

        });

    }


    // ------------------------------------------
    // Test notification payload
    // ------------------------------------------

    const payload =
        JSON.stringify({

            title:
                "UniNotes 🔔",

            body:
                "Your push notifications are working successfully! 🎉",

            url:
                "/"

        });


    let sentCount = 0;


    // ------------------------------------------
    // Send notifications
    // ------------------------------------------

    for (
        const subscription of subscriptions
    ) {

        try {

            await webpush.sendNotification(

                {

                    endpoint:
                        subscription.endpoint,

                    keys:
                        subscription.keys

                },

                payload

            );


            sentCount++;


        } catch (error) {

            console.error(

                "❌ Push notification failed:",

                error.message

            );


            // Remove expired subscriptions

            if (
                error.statusCode === 404 ||
                error.statusCode === 410
            ) {

                await PushSubscription.findByIdAndDelete(
                    subscription._id
                );

                console.log(
                    "🗑️ Expired push subscription removed."
                );

            }

        }

    }


    res.json({

        message:
            "Test notification sent.",

        sentCount

    });

});