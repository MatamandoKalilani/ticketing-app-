import mongoose from "mongoose";
import { Password } from "../services/password";

// Properties for when i am creating a user
interface UserAttrs {
  email: string;
  password: string;
}

// Properties to describe a User Model
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// Properties to properly define the user document mongoose actually creates
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

// Overall Schema of a User
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

// Hashing Passwords before we save them
userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashedPassword = await Password.toHash(this.get("password"));
    this.set("password", hashedPassword);
  }
  done();
});

// Build function used to create a user (Allows for type checking).
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
