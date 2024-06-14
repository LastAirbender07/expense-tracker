import passport from "passport";
import bcrypt from "bcryptjs";
import { GraphQLLocalStrategy } from "graphql-passport";
import User from "../models/user_model.js";

export const configurePassport = async () => {
    passport.serializeUser((user, done) => {
        console.log("Serialize user");
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        console.log("Deserialize user");
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {   
            done(error);
        }
    });

    passport.use(
        new GraphQLLocalStrategy(async (username, password, done) => {
            try {
                const user = await User.findOne({ username });
                if (!user) {
                    throw new Error("Invalid credentials");
                }
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    throw new Error("Invalid credentials");
                }
                return done(null, user);
            } catch (error) {
                done(error);
            }
        }
    ));
}