import './dbconnection.js'; 
import User from './user.js';


// The Admin Account for the Database
const setup = async() =>{

    let today = Date();

    //fist and Super Admin Account to 
    let adminUser = {
        FirstName: 'Super',
        LastName: 'Admin',
        Organization: 'Code Academy',  
        PhoneNumber: '806-335-5942',        
        Email: 'r0446151@amarillocollege.com',       
        UserType: 'Admin',
        UserId: 'SuperAdmin',
        UserPassword: "", 
        Salt: "",
        LastLogin: today,    
        Disabled: false 
    }

    try{
        //sets up password to be hashed to be stored with salt
        let adminPassword = "CodeAcademyProject";
        let hashPassword = await User.newUserPasswordHash(adminPassword);
        adminUser.UserPassword= hashPassword.encryptedString;
        adminUser.Salt = hashPassword.Salt;

        //actually create the first Admin account 
        let firstAdmin = await User.create(adminUser);

        console.log(`The Admin account has been created with the following (UserId: ${firstAdmin.UserId}) and the following (password = ${adminPassword})`);
    }catch(err){
        console.log(err);
    }
}

setup();