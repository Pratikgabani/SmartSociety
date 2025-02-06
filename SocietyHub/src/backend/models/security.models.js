import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const securitySchema = new Schema({
societyId : {
    type : String,
    required : true
},
securityPass : {
    type : String,
    required : true
},
email : {
    type : String,
    required : true
},
password : {
    type : String,
    required : true
},
refreshToken: {
    type: String
}

},{timestamps : true})


securitySchema.pre("save" , async function (next){
  // The hook executes whenever a save operation is performed on a document of this schema.
      if(!this.isModified("password")) return next()
  // this refers to the document being saved.The modified method checks if the password field has been changed. If the password has not been modified, the middleware skips further operations by calling next().
      this.password = await bcrypt.hash(this.password , 10)
      // The second argument (10) is the salt rounds, which determines the complexity of the hashing process (more rounds = more secure but slower).
      next()
      // This signals that the middleware has completed its task and allows the save operation to proceed.
  })

  securitySchema.methods.isPasswordCorrect = async function (password){
        return await bcrypt.compare(password , this.password)
        // Here password is the plain text which is inputed by the user and this.password is hashed one . bcrypt.compare ensures the input matches the hashed version securely.
    }

    
    securitySchema.methods.generateAccessToken = function () {
        try {
          return jwt.sign(
            { _id: this._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
          );
        } catch (error) {
          console.error('Error generating access token:', error);
          throw error;
        }
      };
      
      securitySchema.methods.generateRefreshToken = function () {
        try {
          return jwt.sign(
            { _id: this._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
          );
        } catch (error) {
          console.error('Error generating refresh token:', error);
          throw error;
        }
      };
export const Security = mongoose.model("Security" , securitySchema)