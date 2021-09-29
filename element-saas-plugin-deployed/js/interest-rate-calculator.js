console.log("Interest Rate Calculator Online")

// Find Interest Rate
var findPayment = function(balance, rate, periods, ){
  var payment = balance * (rate/(1-Math.pow(1+rate, -periods)))
      return payment
}

var findEffectiveRate =  function (loanAmount, costOfLoan, periods, guess){
  // Guess must be an annual rate
  var x = guess
  var payment = costOfLoan/periods

  while (findPayment(loanAmount, (x/12), periods) < payment) {
    x += 0.01;
    // Round to avoid floating errors
    x = Math.round(x * 1e4) / 1e4
  }
  while (findPayment(loanAmount, (x/12), periods) > payment) {
    x -= 0.0001
    // Round to avoid floating errors
    x = Math.round(x * 1e4) / 1e4
  }
	while (findPayment(loanAmount, (x/12), periods) < payment) {
    x += 0.00001
    // Round to avoid floating errors
    x = Math.round(x * 1e5) / 1e5
  }
  return x;
}

// Runs when the calculate button is clicked.
document.querySelector("#calculate").addEventListener('click', function (e) {
	e.preventDefault();
  calculate()
}, false);

function  calculate(){


	var display_payment = document.getElementById("display_payment");
	var display_rate = document.getElementById("display_rate");
  var display_error = document.getElementById("display_error");
	//in case of a re-calc, clear out the spans
	display_payment.innerHTML = "";
	display_rate.innerHTML = "";
  // Get values
  var loanAmount = parseFloat(Number(document.getElementById("loan_amount").value.replace(/[^0-9.-]+/g,"")));
	var amountOwed = parseFloat(Number(document.getElementById("amount_owed").value.replace(/[^0-9.-]+/g,"")));
	var term = parseInt(document.getElementById("term").value);

  if(!amountOwed){
    error = "ERROR: Please enter an amount to be repaid."
  } else if(loanAmount >= amountOwed){
    error = "ERROR: This calculator only calculates positive interest rates. Make sure the amount to be repaid is greater than the loan amount."
  } else if(!loanAmount){
    error = "ERROR: Please enter a loan amount."
  } else if(!term){
    error = "ERROR: Please enter a term length."
  }
  //TODO error handling. Amount to be repaid must be positive, etc.
  if(error){
      display_error.innerHTML = error
      display_error.style.display = "block";
  } else {
    var guess = 0.01
    var effectiveRate = findEffectiveRate(loanAmount, amountOwed, term, guess)
    var equivalentPayment = findPayment(loanAmount, effectiveRate/12, term)
    var error = ''
    display_error.style.display = "none";
    // Add required percentage of revenue to display DIV
    display_rate.innerHTML = (effectiveRate*100).toFixed(3) + "%"
    display_payment.innerHTML = "$" + formatNumber(equivalentPayment.toFixed(0))
  }

}

// format all inputs with a data-type currency to look like: $10,000,000.00
jQuery("input[data-type='currency']").on({
    keyup: function() {
      formatCurrency(jQuery(this));
    },
    blur: function() {
      formatCurrency(jQuery(this), "blur");
    }
});


function formatNumber(n) {
  // format number 1000000 to 1,234,567
  return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

// Makes field input a currency format
function formatCurrency(input, blur) {
  // appends $ to value, validates decimal side
  // and puts cursor back in right position.

  // get input value
  var input_val = input.val();

  // don't validate empty input
  if (input_val === "") { return; }

  // original length
  var original_len = input_val.length;

  // initial caret position
  var caret_pos = input.prop("selectionStart");

  // check for decimal
  if (input_val.indexOf(".") >= 0) {

    // get position of first decimal
    // this prevents multiple decimals from
    // being entered
    var decimal_pos = input_val.indexOf(".");

    // split number by decimal point
    var left_side = input_val.substring(0, decimal_pos);
    var right_side = input_val.substring(decimal_pos);

    // add commas to left side of number
    left_side = formatNumber(left_side);

    // validate right side
    right_side = formatNumber(right_side);

    // On blur make sure 2 numbers after decimal
    if (blur === "blur") {
      right_side += "00";
    }

    // Limit decimal to only 2 digits
    right_side = right_side.substring(0, 2);

    // join number by .
    input_val = "$" + left_side + "." + right_side;

  } else {
    // no decimal entered
    // add commas to number
    // remove all non-digits
    input_val = formatNumber(input_val);
    input_val = "$" + input_val;

    // final formatting
    if (blur === "blur") {
      input_val += ".00";
    }
  }

  // send updated string to input
  input.val(input_val);

  // put caret back in the right position
  var updated_len = input_val.length;
  caret_pos = updated_len - original_len + caret_pos;
  input[0].setSelectionRange(caret_pos, caret_pos);
}
