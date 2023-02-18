const bcrypt = require("bcryptjs");
const User = require("../models/user");
const passport = require("passport");
const { body, validationResult } = require("express-validator");
const Message = require("../models/message");
const async = require("async");
//var login_user = "";

exports.index = (req, res) => {
    res.render("index");
};

exports.login_get = (req, res) => {
    res.render("login");
};

exports.login_get_failed = (req, res) => {
    res.render("login", { errors: ["incorrect username or password"] });
};

exports.login_post = (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/chat",
        failureRedirect: "/login_failed"
    })(req, res, next);
};

exports.sign_up_get = (req, res) => {
    res.render("sign_up");
};

exports.sign_up_post = (req, res, next) => {
    console.log(req.body.username);
    console.log(req.body.password);
    bcrypt.hash(req.body.password, 10, (err, hasshedPassword) => {
        if (err) {
            return next(err);
        } else {
            const user = new User({
                username: req.body.username,
                password: hasshedPassword
            }).save(err => {
                if (err) {
                    return next(err);
                }
                res.redirect("/index");
            });
        }
    });
};

exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
};

exports.chat = function (req, res, next) {
    async.parallel({
        list_Message(callback) {
            if (req.user) {
                console.log("loggg in as");
                console.log(req.user.username);
            }
            Message.find()
                //.sort([["time","ascending"]])
                .exec(callback);
        },
    }, (err, results) => {
        if (err) {
            return next(err);
        }
        res.render("chat", {
            User: req.user,
            Message_list: results.list_Message,
        });
    });
};

exports.chat_post = [
    body("message", "Message required").trim().escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        const date_ob = new Date();
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let date = ("0" + date_ob.getDate()).slice(-2);
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        const message = new Message({
            owner: req.body.owner,
            content: req.body.message,
            time: (month + "/" + date + " " + hours + ":" + minutes)
        });
        if (!errors.isEmpty()) {
            res.render("chat", {
                errors: ["message error"]
            });
            return;
        } else {
            // Data from form is valid.
            message.save((err) => {
                if (err) {
                    return next(err);
                }
                res.redirect("/chat");
            });
        }
    }
]