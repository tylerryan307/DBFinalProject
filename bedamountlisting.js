import mongoose from "mongoose";
import Entity from "./entity.js";

export default class BedAmount extends Entity {
    // define 2 static properties pertaining to the schema and model of this entity type.
    static schema = new mongoose.Schema({

        BedListingAmount: { type: "Number", required: true},
        UpdatedBedAmount: { type: "Number", required: true},
        UpdatingUserID: { type: "String", required: true},
        UpdatingShelterID: { type: "String", required: true},
        UpdatingServiceID: { type: "String", required: true},
    
    });

    //set the defined schema as a model for Mongoose to use
    
    static model = mongoose.model("BedAmount", BedAmount.schema, "BedAmount");
}