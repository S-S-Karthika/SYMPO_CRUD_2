const express = require('express')
const app = express()
const mysql = require('mysql2')
const PORT = 3100;
const bodyparser= require('body-parser')

const cors = require('cors')
app.use(cors())
app.use(express.json())

const db = mysql.createConnection({
    user:"root",
    host:"localhost",
    port:3306,
    password:"karthika",
    database:'symposium'
})



app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json())


//create end point
app.post('/create',async(req,res)=>{
const{firstname,lastname,id,email,phonenumber,year,college}=req.body

    db.query(
        "insert into symposium.student(firstname,lastname,id,email,phonenumber,year,college) VALUES (?,?,?,?,?,?,?)",
        [firstname,lastname,id,email,phonenumber,year,college],(err,result)=>{
            if(err){
                res.status(500).json({error:err.message})
                return  
            }else{
                res.status(200).json({message:result.affectedRows})  
            }
        })

})


app.get('/studentGet',async(req,res)=>{
    const sql="select * from student"
    
    db.query(sql,(err,records)=>{
        if(err){
            res.status(404).json({"error":err.message})
            return
        }
        if(records.length==0){
            res.json(201).json({"message":"no records found"})
            return
        }
        res.status(200).json({records})
    })
})

app.put('/studentUpdate/:id',async(req,res)=>{
    
    const{firstname,lastname,email,phonenumber,year,college} = req.body
    
    const sql="UPDATE student SET firstname=?,lastname=?,email=?,phonenumber=?,year=?,college=? where id=?;"
    db.query(sql,[firstname,lastname,email,phonenumber,year,college,req.params.id],(err,result)=>{
        if(err){
            res.status(500).json({"error": err.message})
            return
        }
        if(result.affectedRows==0){
            res.status(404).json({message:"No product found"})
            return
        }
        res.status(200).json({message: "updated"})
    })
})

app.delete('/delete/:id',async(req,res)=>{
    const id=req.params.id
    const sql="delete from Student where id=?"
    db.query(sql,[id],(err,result)=>{
        if(err){
            res.status(500).json({error:"Error while deleting the record"})
            return
        }
        if(result.affectedRows==0){
            res.status(404).json({message:"Product not found to delete"})
            return
        }
        res.status(200).json({message:`${id} has removed from stock`})
    })
})

app.put('/studentUpdate/:id',(req,res)=>{
    const sql="UPDATE student SET firstname=?,lastname=?,email=?,phonenumber=?,year=?,college=? where id=?;"
    const id =req.params.id
    db.query(sql,[req.body.firstname,req.body.lastname,req.body.email,req.body.phonenumber,req.body.year,req.body.college,id],
        (err,result)=>{
if(err) return res.json({Message:"Error"})
return res.json(result)
        })
})

app.listen(PORT,()=>{
    console.log("server running")
})