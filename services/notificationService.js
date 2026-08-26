const User = require("../models/user");
const PushSubscription = require("../models/pushSubscription");
const webpush = require("./pushService");

exports.notifyMatchingStudents = async (contribution) => {

    if (process.env.NOTIFICATIONS_ENABLED !== "true") {

        console.log(
            "🔕 Push notifications are disabled."
        );

        return {
            matchedUsers: 0,
            sentCount: 0
        };

    }


    let users;


    // ==========================================
    // 🧪 TEST MODE
    // ==========================================

    if (process.env.NOTIFICATION_TEST_USER_ID) {

        console.log(
            "🧪 Notification test mode: sending only to the test user."
        );


        const testUser =
            await User.findById(
                process.env.NOTIFICATION_TEST_USER_ID
            ).select("_id");


        if (!testUser) {

            console.log(
                "❌ Test user not found."
            );

            return {
                matchedUsers: 0,
                sentCount: 0
            };

        }


        users = [testUser];

    }


    // ==========================================
    // 🚀 PRODUCTION MODE
    // ==========================================

    else {

        users = await User.find({

            institution:
                contribution.institution,

            branch:
                contribution.branch,

            semester:
                contribution.semester,

            role: "student"

        }).select("_id");


        if (users.length === 0) {

            console.log(
                "🔔 No matching students found."
            );

            return {
                matchedUsers: 0,
                sentCount: 0
            };

        }

    }


    const userIds = users.map(
        user => user._id
    );


    // ==========================================
    // 🔔 FIND PUSH SUBSCRIPTIONS
    // ==========================================

    const subscriptions =
        await PushSubscription.find({

            user: {
                $in: userIds
            }

        });


    if (subscriptions.length === 0) {

        console.log(
            "🔔 No push subscriptions found for target users."
        );

        return {
            matchedUsers: users.length,
            sentCount: 0
        };

    }


    // ==========================================
    // 📢 NOTIFICATION CONTENT
    // ==========================================

    const payload = JSON.stringify({

        title:
            `📚 ${contribution.title}`,

        body:
            `New ${contribution.subject} material is available for Semester ${contribution.semester}.`,

        url:
            `/contributions/${contribution._id}`

    });


    let sentCount = 0;


    // ==========================================
    // 🚀 SEND NOTIFICATIONS
    // ==========================================

    for (const subscription of subscriptions) {

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


    console.log(

        `🔔 Notification complete: ${sentCount}/${subscriptions.length} sent.`

    );


    return {

        matchedUsers:
            users.length,

        sentCount

    };

};