const express = require('express');
const mongojs = require("mongojs");
const db = mongojs("travel", ["records"]);
const router = express.Router();
const {
    body,
    param,
    validationResult
} = require("express-validator");

router.get('/records', function (req, res) {
    db.records.find(function (err, data) {
        if (err) {
            return res.sendStatus(500);
        } else {
            return res.status(200).json({
                meta: { total: data.length },
                data
            });
        }
    });
});

router.get('/records/:id', [
    param("id").isMongoId()
], function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const _id = req.params.id;
    db.records.count({
        _id: mongojs.ObjectId(_id)
    }, function (err, count) {
        if (err) {
            return res.sendStatus(500);
        }

        if (count) {
            db.records.find({
                _id: mongojs.ObjectId(_id)
            }, function (err, data) {
                return res.status(200).json({
                    meta: data._id,
                    data
                });
            })
        } else {
            return res.sendStatus(404);
        }
    })
});

router.post('/records', [
    body('name').not().isEmpty(),
    body('email').not().isEmpty(),
    body('phone').not().isEmpty()
], function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    db.records.insert(req.body, function (err, data) {
        if (err) {
            return res.sendStatus(500);
        } else {
            return res.status(200).json({
                meta: data._id,
                data
            });
        }
    });
});

router.put('/records/:id', [
    param("id").isMongoId()
], function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    db.records.count({
        _id: mongojs.ObjectId(req.params.id)
    }, function (err, count) {
        if (count) {
            db.records.save({
                _id: mongojs.ObjectId(req.params.id),
                ...req.body
            }, function (err, data) {
                if (err) {
                    return res.sendStatus(500);
                }

                return res.status(200).json({
                    meta: data._id,
                    data
                });
            })
        } else {
            return res.sendStatus(404)
        }
    })
});

router.patch('/records/:id', [
    param("id").isMongoId()
], function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    db.records.count({
        _id: mongojs.ObjectId(req.params.id)
    }, function (err, count) {
        if (count) {
            db.records.update(
                { _id: mongojs.ObjectId(req.params.id) },
                { $set: req.body },
                { multi: false }, function (err, data) {
                    if (err) {
                        return res.sendStatus(500);
                    }

                    db.records.find({
                        _id: mongojs.ObjectID(req.params.id)
                    }, function (err, data) {
                        if (err) {
                            return res.sendStatus(500);
                        }

                        return res.status(200).json({
                            meta: data._id,
                            data
                        });
                    })
                })
        } else {
            return res.sendStatus(404)
        }
    })
});

router.delete('/records/:id', [
    param("id").isMongoId()
], function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    db.records.count({
        _id: mongojs.ObjectId(req.params.id)
    }, function (err, count) {
        if (err) {
            return res.sendStatus(500);
        }

        if (count) {
            db.records.remove({
                _id: mongojs.ObjectID(req.params.id)
            }, function (err, data) {
                if (err) {
                    return res.sendStatus(500);
                } else {
                    return res.sendStatus(204);
                }
            })
        } else {
            return res.sendStatus(404)
        }
    })
});

module.exports = router;