import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
  block: {
    type: String,
    required: true,
  },
  houseNo: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  societyId: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  role: {
    type: String,  // ✅ Define type first
    enum: ["user", "admin", "security"],  // ✅ enum inside the object
    default: "user",  // ✅ Default value set properly
    required: true
  },

  rolePass: {
    type: String,
    validate: {
      validator: function (value) {
        // Require rolePass only if role is "admin" or "security"
        return this.role === "admin" || this.role === "security"
          ? !!value
          : true;
      },
      message: "rolePass is required for admin and security roles",
    },
  },
  name:
  {
    type: String,
    required: true
  }
  ,
  phoneNo: {
    type: String,
    required: true
  },
  phoneNo2: {
    type: String,
    required: false
  }
  ,
  // numberOfVeh : {
  //   type : Number,
  //   required : true
  // },
  // vehicleNo : [
  //   {
  //       type : String,
  //       required : true
  //   }
  // ],
  refreshToken: {
    type: String
  }

},
  {
    timestamps: true
  }
);

// Middleware to hash the password before saving the user to the database.
userSchema.pre("save", async function (next) {
  // The hook executes whenever a save operation is performed on a document of this schema.
  if (!this.isModified("password")) return next()
  // this refers to the document being saved.The modified method checks if the password field has been changed. If the password has not been modified, the middleware skips further operations by calling next().
  this.password = await bcrypt.hash(this.password, 10)
  // The second argument (10) is the salt rounds, which determines the complexity of the hashing process (more rounds = more secure but slower).
  next()
  // This signals that the middleware has completed its task and allows the save operation to proceed.
})

// Schema method to compare the password entered by the user with the hashed password stored in the database.
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password)
  // Here password is the plain text which is inputed by the user and this.password is hashed one . bcrypt.compare ensures the input matches the hashed version securely.
}

// Schema method to generate an access token for the user.A short lived token 
userSchema.methods.generateAccessToken = function () {
  // jwt stands for json web token 
  //General Syntax -->> jwt.sign(payload, secret, options)
  return jwt.sign(
    {
      _id: this._id,
      email: this.email


    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({
    _id: this._id,
  },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
      // { expiresIn: process.env.REFRESH_TOKEN_EXPIRY } specifies the token's expiration time (e.g., 7d for 7 days).
    }
  )
}

export const User = mongoose.model("User", userSchema);