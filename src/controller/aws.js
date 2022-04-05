
const AwsController = () => {
    const list = (req, res) => {
        res.json({ title: "List" })
    }
    const add = (req, res) => {
        res.json({ title: "Add" })
    }
    const deleted = (req, res) => {
        res.json({ title: "Delete" })
    }
    return {
        list: list,
        add: add,
        delete: deleted
    }
}
module.exports = AwsController();