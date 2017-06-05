var mysql = require("mysql")
var inquirer = require("inquirer")

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,

	user: "root",

	password: "Password1!",
	database: "bamazon"
});

connection.connect(function(err) {

	if (err) throw err;
	console.log("connected as id" + connection.threadId)
})



connection.query("SELECT * FROM products", function(err,res) {
	if (err) throw err;
	for (var i = 0; i < res.length; i++) {
		console.log(res[i].item_id + "|" + res[i].product_name + "| Price: $" + res[i].price + "| Quantity: " + res[i].stock_quantity)
	}

})


 var purchase = function () {

 	connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

 	inquirer.prompt([
 	{
    name: "item",
    type: "rawlist",
    choices: function(){
    	choiceArray = []
    	for (var i = 0; i < res.length; i++) {
    		choiceArray.push(res[i].product_name)

    	}
    	return choiceArray
    },
    message: "Welcome to Super Mart Services! Please select the item you would like to      purchase!"
},
{

	name: "number",
	type:"input",
	message: "How many would you like to purchase?"
}
  ]).then(function(answer) {
  	var chosenItem;
  	for (var i = 0; i < res.length; i++) {
  		if (res[i].product_name === answer.item) {
  		chosenItem = res[i];
  		console.log(chosenItem)
  	}
  	}
  	

  	if (answer.number <= parseInt(chosenItem.stock_quantity)) {
  		connection.query("UPDATE products SET ? WHERE?", [{
  			stock_quantity:(parseInt(chosenItem.stock_quantity) - parseInt(answer.number))

  		}, {
  			item_id: chosenItem.item_id
  		}], function(error) {
  			if (error) throw err;
  			console.log("Quantity remaining: " + (chosenItem.stock_quantity-answer.number))
  			console.log("Total purchase price: $" + (chosenItem.price*answer.number))
  			console.log("Order placed succesfully!")
  		})

  	}

  	else {
  		console.log("Sorry there is insufficient quantity")
  	}


  })
})

}
purchase()







