const multer = require('multer')
const path = require('path')

// const upload = multer()
// const upload = multer({ dest: "public/products" })

const productStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "..", "..", "public", "products"))
    },
    filename: (req, file, cb) => {
        // if(file.mimetype.startsWith("image/"))

        const preFix = Date.now() + "-" + Math.ceil(Math.random() * 10000000)

        cb(null, preFix + "-" + file.originalname)
    }
})

const profileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "..", "..", "public", "profiles"))
    },
    filename: (req, file, cb) => {
        // if(file.mimetype.startsWith("image/"))

        const preFix = Date.now() + "-" + Math.ceil(Math.random() * 10000000)

        cb(null, preFix + "-" + file.originalname)
    }
})

const productUploads = multer({ storage: productStorage })
const profileUpload = multer({ storage: profileStorage })


module.exports = { productUploads, profileUpload }