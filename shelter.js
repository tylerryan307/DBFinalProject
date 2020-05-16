import mongoose from "mongoose";
import Entity from "./entity.js";

export default class Shelter extends Entity {
    // define 2 static properties pertaining to the schema and model of this entity type.
    static schema = new mongoose.Schema({

        shelterName: { type: "String", },
        shelterInfo: { type: "String", },
        shelterBedAmount: { type: "Number", },
        userLoggedIn: [{ type: mongoose.Schema.Types.ObjectId, ref: "Shelter"}]
    
    });

    //set the defined schema as a model for Mongoose to use
   
    static model = mongoose.model("Shelter", Shelter.schema, "Shelter");
}