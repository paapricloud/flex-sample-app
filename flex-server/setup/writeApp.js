const readline = require('readline');
const fs = require('fs');
const path = require('path');

const toRomanCase = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const baseFolderPath = '../modules/';
const baseRoutesJSONPath = '../routes/baseRoutes.json'
function createFolder(folderName) {
    const folderPath = path.join(baseFolderPath, folderName);

    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
        console.log(`Folder '${folderPath}' created successfully.`);
        return folderPath;
    } else {
        console.log(`Folder '${folderPath}' already exists.Please choose a different name.`);
        return null;
    }
}

function createFile(folderPath, fileName, content) {
    const filePath = path.join(folderPath, fileName);
    fs.writeFileSync(filePath, content);
    console.log(`File '${filePath}' created successfully.`);
}

function addRoute(moduleName) {


    try {
        // Load the JSON file
        const data = fs.readFileSync(baseRoutesJSONPath, 'utf8');
        let jsonData = JSON.parse(data);

        // Add a new object to the JSON array
        const newObj = {
            path: `/${moduleName}`,
            module: `../modules/${moduleName}/${moduleName}Routes`
        };
        jsonData.push(newObj);

        // Convert JSON data back to string
        const newData = JSON.stringify(jsonData, null, 2);

        // Write the modified JSON back to the file
        fs.writeFileSync(baseRoutesJSONPath, newData, 'utf8');

        console.log('New object added and file saved successfully.');
    } catch (error) {
        console.error('Error:', error);
    }

}

function getUserInput() {
    rl.question('Enter the module name (e.g, customer): ', (folderName) => {
        const folderPath = createFolder(folderName);

        if (folderPath) {

            const modelContent = `const mongoose = require('mongoose');

const schema = mongoose.Schema(
    {
        name: {
            type: String,
            unique: true,
            required: [true, "Please enter name."]
        },
        description: String,
        permissionCode: {
            type: String,
            default: "${folderName.toUpperCase()}",
            select: false
        },
        isInactive: {
            type: Boolean,
            default: false
        }
    }, 
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        timestamps: true,
    }
)

const ${toRomanCase(folderName)} = mongoose.model('${toRomanCase(folderName)}', schema);
module.exports = ${toRomanCase(folderName)};`;

            const controllerContent = `const ${toRomanCase(folderName)} = require('./${folderName}Model')
const handlerFactory = require('../handlerFactory/handlerFactory');
const catchAsync = require('../../utils/catchAsync')
    
exports.getAll = handlerFactory.getAll(${toRomanCase(folderName)});
exports.getOne = handlerFactory.getOne(${toRomanCase(folderName)});
exports.createOne = handlerFactory.createOne(${toRomanCase(folderName)});
exports.updateOne = handlerFactory.updateOne(${toRomanCase(folderName)});
exports.deleteOne = handlerFactory.deleteOne(${toRomanCase(folderName)});
    
exports.getList = handlerFactory.listSearch(${toRomanCase(folderName)});
exports.totalCount = handlerFactory.getCount(${toRomanCase(folderName)});
exports.findAll = handlerFactory.findAll(${toRomanCase(folderName)});  
`;
            const routesContent = `const express = require('express');
const ${folderName}Controller = require('./${folderName}Controller');
// const authController = require('../appAuth/authController')
    
const router = express.Router();
    
// Protect all routes after this middleware
// router.use(authController.protect);

    
router.route('/list')
    .get(${folderName}Controller.getList)

router.route('/list/:fieldId')
    .get(${folderName}Controller.getList)

router.route('/flexgrid/count')
    .get(${folderName}Controller.totalCount)
router.route('/flexgrid')
    .get(${folderName}Controller.findAll)
            
router.route('/')
    .get(${folderName}Controller.getAll)
    .post(${folderName}Controller.createOne)
    
router.route('/:id')
    .get(${folderName}Controller.getOne)
    .patch(${folderName}Controller.updateOne)
    .delete(${folderName}Controller.deleteOne)
    
module.exports = router;`;

            createFile(folderPath, folderName + 'Model.js', modelContent);
            createFile(folderPath, folderName + 'Controller.js', controllerContent);
            createFile(folderPath, folderName + 'Routes.js', routesContent);
            addRoute(folderName)

        } else {
            rl.close();
        }
    });
}

getUserInput();