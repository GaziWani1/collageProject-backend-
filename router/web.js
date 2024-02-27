// @agentController
const AgentController = require('../controller/Agentcontroller');

// @userController
const UserController = require('../controller/UserController');

// @adminController
const AdminController = require('../controller/AdminController');

const express = require('express')
const multer = require('multer')
const router = express.Router()

const uuid = require('uuid');

const { route } = require('express/lib/router');


// @use folder for image store
const DIR = './public';

// @image upload
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, DIR);
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuid.v4() + '-' + fileName)
    }
})

// @upload image
var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
})

// @agent api

// @check login or not
router.get('/isAgentlogin', AgentController.isLogin);

// @agent Registration
router.post('/agentRegistration', AgentController.agentRegistration);

// @agent Logins
router.post('/agentLogin', AgentController.agentLogin);


// @get agent
router.get('/getAgent/:agentId', AgentController.getAgent)


// @agent update
router.put('/updateAgent/:id', AgentController.updateProfile)


// @agent logout
router.post('/agentLogout', AgentController.logout);

// @getProperties
router.get('/agentsProperites/:agentId', AgentController.agentProperties);


// @getOneProperties
router.get('/getOneProperites/:id', AgentController.getOneProperty);



// @add property
router.post('/addProperty/:agentId', upload.single('image'), AgentController.addProperty);

// @edit property
router.put('/editProperty/:id', upload.single('image'), AgentController.editProperty);

// @delete Property
router.delete('/deleteProperty/:id', AgentController.deleteProperty);



// @bookedProperties
router.get('/bookedProperties/:agentId', AgentController.bookedProperties);

// @cancel deal
router.get('/cancelDeal/:propid', AgentController.cancelDeal);

// @done deal

router.get('/dealDone/:propid', AgentController.dealDone);


// user apis

// @check login or not
router.get('/isUserlogin', UserController.isLogin);



// @userLogout
router.get('/userLogout', UserController.logout);

// @userSign
router.post('/userSignin', UserController.userSignin)

// @userLogin
router.post('/userLogin', UserController.userLogin)



// @properties
router.get('/properties/:limit/:page', UserController.getAllproperties);

// @searchProperties
router.get('/searchProperty/:address/:type', UserController.searchProperties);

// @properties
router.put('/bookproperties/:id/:userId', UserController.bookProperty);

// @admin routes

// @admin islogin
router.get('/isAdminLogin', AdminController.isLogin);

// @get admin
router.get('/getAdmin',AdminController.admProfile);

// @admin login
router.post('/adminLogin', AdminController.adminLogin);

// @update Admin Profile
router.put('/adminupdateProfile/:id', AdminController.upadminProfile);




// @getUsers
router.get('/getUsers/:limit/:page', AdminController.getAllUsers);

// @getAgents
router.get('/getAgents/:limit/:page', AdminController.getAllAgents)

// @getProperties
router.get('/getprops/:limit/:page', AdminController.getAllproperties)


// @get no. of props
router.get('/getNoprops', AdminController.getNoProperties)

// @get no. of users
router.get('/getNousers', AdminController.getNoUsers)

// @get no. of usagents
router.get('/getNoagents', AdminController.getNoAgents)



// @deleteProperty
router.delete('/deleteProperty/:id', AdminController.deleteProperty);

// @delete user
router.delete('/deleteUser/:id', AdminController.deleteUser);

// @delete agent
router.delete('/deleteAgent/:id', AdminController.deleteAgent);



// @asdmin logout 
router.get('/adminLogout',AdminController.logout)

module.exports = router