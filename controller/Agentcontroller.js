const { agentCollection, propertyCollection, userCollection } = require("../model/model");

// @require fs module for deleteing image
const fs = require('fs');

// @set the path fro deleting image
const path = './public/';

class AgentController {

    static isLogin = (req, res) => {
        if (req.cookies.agentPayload) { res.send(req.cookies.agentPayload) }
        else res.send(false)
    }

    //@agent register
    static agentRegistration = async (req, res) => {
        try {
            const user = await agentCollection.findOne({ email: req.body.email } || { phoneNumber: req.body.phoneNumber });
            if (user) {
                res.send(false);
            } else {
                const agent = new agentCollection({
                    type: req.body.type,
                    fname: req.body.fname,
                    lname: req.body.lname,
                    phoneNumber: req.body.phoneNumber,
                    email: req.body.email,
                    age: req.body.age,
                    password: req.body.password
                })
                const result = await agent.save();
                const payload = { type: "agent", id: result.id, name: result.name, email: req.body.email }
                res.cookie('agentPayload', payload, {
                    expiresIn: 60 * 60 * 24 * 2,
                    httpOnly: true,
                });
                res.send(result)
            }
        } catch (error) {
            res.send(false)
        }
    }


    //@agent update
    static updateProfile = async (req, res) => {
        const id = req.params.id;
        const { fname, lname, email, phoneNumber, password } = req.body;
        try {
            const result = await agentCollection.findByIdAndUpdate({ _id: id }, {
                fname: fname,
                lname: lname,
                email: email,
                phoneNumber: phoneNumber,
                password: password
            })
            res.send(true)
        } catch (error) {
            res.send(false)
        }
    }


    // @agent login
    static agentLogin = async (req, res) => {
        const { email, password } = req.body;
        try {
            const agent = await agentCollection.findOne({ email: email })
            const payload = { type: "agent", id: agent.id, name: agent.name, email: agent.email }
            if (agent.password == password && agent.email == email) {
                res.cookie('agentPayload', payload, { expiresIn: 24 * 60 * 60 * 10, httpOnly: true });
                res.send(agent);
            }
            else {
                res.send(false)
            }
        } catch (error) {
            res.send(false)
        }
    }

    // @agentLogout
    static logout = (req, res) => {
        res.clearCookie('agentPayload');
        res.send(true);
    }


    // @get agent
    static getAgent = async (req, res) => {
        const id = req.params.agentId;
        try {
            const result = await agentCollection.findById({ _id: id });
            res.send(result);
        } catch (error) {
            res.send(error)
        }
    }

    // @add property
    static addProperty = async (req, res) => {
        const { type, address, area, price, city, zip } = req.body;
        const agentId = req.params.agentId;
        try {
            const property = new propertyCollection({
                agentId: agentId,
                type: type,
                address: address,
                area: area,
                price: price,
                city: city,
                zip: zip,
                image: req.file.filename
            })

            const result = await property.save();
            res.send(true)

        } catch (err) {
            res.send('not saved')
        }
    }


    // @getProperties

    static agentProperties = async (req, res) => {
        const id = req.params.agentId;
        // console.log(id)
        try {
            const data = await propertyCollection.find({ agentId: id });
            if (data) {
                res.send(data)
            } else {
                res.send(false)
            }
        } catch (error) {
            res.send(false)
        }
    }

    // @getOneProperties
    static getOneProperty = async (req, res) => {
        const id = req.params.id;

        try {
            const data = await propertyCollection.find({ _id: id });
            if (data) {
                res.send(data)
            } else {
                res.send("not found any property")
            }
        } catch (error) {
            res.send(error)
        }

    }


    // @update Property
    static editProperty = async (req, res) => {
        const id = req.params.id;
        try {
            const data = await propertyCollection.findById({ _id: id });
            const imageOne = data.image;
            const { type, address, area, price, city, zip } = req.body;
            if (req.file) {
                const property_ = await propertyCollection.findByIdAndUpdate({ _id: id }, {
                    type: type,
                    address: address,
                    area: area,
                    price: price,
                    city: city,
                    zip: zip,
                    image: req.file.filename
                })
                fs.unlinkSync(path + `/${imageOne}`)
                res.send(property_);
            } else {
                console.log("me")
                const property = await propertyCollection.findByIdAndUpdate({ _id: id }, {
                    type: type,
                    address: address,
                    area: area,
                    price: price,
                })
                res.send(property);
            }
        } catch (error) {
            res.send(error)
        }

    }

    // @delete Property
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

    // @properties booked
    static bookedProperties = async (req, res) => {
        const id = req.params.agentId;

        const info = [];

        const result = await propertyCollection.find({ agentId: id });

        const userIds = result.map((e) => {
            if (e.bookedBy !== null) {
                return e.bookedBy
            }
        })

        // @use loop to retrive them
        for (let i = 0; i < userIds.length; i++) {

            if (userIds[i]) {
                const prop = await propertyCollection.find({ bookedBy: userIds[i] });
                const user = await userCollection.find({ _id: userIds[i] })
                info.push({
                    dec: ` your uploaded property at ${prop[0].address} was booked by ${user[0].fname} ${user[0].lname} and u can can contact with ur client on ${user[0].email} and ${user[0].phoneNumber}`,
                    prop_id: `${prop[0]._id}`
                });
            }

        }

        res.send(info)
    }

    // @cancel property
    static cancelDeal = async (req, res) => {
        const id = req.params.propid;
        console.log(id);
        try {

            const result = await propertyCollection.findByIdAndUpdate({ _id: id }, {
                bookedBy: null
            });

            if (result) {
                res.send(true);
            } else {
                res.send(false);
            }

        } catch (error) {
            res.send(false)
        }

    }

    static dealDone = async (req, res) => {
        const id = req.params.propid;
        console.log(id);
        try {
            const result = await propertyCollection.findByIdAndDelete({ _id: id });
            const imageOne = result.image;
            if (result) {
                fs.unlinkSync(path + `/${imageOne}`);
                res.send(true);
            }

        } catch (error) {
            res.send(false)
        }

    }

}

module.exports = AgentController