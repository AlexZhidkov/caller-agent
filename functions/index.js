/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from "firebase-functions/v2/https";
import { defineString } from "firebase-functions/params";
import nodemailer from "nodemailer";
import crypto from "crypto";

// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started


const GMAIL_ADDRESS = defineString("GMAIL_ADDRESS");
const GMAIL_APP_PASSWORD = defineString("GMAIL_APP_PASSWORD");
const WEBHOOK_SECRET = defineString("WEBHOOK_SECRET");

export const sendEmailNotificationWebhook = onRequest(async (request, response) => {

    console.log(JSON.stringify(request.body, null, 2));

    const { event, error } = constructWebhookEvent(request, WEBHOOK_SECRET.value());
    if (error) {
        response.status(401).send(error);
        return;
    }

    if (event.type === "post_call_transcription") {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: GMAIL_ADDRESS.value(),
                pass: GMAIL_APP_PASSWORD.value(),
            },
        });

        const emailContent = composeEmail(event.data);
        const clientEmail = request.body.data.agent_id === "agent_01jzmpa3h1fnwsexjzf4zn56xj" ? "regina@footbikes.com.au, " : "";
        const mailOptions = {
            from: `"AI Agent" <${GMAIL_ADDRESS.value()}>`,
            to: clientEmail + "azhidkov@gmail.com",
            subject: emailContent.subject,
            text: emailContent.text,
            html: emailContent.html,
        };

        await transporter.sendMail(mailOptions);
    };
    response.status(200).send("OK");
})

function constructWebhookEvent(req, secret) {
    const body = req.rawBody;
    const signature_header = req.headers["elevenlabs-signature"];
    console.log(signature_header);
    if (!signature_header) {
        return { event: null, error: "Missing signature header" };
    }
    const headers = signature_header.split(",");
    const timestamp = headers.find((e) => e.startsWith("t="))?.substring(2);
    const signature = headers.find((e) => e.startsWith("v0="));
    if (!timestamp || !signature) {
        return { event: null, error: "Invalid signature format" };
    }
    // Validate timestamp
    const reqTimestamp = Number(timestamp) * 1000;
    const tolerance = Date.now() - 30 * 60 * 1000;
    if (reqTimestamp < tolerance) {
        return { event: null, error: "Request expired" };
    }
    // Validate hash
    const message = `${timestamp}.${body}`;
    if (!secret) {
        return { event: null, error: "Webhook secret not configured" };
    }
    const digest =
        "v0=" + crypto.createHmac("sha256", secret).update(message).digest("hex");
    console.log({ digest, signature });
    if (signature !== digest) {
        return { event: null, error: "Invalid signature" };
    }
    const event = JSON.parse(body);
    return { event, error: null };
};

function composeEmail(data) {
    if (!data) {
        console.error("Invalid data for email composition:", data);
        return {
            subject: "AI Agent Engagement",
            text: "No valid data available.",
            html: "<p>No valid data available.</p>",
        };
    }
    // Extract messages from transcript array
    const transcript = data.transcript || [];
    const messages = transcript
        .filter(item => typeof item.message === "string" && item.message.trim().length > 0)
        .map(item => { return `${item.role === 'agent' ? "AI: " : "Customer: "} ${item.message}` })
        .join("\n");

    const localDate = new Date(data.conversation_initiation_client_data?.dynamic_variables?.system__time_utc || Date.now()).toLocaleString("en-AU", { timeZone: "Australia/Perth" });
    console.log(localDate);

    const emailContent = `
        The AI Agent had a conversation ${localDate || ""}\n
        ${data.analysis?.transcript_summary || ""}\n\n
        Full Transcript:\n
        ${messages}   
        \n\nCall duration: ${data.metadata?.call_duration_secs} seconds.\n
        `;

    const htmlContent = `
        <h2>The AI Agent had a conversation ${localDate || ""}</h2>
        <p>${data.analysis?.transcript_summary || ""}</p>
        <h2>Full Transcript:</h2>
        <pre>${messages}</pre>
        <h2>Metadata:</h2>
        <p>Call duration: ${data.metadata?.call_duration_secs} seconds.</p>
        `;

    return {
        subject: data.analysis?.call_summary_title || "AI Agent Engagement",
        text: emailContent,
        html: htmlContent,
    };
}