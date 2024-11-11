// backend/routes/api/index.js
const router = require("express").Router();

/************ TEST ROUTE ******************************/

router.post("/test", function (req, res) {
    res.json({ requestBody: req.body });
});
  
/*********** FETCH FOR TEST ***************************

fetch('/api/test', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "XSRF-TOKEN": `fOB1YgVF-vCL0cRauzGaPVQGoSmUOcyM7IGk`
    },
    body: JSON.stringify({ hello: 'world' })
}).then(res => res.json()).then(data => console.log(data));

/******************************************************/



  

module.exports = router;
