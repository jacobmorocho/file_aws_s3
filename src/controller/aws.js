
'use strict'
const { exec } = require("child_process");
const jsv = require('json-validator');
const AWS = require('aws-sdk');
const { listAllObjects } = require('s3-list-all-the-objects');
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
const ValidateClone = (body, callback) => {
    var schema = {
        backet: {
            required: true,
            trim: true,
            type: "string",
            isLength: [5, 50]
        },
        domainorg: {
            required: true,
            trim: true,
            type: "string",
            isLength: [3, 50]
        }       
    }
    jsv.validate(body, schema, callback);
}
const Validate = (body, callback) => {
    var schema = {
        backet: {
            required: true,
            trim: true,
            type: "string",
            isLength: [5, 50]
        },
        key: {
            required: true,
            trim: true,
            type: "string",
            isLength: [1, 50]
        }
    }
    jsv.validate(body, schema, callback);
}
const IsBucket = async (BUCKET_NAME) => {
    try {
        const data = await s3.headBucket({ Bucket: BUCKET_NAME }).promise()
        return true;
    } catch (err) {
        return false;
    }
}
const commandCli = (command) => {
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
}
const pathKey = (args) => {
    let key = args.join("/")
    const search = '//'
    const replacer = new RegExp(search, 'g')
    key = key.replace(replacer, '/');
    return key;
}
const AwsController = () => {
    const clone = async (req, res) => {
        ValidateClone(req.body, (err, messages) => {
            if (messages && Object.keys(messages).length !== 0) {
                res.json(messages);
            } else {
                IsBucket(req.body.backet).then((r) => {
                    if (r) {
                        let command = `aws s3 cp s3://${req.body.backet}/${req.body.domainorg}/ s3://${req.body.backet}/${req.user.obj[0].dominio_asignado} --recursive `;
                        commandCli(command);
                        res.json({ status: true, messages: "En ejecucion" });
                    }
                    else {
                        res.json({ status: false, message: "No Existe backet" });
                    }
                }).catch((err) => {
                    res.json(err);
                })
            }
        });
    }
    const add = async (req, res) => {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }
        const body = JSON.parse(JSON.stringify(req.body));
        Validate(body, (err, messages) => {
            if (messages && Object.keys(messages).length !== 0) {
                res.json(errors);
            } else {
                IsBucket(req.body.backet).then((r) => {
                    if (r) {
                        let key = pathKey([req.user.obj[0].dominio_asignado, req.body.key, req.files.file.name]);
                        const params = {
                            Bucket: req.body.backet,
                            Key: key,
                            Body: JSON.stringify(req.files.file, null, 2)
                        };
                        s3.upload(params, function (err, data) {
                            if (err) {
                                res.json(err);
                            }
                            res.json(data);
                        });
                    } else {
                        res.json({ status: false, message: "No Existe backet" });
                    }

                }).catch((err) => {
                    res.json(err);
                })
            }
        })
    }
    const deleted = async (req, res) => {

        Validate(req.body, (err, messages) => {
            if (messages && Object.keys(messages).length !== 0) {
                res.json(messages);
            } else {
                IsBucket(req.body.backet).then((r) => {
                    if (r) {
                        let key = pathKey([req.user.obj[0].dominio_asignado, req.body.key]);
                        let command = `aws s3 rm s3://${req.body.backet}/${key} --recursive`;
                        console.log(command);
                        commandCli(command);
                        res.json({ status: true, message: "En ejecucion" });
                    } else {
                        res.json({ status: false, message: "No Existe backet" });
                    }

                }).catch((err) => {
                    res.json(err);
                })
            }
        })
    }
    const list = (req, res) => {
        
        Validate(req.body, (err, messages) => {
            if (messages && Object.keys(messages).length !== 0) {
                res.json(messages);
            } else {
                IsBucket(req.body.backet).then((r) => {
                    if (r) {
                        let key = pathKey([req.user.obj[0].dominio_asignado, req.body.key]);
                        listAllObjects(req.body.backet, key).then((myObjects) => {
                            res.json(myObjects);
                        }).catch((error) => {
                            res.json(error);
                        });

                    } else {
                        res.json({ status: false, message: "No Existe backet" });
                    }
                }).catch((err) => {
                    res.json(err);
                })
            }
        })
    }
    const home = (req, res) => {
        res.json({ app: "aws s3" })
    }
    return {
        home: home,
        clone: clone,
        add: add,
        delete: deleted,
        list: list
    }
}

module.exports = AwsController();
