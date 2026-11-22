
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { client, db } from "@/lib/mongodb";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    // Assignment rule: minimum 6 characters.
    minPasswordLength: 6,
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
