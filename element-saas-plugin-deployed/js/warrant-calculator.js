console.log("Calculator Online")

// setup sample data for chart placeholder
var sampleWarrantData = [150000,0,0];
var sampleInterestData = [25000,0,0];
// Render Sample Chart
//define context for chart.
var ctx = jQuery('#loancomparison');
// Build the chart
var loanChart = new Chart(ctx, {
	type: 'bar',
	data: {
		labels: ["One", "Two", "Three"],
		datasets: [
			{
				label: 'Interest',
				data: sampleInterestData,
				hoverBackgroundColor: 'rgba(22, 45, 90, 1)',
				backgroundColor: [
					'rgba(22, 45, 90, 1)',
					'rgba(22, 45, 90, 1)',
					'rgba(22, 45, 90, 1)',
					'rgba(22, 45, 90, 1)'
				],
				borderColor: [
					'rgba(22, 45, 90, 1)'
				],
				borderWidth: 1
			},
			{
				label: 'Warrant',
				data: sampleWarrantData,
				hoverBackgroundColor: 'rgba(91, 204, 120, 1)',
				backgroundColor: [
					'rgba(91, 204, 120, 1)',
					'rgba(91, 204, 120, 1)',
					'rgba(91, 204, 120, 1)',
					'rgba(91, 204, 120, 1)'
				],
				borderColor: [
					'rgba(91, 204, 120, 1)'
				],
				borderWidth: 1
			},
		]
	},
	options: {
		scales: {
			xAxes: [{ stacked: true }],
			yAxes: [{ stacked: true,
				ticks: {
					callback: function(value, index, values) {
						if(isNaN(value)){
							return value
						} else {
							var n = parseFloat(value)
							return '$' + formatNumber(n.toFixed(0))
						}
					}
				}
			}]
		},
		responsive: true,
		maintainAspectRatio: false
});

// create loans array to be compared between form submissions
var loans = [ {title: 'One'}, {title: 'Two'}, {title: 'Three'}]
// Loan Position
var lP = 0

// Runs when the calculate button is clicked.
document.querySelector("#calculate").addEventListener('click', function (e) {
	//Cap the max number of loans at 3 (0, 1, 2)
	if(lP > 2) {
		lP = 0
	}
	// Set the index for the next loan
	var nextLoan = lP > 1 ? 0 : lP+1

	getValues()
	// If the NEXT loan already exists, tell the user they're updating a loan and not adding a new loan
	if(loans[nextLoan].html){
	 jQuery('#instructions').html(function(){
		 return (
			 "Update Loan " + loans[nextLoan].title
		 )
	 })
	}
	e.preventDefault();
 }, false);

function getValues(){
	//set the div string
	var div = document.getElementById("results");
	//in case of a re-calc, clear out the div!
	div.innerHTML = "";



	// shorthand for this specific loan
	var loan = loans[lP]

	//button click gets values from inputs
	loan.id = (lP + 1)
	loan.balance = parseFloat(Number(document.getElementById("loan_amount").value.replace(/[^0-9.-]+/g,"")));
	loan.interestRate = parseFloat(document.getElementById("interest_rate").value/100.0);
	loan.terms = parseInt(document.getElementById("term").value);
	loan.warrant = parseFloat(document.getElementById("warrant_amount").value/100.0);
	loan.valuation = parseFloat(Number(document.getElementById("valuation").value.replace(/[^0-9.-]+/g,"")));
	loan.growth = parseFloat(document.getElementById("growth").value/100.0);
	//Calculate the per month interest rate, payment, total cost of interest, warrant cost, and total cost of capital.
	loan.monthlyRate = (loan.interestRate/12)
	loan.payment = loan.balance * (loan.monthlyRate/(1-Math.pow(
			1+loan.monthlyRate, -loan.terms)))
  loan.interest_paid = (loan.payment * loan.terms) - loan.balance
	loan.saleValuation = findSaleValuation(loan.valuation, loan.terms, loan.growth);
	function findSaleValuation(currentValuation, terms, growth){
		// this function takes the growth per period and calculates compounding growth to determine how much the company will be worth at the end of the term.
		var output = currentValuation
		for (var i = 0; i < terms; ++i)
			{
				output += (output * growth)
			}
		return output
	}
	loan.warrant_cost = (loan.saleValuation * loan.warrant)
	loan.cost_of_capital = (loan.interest_paid + loan.warrant_cost)

	// Must call Amort after loan props are added.
	// loan.title = "Loan " + (lP+1)
	loan.html = buildCard(loans[lP])

	//validate inputs - display error if invalid, otherwise, display table
	var balVal = validateInputs(loan.balance);
	var intrVal = validateInputs(loan.interestRate);

	if (balVal && intrVal)
	{
		//Returns div string if inputs are valid
		div.innerHTML += renderResults(loans)
		// Increase loan position by one (causes the next form submission to save as the next loan)
		lP += 1
		// fill chart Canvases with data
		updateCharts(loans)
	}
	else
	{
		//returns error if inputs are invalid
		// TODO need an error-box so this doesn't update the entire div.
		div.innerHTML += "Please Check your inputs and retry - invalid values.";
	}
}


// var firstRender = true;

// Graph to display
function updateCharts(loans){

	var warrantData = [
		loans[0].warrant_cost ? loans[0].warrant_cost.toFixed(0) : '',
		loans[1].warrant_cost ? loans[1].warrant_cost.toFixed(0) : '',
		loans[2].warrant_cost ? loans[2].warrant_cost.toFixed(0) : '',
	]
	var interestData = [
		loans[0].interest_paid ? loans[0].interest_paid.toFixed(0) : '',
		loans[1].interest_paid ? loans[1].interest_paid.toFixed(0) : '',
		loans[2].interest_paid ? loans[2].interest_paid.toFixed(0) : '',
	]

// 	} else {
// // If this is the 2nd time a calculation has been run, update the chart.
	loanChart.data.datasets[0].data = interestData
	loanChart.data.datasets[1].data = warrantData
	loanChart.update()
	// firstRender = false;
}


// Combines the HTML from each loan into one HTML prop to place inside of the container DIV
function renderResults(loans){
	var html = ""
	loans.forEach(function(loan){
		if(loan.html){
				html = html + loan.html
		}
	})

	return html
}

//build the card for each loan's result.
function buildCard(loan){
    var result = "<div class='col-33 fl'><div class='ph-20 card'><h3 style='text-align:center;'>" + loan.title + "</h3>" +
				"<h4 style='color:#162d5a; padding-top: 15px; font-weight: 600'>Loan Details:</h4>" +
				"<p><span class='fw-sb'>Loan Amount:</span> $" + formatNumber(loan.balance.toFixed(0)) +  "<br /></p>" +
        "<p><span class='fw-sb'>Interest Rate:</span> " + (loan.interestRate*100).toFixed(2) + "%<br /></p>" +
        "<p><span class='fw-sb'>Term Length:</span> " + loan.terms + " Months<br /></p>" +
				"<p><span class='fw-sb'>Warrant:</span> " + (loan.warrant*100) + "%<br /></p>" +
				"<h4 style='color:#162d5a; padding-top: 15px; font-weight: 600'>Repayment Summary:</h4>" +
        "<p><span class='fw-sb'>Monthly Payment:</span> $" + formatNumber(loan.payment.toFixed(0)) + "<br /></p>" +
        "<p><span class='fw-sb'>Interest Paid:</span> $" +  formatNumber(loan.interest_paid.toFixed(0)) + "<br /></p>" +
				"<p><span class='fw-sb'>Warrant Value:</span> $" +  formatNumber(loan.warrant_cost.toFixed(0)) +  "<br /></p>" +
				"<p><span class='fw-sb'>Total Cost of Capital:</span> $" + formatNumber(loan.cost_of_capital.toFixed(0)) + "<br /></p>" +
				"<h4 style='color:#162d5a; padding-top: 15px; font-weight: 600'>Company Details:</h4>" +
				"<p><span class='fw-sb'>Starting Valuation:</span> $" + formatNumber(loan.valuation.toFixed(0)) + "<br /></p>" +
				"<p><span class='fw-sb'>Growth Rate:</span> " + (loan.growth*100).toFixed(2) + "%<br /></p>" +
				"<p><span class='fw-sb'>Sale Valuation:</span> $" + formatNumber(loan.saleValuation.toFixed(0)) + "<br /></p></div></div>"

	//returns the concatenated string to the page
    return result;
}

function validateInputs(value)
{
	//some code here to validate inputs
	if ((value == null) || (value == ""))
	{
		return false;
	}
	else
	{
		return true;
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
