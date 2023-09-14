import mongoose from "mongoose";

// Create a shcema
const diarieschema = new mongoose.Schema(
    {
        description:{
            type: String,
            required: true,
        },
        date:{
            type: String,
            required: true,
        },
        tag:{
            type: String,
            required: true,
        },
        mood:{
            type: String,
            required: true,
        },
    },
    {
        toJSON: {
            transform(doc, ret) {
              ret.id = ret._id.toString();
              delete ret._id;
              delete ret.__v;
            },
          },
        timestamps: true,
    },
);

const DiaryModel = mongoose.model("Diary",diarieschema);

export default DiaryModel;