// "type": "module" Must be included in the package.json check file
import mongoose from 'mongoose'; // This is my import from my mongoose package

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema // My Mongoose Schema

// Here are my constants for necessary information
const mongoDBUrl = 'localhost';
const mongoDBPort = '27017'
const mongoDBDatabase = 'CAdatabase'

//Here is my Student Schema
const studentShema = new Schema({
    name: { type: "String", required: true}, // name is required
    address: { type: "String", required: true},
    age: { type: "Number", required: true},
    phone: { type: "Number", }
})

// Here is the Schema as a model in Mongoose
const Student = mongoose.model("Student", studentShema, "Students")

// The Acync Function with the Try Catch in it
const connectToDB = async() => {
    try {
        const connectionInfo = `mongodb://${mongoDBUrl}:${mongoDBPort}/${mongoDBDatabase}`;
        const mongoDBConfigObject = {useNewUrlParser: true, useUnifiedTopology: true}
        await mongoose.connect(connectionInfo, mongoDBConfigObject);
    }
    catch (err) {
        console.log(err); // To display in console the error
    }
}

const getAll = async() => {
    try {
        await Student.find().exec((err, studentCollection) => {
            if(err) {
                console.log(err);
            }
            console.log({ studentCollection })
        })
    }
    catch (err) {
        console.log(err)
    }
}

const getStudentBySearch = async(searchCriteriaObj) => {  // searchCriteriaObj is going to be a JSON object containing the keys and values to search against.
    try {
        return Student.find(searchCriteriaObj).exec();   // return the Promsie that will contain the students searched for.
    }
    catch (err) {
        console.log(err);
    }
}

// Add a new student document
const addStudent = async(studentObj) => { // studentObj is a JSON object conforming to our defined schema
    try {
        const newStudent = new Student(studentObj);  // this creates a new student document based on studentObj, but doesn't add it just yet.
        let savePromise = newStudent.save();   // You don't need this Promise, unless you want to do something based on the completion of the save method.
        // If you do want ot do something based on the save() Promise, use then()
        savePromise.then((newStudentDoc) => {
            console.log(`The Student doc is saved and now has the id of ${newStudentDoc.id} and added to the Student collection.`);
        });
    }
    catch (err) {
        console.log(err);
    }
}

// Update a Student
const updateStudent = async(id) => {   // the id parameter is the exact _id value of the Student document we want to modify
    try {
        // 1.) Find the actual document to modify
        // 2.) change that document
        // 3.) save the modified document
        let foundStudentDoc = await Student.findById(id).exec();  // the await keyword resolves the Promise returned by exec() and gets the actual value out it and stores it in foundStudentDoc
        foundStudentDoc.height = 88;
        let updatePromise = foundStudentDoc.save(); // We really don't need to return this particular Promise returned by save() because it would return what we just updated.
        // If you want something ot happen when this update occurs, use then() on that Promise
        updatePromise.then((theUpdatedStudent) => {
            console.log(`Updated Student doc with id of ${theUpdatedStudent.id}`);
        });
    }
    catch (err) {
        console.log(err);
    }
}

// Delete a student
const deleteStudent = async(theActualStudentDocObj) => {  // theActualStudentDocObj is a student document being passed in for deletion
    // delete the passed student document
    try {
        let deletePromise = theActualStudentDocObj.deleteOne();  // this is the Promise for deleting this one student document.
        // if you want ot do something after based on the delete, use then()
        deletePromise.then(() => {
            console.log(`The Student doc with id of ${theActualStudentDocObj.id} is deleted.`);
        });
    }
    catch (err) {
        console.log(err);
    }
}

// async functions can be called in the top-level of your code, but they CANNOT USE await.
// To get around that, create an entry point function that is async and then call your other async functions in that.
const main = async() => {
    // Call your other async functions here.
    // You can also write regular JS code here as well.

    let aNewStudent = {
        name: 'Sam',
        address: '1234 Some St. Amarillo Tx 79109',
        age: 21,
        phone: 8061234567

    };

    try {

        //NOTE: all async functions will always return a Promise, even if the function doesn't actually return any data (The Promise will be empty).
        await connectToDB();    // actually returns and empty Promise, so we don't store it anywhere.

        let searchedStudentArray = await getStudentsBySearch({ name: "Same" });  // thsi does return a Promise with something in it, so we use await to get that data out of it and store it in searchedstudentsArray.
        console.log("Students name found: " + searchedStudentsArray);

        if (searchedStudentsArray.length > 0) {
            await updateStudent(searchedStudentsArray[0].id)
        }

        await addStudent(aNewStudent);

        let studentArray = await getStudentsBySearch({ name: "Sam" });
        console.log(`We will delete the Student doc with id of ${studentArray[0].id}`);
        await deleteStudent(studentArray[0]);

        let allStudentsArray = await getAll();
        console.log("All students: " + allStudentsArray);

    } catch (err) {
        console.log(err);   // It's a good idea to surround any async function calls in a try/catch block
    }
}

// calling the main entry point.
main();