// bring in the MongoDB Connection import
import './dbconnection.js';

import User from './user.js';
import express from 'express';
import Service from './service.js';
import Shelter from './shelter.js';

const app = express();  // the actual web server

// port Express will listen on.
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));   // this allows us to work with x-www-url-encoded data (used primarily in JSON Web Token authentication processes)

// Make Express now listen for HTTP traffic
app.listen(port, () => {
    console.log(`Express is now listening for HTTP traffic on port ${port}`);
});

////////////////////////////////////////////////////////////
// define a GET endpoint for retrieving all User documents.
////////////////////////////////////////////////////////////

app.get("/user", passport.authenticate("jwt", { session: false }), async(req, res) => { // Remeber to make your req,res functions async if you are calling any async functions and using await.
    // get all of the User docs from MongoDB
    console.log({ theJWTContents: req.user });
    try {
        let allUserDocs = await User.read();
        // Now send all of those User Document objects to whatever requested this particular url endpoint.
        res.send(allUserDocs);    // objects are already in JSON format, so no need to reformat them.
        // NOTE: REST Architecture requires that all information leaving the System to be in JSON format.
    } catch (err) {
        console.log(err);
        res.send(err);
    }
}); 

// Make an endpoint that returns one User doc, based on id
app.get("/user/:userId", async(req, res) => { // the ":userId" is a url parameter, in this case, the ID of a specific User Document
    try {
        // get the id from the url request
        let id = req.params.userId;
        // Retrieve this one User doc
        let userDocs = await User.read({ _id: id });
        let userDoc = userDocs[0];
        res.send(userDoc);
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

// Make a POST endpoint that will create a User doc
app.post("/user", async(req, res) => {
    try {
        // Parse out all POST data, validate it, and use it to create a new User Document
        // DO some data cleanup.  For production, you MUST do more than this.
        //console.log(`req.body.firstName = ${req.body.firstName}`);
        //console.log(`req.body.lastName = ${req.body.lastName}`);
        //console.log(`req.body = ${req.body}`);
        //for(let [key, value] of Object.entries(req.body)) {
        //    console.log(`req.body[${key}] = ${value}`);
        //}
        if(req.body.firstName 
            && req.body.lastName 
            && req.body.username
            && req.body.password) {    // checking to see if firstName and lastName came in on the POST
                // get the encrpyted password and salt
                let encryptedPasswordAndSalt = await User.generateHash(req.body.password);
                let encryptedPassword = encryptedPasswordAndSalt.encryptedString;
                let salt = encryptedPasswordAndSalt.salt;

            let newUserInfo = { 
                firstName: req.body.firstName, 
                lastName: req.body.lastName,
                username: req.body.username,
                password: encryptedPassword,    // NOTE: we are storing the encrypted form of the password.
                salt: salt
            };

            // Now create the User doc
            let newUser = await User.create(newUserInfo);
            res.send({ message: "User created successfully", newUser });
        }
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

app.post("/user/authenticate", async(req, res) =>{
    // take username and password out of the request body
    try {
        if(req.body.username && req.body.password) {
            let theUsername = req.body.username;
            let thePassword = req.body.password;
            // Now get the User doc that matches with that username
            let theUserDocs = await User.read({ username: theUsername });
            let theUserDoc = theUserDocs[0];    // hopefully, this is the only Document in the User collection with the given username.
            let authResult = await User.authenticate(thePassword, theUserDoc);
            res.send({ auth: authResult });
        }
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

// define a PUT endpoint for updating an existing User document
app.put("/user/:userId", async(req, res) => {
    try {
        // Get the id
        let id = req.params.userId;
        // Now find the one User Doc for this id
        let userDocs = await User.read({ _id: id });
        let userDoc = userDocs[0];
        //console.log(userDoc);
        // update the one User doc
        // Look at the POST req.body for the data used to update this User Document.
        let updateInfo = {};
        if(req.body.firstName) {
            updateInfo["firstName"] = req.body.firstName;
        }
        if(req.body.lastName) {
            updateInfo["lastName"] = req.body.lastName;
        }
        // Now perform the update
        let updatedUserDoc = await User.update(userDoc, updateInfo);
        res.send({ message: "Update User doc a success.", updatedUserDoc });
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

// Make a delete endpoint to delete one User doc
app.delete("/user/:userId", async(req, res) =>{
    try {
        // get the id
        let id = req.params.userId;
        // First find the one User doc
        let userDocs = await User.read({ _id: id });
        let userDoc = userDocs[0];
        // now delete that one doc
        let deletedUserDoc = await User.delete(userDoc);
        res.send({ message: "Delete was a success.", deletedUserDoc });
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

/////////////////////////////////////////////////////////////////////////////////////////////////
//Shelter Endpoints
/////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/shelter", passport.authenticate("jwt", { session: false }),  async(req, res) => { // Remeber to make your req,res functions async if you are calling any async functions and using await.
    // get all of the Shelter docs from MongoDB
    try {
        let allShelterDocs = await Shelter.read();
        // Now send all of those Shelter Document objects to whatever requested this particular url endpoint.
        res.send(allShelterDocs);    // objects are already in JSON format, so no need to reformat them.
        // NOTE: REST Architecture requires that all information leaving the System to be in JSON format.
    } catch (err) {
        console.log(err);
        res.send(err);
    }
}); 

// Make an endpoint that returns one Shelter doc, based on id
app.get("/shelter/:shelterId", async(req, res) => { // the ":shelterId" is a url parameter, in this case, the ID of a specific Shelter Document
    try {
        // get the id from the url request
        let id = req.params.shelterId;
        // Retrieve this one Shelter doc
        let shelterDocs = await Shelter.read({ _id: id });
        let shelterDoc = shelterDocs[0];
        res.send(shelterDoc);
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

// Make a POST endpoint that will create a Shelter doc
app.post("/shelter", async(req, res) => {
    try {
        
        if(req.body.shelterName 
            && req.body.shelterInfo) {
            

            let newShelterInfo = { 
                firstName: req.body.shelterName, 
                lastName: req.body.shelterInfo
            };

            // Now create the Shelter doc
            let newShelter = await Shelter.create(newShelterInfo);
            res.send({ message: "Shelter created successfully", newShelter });
        }
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

// define a PUT endpoint for updating an existing Shelter document
app.put("/shelter/:shelterId", async(req, res) => {
    try {
        // Get the id
        let id = req.params.shelterId;
        // Now find the one Shelter Doc for this id
        let shelterDocs = await Shelter.read({ _id: id });
        let shelterDoc = shelterDocs[0];
        //console.log(shelterDoc);
        // update the one Shelter doc
        // Look at the POST req.body for the data used to update this Shelter Document.
        let updateInfo = {};
        if(req.body.firstName) {
            updateInfo["firstName"] = req.body.firstName;
        }
        if(req.body.lastName) {
            updateInfo["lastName"] = req.body.lastName;
        }
        // Now perform the update
        let updatedShelterDoc = await Shelter.update(shelterDoc, updateInfo);
        res.send({ message: "Update Shelter doc a success.", updatedShelterDoc });
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

// Make a delete endpoint to delete one Shelter doc
app.delete("/people/:shelterId", async(req, res) =>{
    try {
        // get the id
        let id = req.params.shelterId;
        // First find the one Shelter doc
        let shelterDocs = await Shelter.read({ _id: id });
        let shelterDoc = shelterDocs[0];
        // now delete that one doc
        let deletedShelterDoc = await Shelter.delete(shelterDoc);
        res.send({ message: "Delete was a success.", deletedShelterDoc });
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});


//////////////////////////////////////////////////////////////////////////////////////
// Services Endpoints
//////////////////////////////////////////////////////////////////////////////////////

app.get("/service", passport.authenticate("jwt", { session: false }),  async(req, res) => { // Remeber to make your req,res functions async if you are calling any async functions and using await.
    // get all of the Service docs from MongoDB
    try {
        let allServiceDocs = await Service.read();
        // Now send all of those Service Document objects to whatever requested this particular url endpoint.
        res.send(allServiceDocs);    // objects are already in JSON format, so no need to reformat them.
        // NOTE: REST Architecture requires that all information leaving the System to be in JSON format.
    } catch (err) {
        console.log(err);
        res.send(err);
    }
}); 

// Make an endpoint that returns one Service doc, based on id
app.get("/service/:serviceId", async(req, res) => { // the ":serviceId" is a url parameter, in this case, the ID of a specific Service Document
    try {
        // get the id from the url request
        let id = req.params.serviceId;
        // Retrieve this one Service doc
        let serviceDocs = await Service.read({ _id: id });
        let serviceDoc = serviceDocs[0];
        res.send(serviceDoc);
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

// Make a POST endpoint that will create a Service doc
app.post("/service", async(req, res) => {
    try {
        
        if(req.body.serviceName 
            && req.body.serviceDescription) {
            

            let newServiceInfo = { 
                firstName: req.body.serviceName, 
                lastName: req.body.serviceDescription
            };

            // Now create the Service doc
            let newService = await Service.create(newServiceInfo);
            res.send({ message: "Service created successfully", newService });
        }
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

// define a PUT endpoint for updating an existing Service document
app.put("/service/:serviceId", async(req, res) => {
    try {
        // Get the id
        let id = req.params.serviceId;
        // Now find the one service Doc for this id
        let serviceDocs = await Service.read({ _id: id });
        let serviceDoc = serviceDocs[0];
        //console.log(serviceDoc);
        // update the one Service doc
        // Look at the POST req.body for the data used to update this Service Document.
        let updateInfo = {};
        if(req.body.firstName) {
            updateInfo["firstName"] = req.body.firstName;
        }
        if(req.body.lastName) {
            updateInfo["lastName"] = req.body.lastName;
        }
        // Now perform the update
        let updatedServiceDoc = await Service.update(serviceDoc, updateInfo);
        res.send({ message: "Update Service doc a success.", updatedServiceDoc });
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

// Make a delete endpoint to delete one Service doc
app.delete("/people/:serviceId", async(req, res) =>{
    try {
        // get the id
        let id = req.params.serviceId;
        // First find the one Service doc
        let serviceDocs = await Service.read({ _id: id });
        let serviceDoc = serviceDocs[0];
        // now delete that one doc
        let deletedServiceDoc = await Service.delete(serviceDoc);
        res.send({ message: "Delete was a success.", deletedServiceDoc });
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});