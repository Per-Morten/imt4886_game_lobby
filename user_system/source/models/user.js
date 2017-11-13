const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        index: {unique: true}
    },
    password: String,
    name: String,
    role: String
});

UserSchema.methods.comparePassword = function comparePassword(password, callback) {
    bcrypt.compare(password, this.password, callback);
};

UserSchema.statics.getRole = async function(email) {
    try {
        const regex = new RegExp(email, 'i');
        const res = await this.find({email: regex});

        if (res.length > 0) {
            user: res;

            return {code: 200, user: res};
        } else {
            return {code: 404};
        }
    } catch(err) {
        throw console.error("500");
    }
};

UserSchema.pre('save', function saveHook(next) {
    const user = this;

    if (!user.isModified('password')) return next();

    return bcrypt.genSalt((saltError, salt) => {
        if (saltError) {
            return next(saltError);
        }

        return bcrypt.hash(user.password, salt, (hashError, hash) => {
            if (hashError) {
                return next(hashError);
            }

            user.password = hash;

            return next();
        });
    });
});

module.exports = mongoose.model("User", UserSchema);
