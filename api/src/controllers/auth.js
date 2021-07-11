const {response} = require('express');
const bcryptjs = require('bcryptjs');
const {User}= require('../models/User')
const{ generateJWT }= require('../middlewares/jwt')

const createUser = async (req, res = response) => {
    const { name, email, password}= req.body;
    try {
        let newUser = await User.findOne({ where: { email } });
        if (newUser === null) {
            // Encriptar contraseña
           const  salt = bcryptjs.genSaltSync();
            let encPassword = bcryptjs.hashSync(password, salt);

            // crear usurio en la base de datos
          let newUser = await User.create({
                name,
                email,
                password: encPassword,
            });

            //generar JWT
          const token = await generateJWT(newUser.id, newUser.name);

          return res.status(201).json({msg:"your user has been created successfully", token});
        } else {
           return res.status(400).json({msg:"this user already exists"});
        }

    } catch(e){
        return res.status(500).json({msg:"error"})
    }

}
const loginUser = async (req, res = response) => {
    const { email, password }= req.body;
    try {
        let logUser = await User.findOne({ where: { email } });
        if (logUser !== null) {
            const validPassword = bcryptjs.compareSync(password,logUser.password);
            if(!validPassword ) return res.status(400).json({msg:"the password is incorrect"});
            else {
                const token = await generateJWT(logUser.id, logUser.name);
                return res.status(200).json({msg:"bienvenido", token})
            }
        } else {
            return res.status(400).json({msg:"this user no  exists"});
        }

    } catch(e){
        return res.status(500).json({msg:"error"})
    }
}
const validateToken = (req, res = response) => {
    res.json({
        msg: 'validateToken'
    })
}
 module.exports = {
     createUser,
     loginUser,
     validateToken
 }