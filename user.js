// Represent a User entity.
import mongoose from "mongoose";
import Entity from "./entity.js";
import bcrypt from "bcrypt";


export default class User extends Entity {
    // define 2 static properties pertaining to the schema and model of this entity type.
    static schema = new mongoose.Schema({

        firstName: { type: "String", required: true}, // name is required
        lastName: { type: "String", required: true},
        email: { type: "String", required: true},
        policeId: { type: "String", },
        providerDirector: { type: "String", },
        admin: { type: "String", },
        username: { type: "String" },
        password: { type: "String" },
        salt: { type: "String" },
        searchServices: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
        searchShelters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Shelter" }]
    
    });

    //set the defined schema as a model for Mongoose to use
    //static model = mongoose.model("User", User.schema, "Administration"); // "name of model", schemaObject, "name of collection in DB"
    static model = mongoose.model("User", User.schema, "User");

    static async generateHash(theString) {
        // use bcrypt to first generate a part of the encryption: the salt
        // THe value passe in to genSalt() is the number of rounds brcypt will use to generate the 
        // salt value.  10 rounds is recommended.
        const saltRounds = 10;
        let salt = await bcrypt.genSalt(saltRounds);    // get the salt value out of the returned Promise from genSalt().
        // Use the generated salt for encrpyting the passed in string.
        let hash = await bcrypt.hash(theString, salt);  // Does the actual encryption of the given string
        return { salt: salt, encryptedString: hash };
    }

    // make a method that can check to see if the user provided the correct password and username
    static async authenticate(givenPassword, theUserDoc) {
        // assume givenPassword is what the user typed in, and assume theUserDoc is the actual User Document found for
        // the given username.  NOTE: make sure that you enforce unique usernames.
        let salt = theUserDoc.salt;
        let encryptedPassword = theUserDoc.password;

        const match = await bcrypt.compare(givenPassword, encryptedPassword);
        return match;   // true for a match, false if they don't match
    }
}