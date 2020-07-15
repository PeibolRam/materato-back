const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt')

const app = express()

const  { User } = require('./models/user')
const { auth } = require('./middleware/auth')

const cors = require('cors')
require('dotenv').config();


mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false }, (err) => {
    if(err) return err
    console.log("Conectado a MongoDB")
})

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cookieParser())
app.use(cors())


app.get('/', (req, res) => {
    res.send('Bienvenido');
})

//Rutas user
app.post('/api/users/register', (req, res) => {
    const user = new User(req.body)
    user.save((err, doc) => {
        if(err) return res.json({success: false, err})
        res.status(200).json({
            success: true,
            userdata: doc
        })
    })
})

app.post('/api/users/login', (req, res) => {
    User.findOne({'email': req.body.email}, (err,user) => {
        if(!user) return res.json({loginSuccess: false, message: 'Auth fallida, email no encontrado'})

        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch) return res.json({loginSuccess: false, message: "Contraseña incorrecta"})

            user.generateToken((err, user)=> {
                if(err) return res.status(400).send(err)
                res.cookie('b_auth', user.token).status(200).json(
                    {
                        loginSuccess: true,
                        token: user.token
                    }
                )
            })
        })
    })
})

app.get('/api/users/auth', auth, (req, res) => {
    res.status(200).json({
        user: {
            id: req.user._id,
            name: req.user.name,
            lastname: req.user.lastname,
            email: req.user.email,
            role: req.user.role,
            premium: req.user.premium,
        },
        isAuth: true
    })
})

app.put('/api/users/:id', auth, (req, res) => {
    var itemId = req.params.id;

    User.findByIdAndUpdate( itemId,{
        name: req.body.name,
        lastname: req.body.lastname,
        email: req.body.email
        }, (err, user) => {
        if(err ) {
            return res.json({success: false, err})
        } else {
            return res.status(200).json({
                success: true
            })
        }
    })
});

app.put('/api/users/pass/:id', auth, (req, res) => {
    try {
        const itemId = req.params.id
        const userRequest = req.body;
        // const newPassword = bcrypt.hash(userRequest.password, process.env.ROUNDS); 
        bcrypt.hash(userRequest.password, 10, (err, hash) => {  
            if(err ) {
                return res.json({success: false, err})
            }else{
                User.findByIdAndUpdate( itemId,{
                    password: hash
                    }, (err, user) => {
                    if(err ) {
                        return res.json({success: false, err})
                    } else {
                        return res.status(200).json({
                            success: true,
                            newPass: hash
                        })
                    }
                })
            }
        });       

    } catch(error) {
        res.json({ message: error.toString() });
    }

});

app.get('/api/user/logout', auth, (req, res) => {

    User.findOneAndUpdate({token: req.headerToken}, {token: ''}, (err, user)=> {
        if(err ) {
            return res.json({success: false, err})
        } else {
            return res.status(200).json({
                success: true
            })
        }
    });
})


app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en el puerto ${process.env.PORT}`)
})
