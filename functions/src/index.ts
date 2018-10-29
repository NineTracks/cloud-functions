import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as cors from "cors";

admin.initializeApp();

const corsHandler = cors({ origin: ["http://localhost:3000", "http://10.122.175.251:3000"], credentials: true });

interface ChannelData {
    name: string,
    peerId: string,
}

// getChannel retrieves channel data via name from Cloud Firestore
export const getChannel = functions.https.onRequest(async (req, res) => {
    return corsHandler(req, res, async () => {
        const channelName = req.query.name;
        const query = await admin.firestore().collection("channels").where("name", "==", channelName).get();
        if (!query.empty) {
            res.json(query.docs[0].data());
        } else {
            res.status(404).send();
        }
    });

});

// createChannel creates a new channel in Cloud Firestore
export const createChannel = functions.https.onRequest(async (req, res) => {
    return corsHandler(req, res, async () => {
        const data = typeof req.body === "string" ? JSON.parse(req.body) : req.body as ChannelData;
        const channel = await admin.firestore().collection("channels").add(data);
        const channelRef = await channel.get();
        res.json(channelRef.data());
    });
});