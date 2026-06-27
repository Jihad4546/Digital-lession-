import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

// Connection await করতে হবে
await client.connect();

const db = client.db(process.env.DB_NAME);

export const auth = betterAuth({
  database: mongodbAdapter(db),  // client আলাদা দেওয়ার দরকার নেই
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENTID,
      clientSecret: process.env.GOOGLE_SECRET,
    },
  },
  user: {
    additionalFields: {
      role: {
        defaultValue: 'user',
      },
      isBlocked: {
        defaultValue: false,
      },
      isPremium: {
        defaultValue: false,
      },
    },
  },
});