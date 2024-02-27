const { agentCollection, propertyCollection, userCollection, adminCollection } = require("../model/model");


class AdminController {

    // @check if admin is login
    static isLogin = (req, res) => {
        if (req.cookies.adminPayload) { res.send(req.cookies.adminPayload) }
        else res.send(false)
    }

    // @admin login
    static adminLogin = async (req, res) => {
        const { email, password } = req.body;
        try {
            const admin = await adminCollection.findOne({ email: email });
            // console.log(admin)
            const payload = { type: "admin", id: admin._id, name: admin.name, email: admin.email };
            if (admin.password == password && admin.email == email) {
                res.cookie('adminPayload', payload, { expiresIn: 24 * 60 * 60 * 10, httpOnly: true });
                res.send(admin);
            }
            else {
                res.send(false)
            }
        } catch (error) {
            res.send(false)
        }
    }

    // @admin profile
    static admProfile = async (req, res) => {
        try {

            const result = await adminCollection.find();
            res.send(result)

        } catch (error) {

        }
    }

    // @update profile 
    static upadminProfile = async (req, res) => {
        const id = req.params.id;
        const { name, email, password } = req.body;
        try {
            const result = await adminCollection.findByIdAndUpdate({ _id: id }, {
                name: name,
                email: email,
                password: password
            })
            res.send(true);
        } catch (error) {
            res.send(false);
        }
    }

    // @get Users
    static getAllUsers = async (req, res) => {
        const { limit, page } = req.params;
        const skipIndex = (page - 1) * limit;
        try {
            const users = await userCollection.find().sort({ _id: 1 }).limit(limit).skip(skipIndex);
            res.send(users)
        } catch (error) {
            res.send("something went wrong")
        }

    }

    // @get Users
    static getAllAgents = async (req, res) => {
        const { limit, page } = req.params;
        const skipIndex = (page - 1) * limit;
        try {
            const agents = await agentCollection.find().sort({ _id: 1 }).limit(limit).skip(skipIndex);
            res.send(agents);
        } catch (error) {
            res.send("something went wrong")
        }
    }
    // @get properties
    static getAllproperties = async (req, res) => {
        const { limit, page } = req.params;
        const skipIndex = (page - 1) * limit;
        try {

            const properties = await propertyCollection.find().limit(limit).skip(skipIndex);
            res.send(properties)
        } catch (error) {
            res.send("something went wrong")
        }
    }

    // @no of props
    static getNoProperties = async (req, res) => {
        try {
            const result = await propertyCollection.find().count();
            res.send(result.toString())
        } catch (error) {

        }
    }


    // @no of props
    static getNoUsers = async (req, res) => {
        try {
            const result = await userCollection.find().count();
            res.send(result.toString())
        } catch (error) {

        }
    }

    // @no of users
    static getNoAgents = async (req, res) => {
        try {
            const result = await agentCollection.find().count();
            res.send(result.toString())
        } catch (error) {

        }
    }

    // delete properties
    static deleteProperty = async (req, res) => {
        const id = req.params.id;
        try {
            const result = await propertyCollection.findByIdAndDelete({ _id: id });
            const imageOne = result.image;
            if (result) {
                fs.unlinkSync(path + `/${imageOne}`);
                res.send(true);
            } else {
                res.send(false)
            }
        } catch (error) {
            res.send("something went wrong")
        }
    }

    // delete user
    static deleteUser = async (req, res) => {
        const id = req.params.id;
        try {
            const result = await userCollection.findByIdAndDelete({ _id: id });
            if (result) {
                res.send(true);
            } else {
                res.send(false)
            }
        } catch (error) {
            res.send("something went wrong")
        }
    }

    // @delete Agent
    static deleteAgent = async (req, res) => {
        const id = req.params.id;
        try {
            const result = await agentCollection.findByIdAndDelete({ _id: id });
            if (result) {
                res.send(true);
            } else {
                res.send(false);
            }
        } catch (error) {
            res.send("something went wrong");
        }
    }

    // @adminLogout
    static logout = (req, res) => {
        res.clearCookie('adminPayload');
        res.send(true);
    }

}

module.exports = AdminController