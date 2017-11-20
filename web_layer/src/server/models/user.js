const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const express = require('express');
const validator = require('validator');
const passport = require('passport');
const errors = require('../../utility/error');

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

UserSchema.statics.validateSignupForm = async function(payload) {
    const errors = {};
    let isFormValid = true;
    let message = '';

    if (!payload || typeof payload.email !== 'string' || !validator.isEmail(payload.email)) {
        isFormValid = false;
        errors.email = 'Please provide a valid email adress';
    }

    if (!payload || typeof payload.password !== 'string' || payload.password.trim().length < 8) {
        isFormValid = false;
        errors.password = 'Password must be atleast 8 characters';
    }

    if (!payload || typeof payload.name !== 'string' || payload.name.trim().lenght === 0) {
        isFormValid = false;
        errors.name = 'Name is required';
    }

    if (!isFormValid) {
        message = 'Fix invalid fields';
    }

    debug('Kjapp:server')(`Signup validated`);
    return {
        success: isFormValid,
        message,
        errors
    };
}

UserSchema.statics.validateLoginForm = async function(payload) {
    const errors = {};
    let isFormValid = true;
    let message = '';

    if (!payload || typeof payload.email !== 'string' || payload.email.trim().length === 0) {
        isFormValid = false;
        errors.email = 'Please provide an email address';
    }

    if (!payload || typeof payload.password !== 'string' || payload.password.trim().length === 0) {
        isFormValid = false;
        errors.password = 'Please provide your password';
    }

    if (!isFormValid) {
        message = 'Fix invalid fields';
    }

    return {
        success: isFormValid,
        message,
        errors
    };
}

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

// GameSchema.statics.createGame = async function(game) {
//     try {
//         if (!await this.nameAvailable(game.name)) {
//             return {code: 400};
//         }
//
//         let tmp = {
//             name: game.name,
//             description: encodeURIComponent(game.description),
//         };
//
//         let out = await this.create(Object.assign({}, tmp));
//         return {code: 200, game: out};
//     } catch(err) {
//         throw errors.ERROR_500;
//     }
// };

UserSchema.statics.createUser = async function (user) {
    try {
        let isFormValid = true;
        debug('Kjapp:server')(`Trying to validate users`);
        if (!user || typeof user.email !== 'string' || !validator.isEmail(user.email)) {
            isFormValid = false;
        }

        if (!user || typeof user.password !== 'string' || user.password.trim().length < 8) {
            isFormValid = false;
        }

        if (!user || typeof user.name !== 'string' || user.name.trim().lenght === 0) {
            isFormValid = false;
        }

        if (!isFormValid.success) {
            return {code: 400};
        }

        // return passport.authenticate('local-signup', (err) => {
        //     if (err) {
        //         if (err.name === 'MongoError' && err.code === 11000) {
        //             return {code: 409};
        //         }
        //         return {code: 400};
        //     }
        //
        //     return {code: 200};
        // });

    } catch (err) {
        throw errors.ERROR_500;
    }
}

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
