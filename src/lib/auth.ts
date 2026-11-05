import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || '';

declare global {
  // eslint-disable-next-line no-var
  var _authMongoClient: MongoClient | undefined;
}

let client: MongoClient;
if (process.env.NODE_ENV === 'development') {
  if (!global._authMongoClient) {
    global._authMongoClient = new MongoClient(uri);
  }
  client = global._authMongoClient;
} else {
  client = new MongoClient(uri);
}

const db = client.db('ass');

const getBaseURL = () => {
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL;
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.NODE_ENV === 'production') return 'https://socialwork-kappa.vercel.app';
  return 'http://localhost:3000';
};

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || 'w5h960cVNsWKeAAueYoBxRKkCTeWfVeA',
  baseURL: getBaseURL(),
  trustedOrigins: [
    'http://localhost:3000',
    'https://socialwork-kappa.vercel.app',
    ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
    ...(process.env.NEXT_PUBLIC_APP_URL ? [process.env.NEXT_PUBLIC_APP_URL] : []),
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
    ...(process.env.VERCEL_PROJECT_PRODUCTION_URL ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`] : []),
  ],
  database: mongodbAdapter(db, { client }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID && (process.env.GOOGLE_CLIENT_SECRECT || process.env.GOOGLE_CLIENT_SECRET)
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: (process.env.GOOGLE_CLIENT_SECRECT || process.env.GOOGLE_CLIENT_SECRET) as string,
          },
        }
      : {}),
    ...(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET
      ? {
          facebook: {
            clientId: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
          },
        }
      : {}),
  },
});
