import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => {
    try {
        const { token } = req.headers

        if (!token) {
            return res.json({
                success: false,
                message: 'Not Authorized, Login Again'
            })
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = token_decode.id  // ← store on req directly, not req.body

        next()

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export default authUser