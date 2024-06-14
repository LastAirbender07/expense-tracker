import Transaction from "../models/transaction_model.js";
import User from "../models/user_model.js";

const transactionResolver = {
  Query: {
    transactions: async (_, __, context) => {
      try {
        if (!context.getUser()) throw new Error("Unauthorized");
        const userId = await context.getUser()._id;

        const transactions = await Transaction.find({ userId });
        return transactions;
      } catch (err) {
        console.log("Error in transactions resolver: ", err);
        throw new Error(err.message || "Internal server error");
      }
    },

    transaction: async (_, { transactionId }) => {
      try {
        console.log("transactionId: ", transactionId);
        const transaction = await Transaction.findById(transactionId);
        if (!transaction) console.log("Transaction not found");
        return transaction;
      } catch (err) {
        console.log("Error in transaction resolver: ", err);
        throw new Error(err.message || "Internal server error");
      }
    },

    categoryStatistics: async (_, __, context) => {
      try {
        if (!context.getUser()) throw new Error("Unauthorized");
        const userId = await context.getUser()._id;
        const transactions = await Transaction.find({ userId });
        const categoryMap = {};

        transactions.forEach((transaction) => {
          if (!categoryMap[transaction.category]) {
            categoryMap[transaction.category] = 0;
          }
          categoryMap[transaction.category] += transaction.amount;
        });

        return Object.entries(categoryMap).map(([category, totalAmount]) => ({
          category,
          totalAmount,
        }));
      } catch (err) {
        console.log("Error in categoryStatistics resolver: ", err);
        throw new Error(err.message || "Internal server error");
      }
    },
  },

  Mutation: {
    createTransaction: async (_, { input }, context) => {
      try {
        const newTransaction = new Transaction({
          ...input,
          userId: context.getUser()._id,
        });
        const transaction = await newTransaction.save();
        return transaction;
      } catch (err) {
        console.log("Error in createTransaction resolver: ", err);
        throw new Error(err.message || "Internal server error");
      }
    },

    updateTransaction: async (_, { input }) => {
      try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(
          input.transactionId,
          input,
          { new: true }
        );
        if (!updatedTransaction) throw new Error("Transaction not found");
        return updatedTransaction;
      } catch (err) {
        console.log("Error in updateTransaction resolver: ", err);
        throw new Error(err.message || "Internal server error");
      }
    },

    deleteTransaction: async (_, { transactionId }) => {
      try {
        const deletedTransaction = await Transaction.findByIdAndDelete(
          transactionId
        );
        if (!deletedTransaction) throw new Error("Transaction not found");
        return deletedTransaction;
      } catch (err) {
        console.log("Error in deleteTransaction resolver: ", err);
        throw new Error(err.message || "Internal server error");
      }
    },
  },
};

export default transactionResolver;
