import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
// import { Resend } from "resend";

const client = new MongoClient(process.env.MONGO_URI as string);
const db = client.db();

// const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
    // requireEmailVerification: true,
  },
  //   emailVerification: {
  //     sendVerificationEmail: async ({ user, url }) => {
  //       await resend.emails.send({
  //         from: "AskIt <onboarding@resend.dev>",
  //         to: user.email,
  //         subject: "Verify your email",
  //         html: `
  //         <h2>Verify your email</h2>
  //         <p>Click below:</p>
  //         <a href="${url}">Verify Email</a>
  //       `,
  //       });
  //       console.log(url)
  //     },
  //   },

  user: {
    additionalFields: {
      role: {
        type: ["user", "moderator", "admin"],
        required: false,
        defaultValue: "user", // user | moderator | admin
        input: false
      },
      skills: {
        type: [],
        required: false,
        defaultValue: [],
        input: false
      },
    },
  },

  
  events: {
    async userCreated({ user }: { user: typeof auth.$Infer.Session.user }) {
      await db.collection("users").updateOne(
        { id: user.id },
        {
          $set: {
            role: "user",
            skills: [],
          },
        }
      );
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
