const express = require("express");
const crypto = require("crypto");
const Razorpay = require("razorpay");

const app = express();
app.use(express.json());

const razorpay = new Razorpay({
  key_id:'rzp_test_p2UPVrIfYQd3D7',
  key_secret:'mGPE9lDRYpZxQrDFPsYOiG2s',
});

app.get("/", (req, res) => res.send("Razorpay Server"));

app.post("/createOrder", async (req, res) => {
  try {
    const order = await razorpay.orders.create({
      amount: req.body.amount,
      currency: "INR",
    });
    res.send(order);
  } catch (error) {
    res.send(error);
  }
});
app.post('/orders',(req,res)=>{
  var options = {
    amount: 50000,  // amount in the smallest currency unit
    currency: "INR",
    receipt: "order_rcptid_11"
  };
  instance.orders.create(options, function(err, order) {
    console.log(order);
  });
})

app.post("/verifySignature", (req, res) => {
  const { orderID, transaction } = req.body;

  const generatedSignature = crypto
    .createHmac("sha256", process.env.SECRETKEY)
    .update(`${orderID}|${transaction.razorpay_payment_id}`)
    .digest("hex");

  res.send({ validSignature: generatedSignature === transaction.razorpay_signature });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Razorpay Server listening at Port ${port}`));
