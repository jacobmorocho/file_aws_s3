const { exec } = require("child_process");
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
const AwsController = () => {
    const clone = (req, res) => {
        exec("aws s3 cp s3://dev-aws-backet/tienda01/ s3://dev-aws-backet/tienda02 --recursive ", (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        });
        res.json({ title: "List" })
    }
    const add = (req, res) => {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }
        const params = {
            Bucket: "dev-aws-backet",
            Key: req.files.file.name,
            Body: JSON.stringify(req.files.file, null, 2)
        };
        console.log( s3);
        s3.upload(params, function (err, data) {
            if (err) {
                throw err;
            }
            res.json(data);
        });

    }
    const deleted = (req, res) => {
        exec("aws s3 rm s3://dev-aws-backet/tienda02/ --recursive", (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        });
        res.json({ title: "delete" })
    }
    return {
        clone: clone,
        add: add,
        delete: deleted
    }
}
module.exports = AwsController();