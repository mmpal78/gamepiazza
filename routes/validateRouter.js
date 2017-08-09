const express = require('express');
const router = express.Router();

const {Users} = require('../models/userModel');

router.put('/', (req, res) => {
	let email;
	
	if(req.body.email === undefined){
		email = req.body.id;
	} 
	else{
		email = req.body.email;
	}
	console.log(`VALIDATE: ${email}`)
	let name = req.body.name;

	console.log('BODY: ', req.body)

	let user = Users.count({email: email}, function(err, count){

		if(count <= 0){
			Users.create({
				email: email,
				name: name
			})
			.then(response => {
				console.log('Create Response: ', response);
				res.status(201).json({name: response.name, email: response.email});
			})
		} else {
			Users.find({email: email})
			.exec()
			.then(resp => {
				res.json({message: 'User Logged In'});
			})
		}
	})
	
})

module.exports = {
	router
};