import mongoose from "mongoose";
import Entity from "./entity.js";

export default class Service extends Entity {
    // define 2 static properties pertaining to the schema and model of this entity type.
    static schema = new mongoose.Schema({

        serviceName: { type: "String", },
        serviceDescription: { type: "String", },
        userLoggedIn: [{ type: mongoose.Schema.Types.ObjectId, ref: "User"}]
    
    });

    //set the defined schema as a model for Mongoose to use
   
    static model = mongoose.model("ServicesList", Service.schema, "ServicesList");
}