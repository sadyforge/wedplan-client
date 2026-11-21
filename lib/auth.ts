
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGO_DB as string);
const db = client.db("wedplan");

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
  database: mongodbAdapter(db, {
    client,
  }),

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: true,
      },
      subscriptionPlan: {
        type: "string",
        required: false,
        defaultValue: "Free",
        input: false,
      },
      subscriptionStatus: {
        type: "string",
        required: false,
        defaultValue: "inactive",
        input: false,
      },
      subscriptionId: {
        type: "string",
        required: false,
        input: false,
      },
      stripeCustomerId: {
        type: "string",
        required: false,
        input: false,
      },
      subscriptionStartedAt: {
        type: "date",
        required: false,
        input: false,
      },
      subscriptionExpiresAt: {
        type: "date",
        required: false,
        input: false,
      },
      subscriptionCancelledAt: {
        type: "date",
        required: false,
        input: false,
      },
      subscriptionCancelAtPeriodEnd: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
    },
  },
});
