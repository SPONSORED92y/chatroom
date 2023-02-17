const bcrypt = require("bcryptjs");
const User = require("../models/user");
const passport = require("passport");
const { body, validationResult } = require("express-validator");
const Message = require("../models/message");
var login_user = "";

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
    Message.find()
        //.sort([["time","ascending"]])
        .exec(function (err, list_Message) {
            if (err) {
                return next(err);
            }
            //Successful, so render
            //TODO: use async to chain req.user.username
            console.log("log in as");
            console.log(req.user.username);
            res.render("chat", {
                User: req.user,
                Message_list: list_Message,
            });
        });
};

exports.chat_post = [
    body("message", "Message required").trim().escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        const message = new Message({
            owner: "todo",
            content: req.body.message,
            time: "todo"
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