import Transaction from '../models/transaction_model.js';
import User from '../models/user_model.js'
import bcrypt from 'bcryptjs'

const userResolver = {
    Mutation: {
        signUp: async(_, { input }, context) => {
            try{
                const {username, name, password, gender} = input;
                if(!username || !name || !password || !gender){
                    throw new Error("Please fill in all fields")
                }
                const existingUser = await User.findOne({username});
                if(existingUser){
                    throw new Error("User already exists")
                }
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                
                const boyProfilePic = `https://avatar.iran.liara.run/public/boy?name=${username}`;
                const girlProfilePic = `https://avatar.iran.liara.run/public/girl?name=${username}`;

                const newUser = new User({
                    username,
                    name,
                    password: hashedPassword,
                    gender,
                    profilePicture: gender === "male" ? boyProfilePic : girlProfilePic,
                });

                await newUser.save();
                await context.login(newUser);
                return newUser;
            }
            catch(err){
                console.log("Error in signUp resolver: ", err)
                throw new Error(err.message || "Internal server error");
            }
        },

        login: async(_, { input },context) => {
            try{
                const {username, password} = input;
                if(!username || !password){
                    throw new Error("Please fill in all fields")
                }
                const {user} = await context.authenticate("graphql-local", {username, password});

                await context.login(user);
                return user;
            }
            catch(err){
                console.log("Error in login resolver: ", err)
                throw new Error(err.message || "Internal server error");
            }
        },

        logout: async(_, __, context) => {
            try{
                await context.logout();
                context.req.session.destroy((err) => {
                    if(err) throw new Error("Error in destroying session")
                });
                context.res.clearCookie("connect.sid");
                return { message: "Logged out successfully" }
            }
            catch(err){
                console.log("Error in logout resolver: ", err)
                throw new Error(err.message || "Internal server error");
            }
        }
    },

    Query: {
        // users: (_, _, { req, res }) => {
        //     return users
        // },
        authUser: async (_,__,context) => {
            try{
                const user = await context.getUser();
                return user;
            
            }
            catch(err){
                console.log("Error in authUser resolver: ", err)
                throw new Error(err.message || "Internal server error");
            }
        },

        user: async(_, { userId }) => {
            try{
                const user = await User.findById(userId);
                if(!user){
                    throw new Error("User not found")
                }
                return user;
            }
            catch(err){
                console.log("Error in user resolver: ", err)
                throw new Error(err.message || "Internal server error");
            }
        }
        
    },

    User: {
        transactions: async(parent) => {
            try{
                const transactions = await Transaction.find({userId: parent._id});
                return transactions;
            }
            catch(err){
                console.log("Error in user.transactions resolver: ", err)
                throw new Error(err.message || "Internal server error");
            }
        }
    }
}

export default userResolver;