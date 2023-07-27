import db from '../db.js'
import bcrypt from 'bcryptjs'
import  jwt  from 'jsonwebtoken'
import * as dotenv from 'dotenv'
dotenv.config()

const generateAccessToken = (email, id) => {
    const payload = {
        email,
        id
    }
    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "5m"} )
}


class UserController{
    async createUser (req, res)  {
        try {

            const {email, password} = req.body;
            console.log(email, password)
            const salt = bcrypt.genSaltSync(11);
            const hash = await bcrypt.hash(password, salt);

            const newPerson = await db.query(`INSERT INTO "hash" ( email, password) values ($1, $2) RETURNING *`, [email, hash]);
            const token = generateAccessToken(email,newPerson.rows[0].id)
            res.status(201).json({user:newPerson.rows[0], token});

            
           
         
        } catch(e) {
            console.log(e); 
         
    };
}
 
    async logUser (req, res) {
    
        const {email, password} = req.body;

        const user = await db.query(`SELECT * FROM "hash" where email = $1`, [email])

       
         if(user?.rows?.length === 0){
           return res.status(404)
         }

        const passw = await bcrypt.compare(password, user.rows[0].password )
         if(!passw){
            res.send("wrond password")
            return
        }
        const token = generateAccessToken(email,user.rows[0].id)
        res.status(200).json({token});

    }
  
    async getUser (req,res){
        const token = req.headers.authorization.split(' ')[1]
       
         if(!token){
             return res.status(403).json({message: "Пользователь не авторизован"})
         }
         try{
         const decodedData = jwt.verify(token, process.env.JWT_SECRET)
         const user = await db.query(`SELECT * FROM "hash" where id = $1`, [decodedData.id])
         const {password, ...newUser} = user.rows[0]
         res.status(200).json({user:newUser});
         } catch(err){
            console.log(err)

         }
         
    }
}

export default new UserController()