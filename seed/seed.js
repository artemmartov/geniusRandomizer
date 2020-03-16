const User = require('../model/userModel');
const mongoose = require('mongoose');



async function createUser() {
    await mongoose.connection.dropDatabase();


    let user1 = await User.create({
        email: 'qwerty@mail.ru',
        password: 'qwerty'
    });



    await mongoose.disconnect();
}

createUser();

// module.exports = createUser();
