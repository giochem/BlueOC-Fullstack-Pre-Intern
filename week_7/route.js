const express = require('express')
const route = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const secret = '123'

let users = [
    {username: 'admin1', name:'David'},
    {username: 'dev1', name:'Osama'}
]

// CRUD users

route.get('/users', (req,res) => {
    return res.status(200).json(users)
})
route.post('/users', (req,res) => {
    const {username, name} = req.body
    if(!username || !name) {
        return res.status(400).json({message:'username and name are required'})
    }
    // const
})

route.post('/login', (req, res) => {
    const {username, password} = req.body
    if (!username || !password) {
        return res.status(400).json({message: 'username or password are invalid'})
    }
    const loginUser = users.find(user => user.username == username)

    if(!loginUser){
        res.status(400).json({message: 'username or password are invalid'})
    }

    const isValid = bcrypt.compareSync(password, loginUser.password)
    
})

module.exports = route