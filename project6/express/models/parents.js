const mongoose = require("mongoose");
const schema = mongoose.Schema;

const parentSchema = new schema({
    first_name: String,
    last_name: String,
    email_address: String,
    password: String,
    active_flag: Boolean
});

module.exports = mongoose.model("parents", parentSchema);