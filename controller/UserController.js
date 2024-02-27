const { userCollection, propertyCollection } = require("../model/model");

class UserController {

    // @Login
    static isLogin = async (req, res) => {
        if (req.cookies.userPayload) { res.send(req.cookies.userPayload) }
        else res.send(false)
    }

    // @logout
    static logout = (req, res) => {
        res.clearCookie('userPayload');
        res.send(true);
    }


    // @UserSignIn
    static userSignin = async (req, res) => {
        try {
            const user = await userCollection.findOne({ email: req.body.email } || { phoneNumber: req.body.phoneNumber });
            if (user) {
                res.send("email or phone is alread in use");
            } else {
                const user = new userCollection({
                    type: req.body.type,
                    fname: req.body.fname,
                    lname: req.body.lname,
                    email: req.body.email,
                    age: req.body.age,
                    phoneNumber: req.body.phoneNumber,
                    password: req.body.password
                })
                const result = await user.save();
                const payload = { type: "user", id: result.id, email: req.body.email }
                res.cookie('userPayload', payload, {
                    expiresIn: 60 * 60 * 24 * 2,
                    httpOnly: true,
                });
                res.send(true)
            }
        } catch (error) {
            res.send(false)
        }

    }

    // @UserLogin
    static userLogin = async (req, res) => {
        const { email, password } = req.body;
        try {
            const user = await userCollection.findOne({ email: email })
            const payload = { type: 'user', id: user.id, name: user.name, email: user.email }
            if (user.password == password && email == user.email) {
                res.cookie('userPayload', payload, { expiresIn: 60 * 60 * 24 * 2, httpOnly: true });
                res.send(user)
            }
            else {
                res.send(false)
            }
        } catch (error) {
            res.send(false)
        }
    }


    // @searchProperties
    static searchProperties = async (req, res) => {
        const p = req.params;
        // console.log(p)
        try {
            const result = await propertyCollection.find({ address: p.address, type: p.type });
            if (result.length == 0) {
                res.send(false)
            } else {
                res.send(result)
            }
        } catch (error) {
            res.send(false)
        }

    }


    // @getAllproperties

    static getAllproperties = async (req, res) => {
        const { limit, page } = req.params;
        const skipIndex = (page - 1) * limit;
        try {
            const props = await propertyCollection.find().sort({ _id: 1 }).limit(limit).skip(skipIndex);
            res.send(props);

        } catch (error) {

        }
    }

    // @BookProperties
    static bookProperty = async (req, res) => {
        const { id, userId } = req.params;
        try {
            const prop = await propertyCollection.findById({ _id: id });
            if (prop.bookedBy) {
                res.send("This property is bookedby some one");
            }
            else {
                const result = await propertyCollection.findByIdAndUpdate({ _id: id }, {
                    bookedBy: userId
                })
                res.send("U will receive phone call or email")
            }

        } catch (error) {
            res.send('property is not booked')
        }
    }

}

module.exports = UserController;