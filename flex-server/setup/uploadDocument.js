const fs = require('fs');
const os = require('os')
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Get the host name
const hostname = os.hostname();
console.log(hostname);

switch (hostname) {
    case 'LAPTOP-CGMRD4JG':
        dotenv.config({ path: '../dev.env' });
        break;
    case 'PAAPRIFLEX':
        dotenv.config({ path: '../prod.env' });

    default:
        dotenv.config({ path: '../dev.env' });
}

mongoose.connect(process.env.DATABASE_LOCAL, {
}).then(async (con) => {
    console.log("DB Connection Successfull!");

    const AccountType = require('../modules/accountType/accountTypeModel');
    const accountTypeJSON = JSON.parse(fs.readFileSync(`${__dirname}/accountTypes.json`, 'utf-8'));
    await AccountType.create(accountTypeJSON)
    console.log('\x1b[36m', 'App Navigation Link is added successfully!', '\x1b[0m');

    const Account = require('../modules/account/accountModel');
    const accountJSON = JSON.parse(fs.readFileSync(`${__dirname}/accounts.json`, 'utf-8'));
    await Account.create(accountJSON)
    console.log('\x1b[36m', 'App Navigation Link is added successfully!', '\x1b[0m');


    const App = require('../modules/app/appModel');
    const appJSON = JSON.parse(fs.readFileSync(`${__dirname}/apps.json`, 'utf-8'));
    await App.create(appJSON)
    console.log('\x1b[36m', 'App Navigation Link is added successfully!', '\x1b[0m');

    const AppNavigationLink = require('../modules/appNavigationLink/appNavigationLinkModel');
    const navigationLinkJSON = JSON.parse(fs.readFileSync(`${__dirname}/appnavigationlinks.json`, 'utf-8'));
    await AppNavigationLink.create(navigationLinkJSON)
    console.log('\x1b[36m', 'App Navigation Link is added successfully!', '\x1b[0m');

    const AppNavigationCategory = require('../modules/appNavigationCategory/appNavigationCategoryModel');
    const navigationCategoryJSON = JSON.parse(fs.readFileSync(`${__dirname}/appnavigationcategories.json`, 'utf-8'));
    await AppNavigationCategory.create(navigationCategoryJSON)
    console.log('\x1b[36m', 'App Navigation Category is added successfully!', '\x1b[0m');

    const AppNavigationCenter = require('../modules/appNavigationCenter/appNavigationCenterModel');
    const navigationCenterJSON = JSON.parse(fs.readFileSync(`${__dirname}/appnavigationcenters.json`, 'utf-8'));
    await AppNavigationCenter.create(navigationCenterJSON)
    console.log('\x1b[36m', 'App Navigation Center is added successfully!', '\x1b[0m');

    const Permission = require('../modules/permission/permissionModel')
    const permissionJSON = JSON.parse(fs.readFileSync(`${__dirname}/permissions.json`, 'utf-8'));
    await Permission.create(permissionJSON)
    console.log('\x1b[36m', 'Permission is added successfully!', '\x1b[0m');

    const Role = require('../modules/role/roleModel');
    const roleJSON = JSON.parse(fs.readFileSync(`${__dirname}/roles.json`, 'utf-8'));
    await Role.create(roleJSON)
    console.log('\x1b[36m', 'Role is added successfully!', '\x1b[0m');

    const AppCenter = require('../modules/appCenter/appCenterModel');
    const AppCenterJSON = JSON.parse(fs.readFileSync(`${__dirname}/appcenters.json`, 'utf-8'));
    await AppCenter.create(AppCenterJSON)
    console.log('\x1b[36m', 'App is added successfully!', '\x1b[0m');

    const Employee = require('../modules/employee/employeeModel');
    const employeeJSON = JSON.parse(fs.readFileSync(`${__dirname}/employee.json`, 'utf-8'));
    await Employee.create(employeeJSON)
    console.log('\x1b[36m', 'Default Employee is added successfully!', '\x1b[0m');



});


// IMPORT DATA INTO DB
const importData = async () => {
    try {

        console.log('Data successfully loaded!');
    } catch (err) {
        console.log(err);
    }

};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
    try {

        console.log('Data successfully deleted!');
    } catch (err) {
        console.log(err);
    }
};


if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}