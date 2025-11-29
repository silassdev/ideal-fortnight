import dbConnect from "../lib/dbConnect";
import mongoose from "mongoose";

async function test() {
    try {
        console.log("Connecting to MongoDB...");
        await dbConnect();

        const state = mongoose.connection.readyState;

        const states: Record<number, string> = {
            0: "❌ Disconnected",
            1: "✅ Connected",
            2: "⏳ Connecting",
            3: "🔁 Disconnecting",
        };

        console.log("Mongoose State:", states[state], `(${state})`);

        process.exit(0);
    } catch (err) {
        console.error("❌ DB Connection Error:", err);
        process.exit(1);
    }
}

test();
