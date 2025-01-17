// BUILD YOUR SERVER HERE
const express = require('express')
const users = require('./users/model');
const server = express();

server.use(express.json());
module.exports = server; // EXPORT YOUR SERVER instead of {}


// | Method | URL            | Description                                                                                            |
// | ------ | -------------- | ------------------------------------------------------------------------------------------------------ |
// | POST   | /api/users     | Creates a user using the information sent inside the `request body`.                                   |
// | GET    | /api/users     | Returns an array users.                                                                                |
// | GET    | /api/users/:id | Returns the user object with the specified `id`.                                                       |
// | DELETE | /api/users/:id | Removes the user with the specified `id` and returns the deleted user.                                 |
// | PUT    | /api/users/:id | Updates the user with the specified `id` using data from the `request body`. Returns the modified user |

server.post('/api/users',(request, response)=>{
    let body = request.body;
    if(!body.name || !body.bio){
        response.status(400).json({ message: "Please provide name and bio for the user" });
    }
    else{
        users.insert(body)
            .then(user =>{
                response.status(201).json(user);
            })
            .catch(()=>{
                response.status(500).json({ message: "There was an error while saving the user to the database" });
            })
    }
})
server.get('/api/users',(request, response)=>{
    users.find()
        .then(user => {
            response.json(user);
        })
        .catch(() => {
            response.status(500).json({ message: "There was an error while saving the user to the database" });
        });
})

server.get('/api/users/:id',(request, response)=>{
    let { id } = request.params;
    users.findById(id)
        .then((user)=>{
            if(user == null){
                response.status(404).json({ message: "The user with the specified ID does not exist" });
                return;
            } 
            else {
                response.json(user);
            }
        })
        .catch(()=> {
         response.status(500).json({ message: "There was an error while saving the user to the database" });
        });
})

server.put('/api/users/:id', async (request, response)=>{
    let { id } = request.params;
    try {
        let body = request.body;
        if(!body.name || !body.bio){
            response.status(400).json({ message: "Please provide name and bio for the user" });
            return;
        }else {
            let newUser = await users.update(id, body);
            if(newUser == null) {
                response.status(404).json({ message: "The user with the specified ID does not exist" });
                return;
            } else {
                response.status(200).json(newUser);
                return;
            }
        }
    } catch(e) {
        response.status(500).json({ message: "There was an error while saving the user to the database" });
    }
})
server.delete('/api/users/:id',(request, response)=>{
    let { id } = request.params;
    users.remove(id)
        .then(user => {
            if(user == null) {
                response.status(404).json({ message: "The user with the specified ID does not exist" });
                return;
            }

            response.status(200).json(user);
        })
        .catch(() => {
            response.status(500).json({ message: "There was an error while saving the user to the database" });
        });
})
