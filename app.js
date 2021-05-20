require('dotenv').config();
const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const DateTime = require(__dirname+"/components/date.js");



app.use(express.static('public'));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(`mongodb+srv://${process.env.MONGODB_ID}:${process.env.MONGODB_PASS}@cluster0.x2re2.mongodb.net/custo?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });



const customerSchema = new mongoose.Schema({
    name: "String",
    email: "String",
    balance: "Number"
})

const messageSchema  = new mongoose.Schema({
    FullName:"String",
    Email:"String",
    Phone:"String",
    Message:"String"


})

const transactionSchema = new mongoose.Schema({
    Amount:"String",
    SendersName:"String",
    RecieversName:"String",
    Date:"String",
    Time:"String"
})



const Customer = mongoose.model("Customer", customerSchema);
const Message = mongoose.model("message",messageSchema);
const Transaction = mongoose.model("transaction",transactionSchema);



app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/public/index.html");
})

app.get("/customers", (req, res) => {
    Customer.find((err, customers) => {
        res.render("index", { customerList: customers })

    })

})

app.post("/", (req, res) => {



    Customer.findById(req.body.viewDetails, (err, customer) => {
        res.render("details", { customerDetail: customer })


    })
})



app.post("/transfer", (req, res) => {
    const sender = req.body.transfer;



    Customer.find((err, customerList) => {
        const recieversId = customerList.filter((element) => {
            return element._id != sender;
        })

        Customer.findById(sender, (err, senderCustomer) => {
            res.render("transfer", { senderDetails: senderCustomer, recieverList: recieversId });
        })





    })



})

app.post("/finalTransfer", (req, res) => {

const amountToBeDeducted = Number(req.body.amount);
const sendersId = req.body.senderId;
const recieversId = req.body.reciever;
    
Customer.findById(sendersId,(err,sender)=>{
    if(err)
    {
        console.log(err);
        
    }
    else
    {
        const sendersBalance = sender.balance;
        const remainingSendersBalance = Number(sendersBalance) - Number(amountToBeDeducted);
        const sendersName = sender.name;
        if(remainingSendersBalance>=0)
        {
            Customer.findById(recieversId,(err,reciever)=>{
                const recieversBalance = reciever.balance;
                const totalRecieversBalance = Number(recieversBalance) + Number(amountToBeDeducted)
                const recieversName = reciever.name;

               
                    Customer.findByIdAndUpdate(recieversId,{balance:totalRecieversBalance},(err)=>{
                        if(err)
                        {
                            console.log(err);
                            
                        }
                       
                    })
                    const transfer1 = new Transaction({
                        Amount:amountToBeDeducted,
                        SendersName:sendersName,
                        RecieversName:recieversName,
                        Date:(DateTime().Date),
                        Time:(DateTime().Time)

                    })
                    transfer1.save((err)=>{
                        if(err)
                        {
                            console.log(err);
                            
                        }
                    })
                
            })
            Customer.findByIdAndUpdate(sendersId,{balance:remainingSendersBalance},(err)=>{
                if(err)
                {
                    console.log(err);
                    
                }
            })
           
           res.render("success",{contentResult:"Transfer Successful !"});
            
            
        }
        else
        {
            res.render("failure",{contentResult:"Transfer Failed Due To Insufficient Balance !"});
        }
        
    }
    
})

})



app.get("/contactUs",(req,res)=>{
    res.render("contact",{contactUs:"Contact Us"})
})


app.get("/services",(req,res)=>{
    res.render("services",{Services:"Services"});
})


app.get("/aboutUs",(req,res)=>{
    res.render("about",{About:"About Us"});
})

app.post("/message",(req,res)=>{
    const name = req.body.myName;
    const email = req.body.myEmail;
    const phone = req.body.myPhone;
    const text = req.body.myText;

    const Message1 = new Message({
        FullName:name,
        Email:email,
        Phone:phone,
        Message:text
    })
    Message1.save((err)=>{
        if(err)
        {
            res.render("message",{Message:"Message Not Recorded,Please Fill The Form Again"});
        }
        else{
            res.render("message",{Message:"Your Message Has Been Recorded,We Will Get Back To You."});
        }
    })
})
app.get("/transactionList",(req,res)=>{
    Transaction.find((err,transactions)=>{
        res.render("transactions",{transactionList:transactions});
    })
})
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, () => {
    console.log("Running");

})

