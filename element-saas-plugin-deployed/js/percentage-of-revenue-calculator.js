console.log("Percentage of Revenue Calculator 3")
// Render Sample Chart
//define context for chart.
var sampleNoGrowthData = [7891.17, 15782.34, 23673.51, 31564.68, 39455.85, 47347.02, 55238.18, 63129.35, 71020.52, 78911.69, 86802.86, 94694.03, 102585.20, 110476.37, 118367.54, 126258.71, 134149.88, 142041.05, 149932.22, 157823.38, 165714.55, 173605.72, 181496.89, 189388.06, 197279.23, 205170.40, 213061.57, 220952.74, 228843.91, 236735.08, 244626.25,
	 252517.42, 260408.59, 268299.75, 276190.92, 284082.09, 291973.26, 299864.43, 307755.60, 315646.77, 323537.94, 331429.11, 339320.28, 347211.45, 355102.62, 362993.79, 370884.95, 378776.12, 386667.29, 394558.46, 402449.63, 410340.80, 418231.97, 426123.14, 434014.31, 441905.48, 449796.65, 457687.82, 465578.99, 473470.15];
var sampleEstimateData = [7891.17, 15940.16, 24150.13, 32524.31, 41065.96, 49778.45, 58665.19, 67729.66, 76975.42, 86406.10, 96025.39, 105837.07, 115844.98, 126053.05, 136465.28, 147085.75, 157918.64, 168968.18, 180238.71, 191734.66, 203460.52, 215420.90, 227620.49, 240064.07, 252756.52, 265702.82, 278908.04, 292377.37, 306116.09, 320129.58, 334423.34,
	 349002.98, 363874.20, 379042.86, 394514.88, 410296.35, 426393.45, 442812.49, 459559.90, 476642.27, 494066.29, 511838.78, 529966.73, 548457.23, 567317.54, 586555.06, 606177.33, 626192.05, 646607.06, 667430.37, 688670.15, 710334.72, 732432.58, 754972.40, 777963.02, 801413.45, 825332.89, 849730.72, 874616.50, 900000.00];
var sampleExceedData = [7891.17, 16176.90, 24876.91, 34011.93, 43603.69, 53675.05, 64249.97, 75353.63, 87012.49, 99254.28, 112108.16, 125604.74, 139776.15, 154656.12, 170280.10, 186685.27, 203910.70, 221997.41, 240988.45, 260929.04, 281866.66, 303851.16, 326934.89, 351172.80, 376622.61, 403344.91, 431403.33, 460864.66, 491799.07, 524280.19, 558385.37,
	 594195.81, 631796.77, 671277.77, 712732.83, 756260.64, 801964.84, 849954.26, 900000.00];

var sampleLabels = ["Month 1", "Month 2", "Month 3", "Month 4", "Month 5", "Month 6", "Month 7", "Month 8", "Month 9", "Month 10", "Month 11", "Month 12", "Month 13", "Month 14", "Month 15", "Month 16", "Month 17", "Month 18", "Month 19",
 "Month 20", "Month 21", "Month 22", "Month 23", "Month 24", "Month 25", "Month 26", "Month 27", "Month 28", "Month 29", "Month 30", "Month 31", "Month 32", "Month 33", "Month 34", "Month 35", "Month 36", "Month 37", "Month 38", "Month 39",
 "Month 40", "Month 41", "Month 42", "Month 43", "Month 44", "Month 45", "Month 46", "Month 47", "Month 48", "Month 49", "Month 50", "Month 51", "Month 52", "Month 53", "Month 54", "Month 55", "Month 56", "Month 57", "Month 58", "Month 59",
 "Month 60"]

var ctx = jQuery('#rbfchart');
// Build the chart
var loanChart = new Chart(ctx, {
	type: 'line',
	data: {
		labels: sampleLabels,
		datasets: [
			{
				label: 'Without Growth',
				data: sampleNoGrowthData,
				borderColor: 'rgba(253, 175, 59, 1)',
				pointBorderColor: 'rgba(253, 175, 59, 1)',
				pointBackgroundColor: 'rgba(253, 175, 59, 1)',
				pointHoverBackgroundColor: 'rgba(253, 175, 59, 1)',
				pointHoverBorderColor: 'rgba(253, 175, 59, 1)',
				fill: false
			},
			{
				label: 'Projected Growth',
				data: sampleEstimateData,
				borderColor: 'rgba(22, 45, 90, 1)',
				pointBorderColor: 'rgba(22, 45, 90, 1)',
				pointBackgroundColor: 'rgba(22, 45, 90, 1)',
				pointHoverBackgroundColor: 'rgba(22, 45, 90, 1)',
				pointHoverBorderColor: 'rgba(22, 45, 90, 1)',
				fill: false
			},
			{
				label: 'Double Growth',
				data: sampleExceedData,
				borderColor: 'rgba(91, 204, 120, 1)',
				pointBorderColor: 'rgba(91, 204, 120, 1)',
				pointBackgroundColor: 'rgba(91, 204, 120, 1)',
				pointHoverBackgroundColor: 'rgba(91, 204, 120, 1)',
				pointHoverBorderColor: 'rgba(91, 204, 120, 1)',
				fill: false
			},
		]
	},
	options: {
		scales: {
			yAxes: [{
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
	}
});


// Find Interest Rate
var findPayment = function(balance, rate, periods, ){
  var payment = balance * (rate/(1-Math.pow(1+rate, -periods)))
      return payment
}


var findEffectiveRate =  function (loanAmount, amountPaid, periods, guess){
  // Guess must be an annual rate
  var x = guess
  var payment = amountPaid/periods

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
  return x;
}

// Runs when the calculate button is clicked.
document.querySelector("#calculate").addEventListener('click', function (e) {
	e.preventDefault();
  calculate()
}, false);

function  calculate(){
	var div = document.getElementById("results");
	var display = document.getElementById("display");
	//in case of a re-calc, clear out the div!
	div.innerHTML = "";
	display.innerHTML = "";
  var data = {}
  // Get values
  var loanAmount = parseFloat(Number(document.getElementById("loan_amount").value.replace(/[^0-9.-]+/g,"")));
  var currentRevenue = parseFloat(Number(document.getElementById("current_revenue").value.replace(/[^0-9.-]+/g,"")));
  var growthRate = parseFloat(document.getElementById("growth_rate").value/100.0);
  var paybackMultiple = parseFloat(document.getElementById("payback_multiple").value);
	var term = parseInt(document.getElementById("term").value);

	var amountOwed = loanAmount * paybackMultiple
	// var percentageOfRevenue = amountOwed / totalRevenue
	var percentageOfRevenue = (
		((loanAmount/currentRevenue*paybackMultiple)*(0 - growthRate))*1/(1-(Math.pow((1+growthRate),term)))
	)
// Calculate Array of payments
	// Create array with first month's payment
	var payments = [(currentRevenue*percentageOfRevenue),]
	var exceededPayments = [(currentRevenue*percentageOfRevenue),]

	// Store cumulative amount paid for graphs
	var cumulatives = {
		noGrowth: [(currentRevenue*percentageOfRevenue)],
		estimate: [(currentRevenue*percentageOfRevenue)],
		exceeded: [(currentRevenue*percentageOfRevenue)]
	}

	// Find all payments except the last payment.
	var compounding = currentRevenue
	var compNoGrowth = currentRevenue
	var compExceeded = currentRevenue
	var paidInFull = false
	var currentPayment = 0
	var currentExceededPayment
	for (var i = 0; i < (term - 1); ++i){
		// find payment
		compounding = compounding + (compounding * growthRate)
		currentPayment = compounding * percentageOfRevenue
		payments.push(currentPayment)
		// Find payment for exceeding growth (Same as above but with double growth rate)
		compExceeded = compExceeded + (compExceeded * growthRate * 2)
		currentExceededPayment = compExceeded * percentageOfRevenue

		// populate the cumulative value of payments for charting
		cumulatives.noGrowth.push(cumulatives.noGrowth[i] + (compNoGrowth * percentageOfRevenue))
		cumulatives.estimate.push(cumulatives.estimate[i] + (compounding * percentageOfRevenue))
		// see if the loan would be overpaid (only applies to exceeded growth rate)
		if((cumulatives.exceeded[i] + (compExceeded * percentageOfRevenue)) < amountOwed){
			cumulatives.exceeded.push(cumulatives.exceeded[i] + (compExceeded * percentageOfRevenue))
			exceededPayments.push(currentExceededPayment)
		// If the loan has already been paid off, pay nothing.
		} else if(paidInFull){
		// Else, if the amount paid would be more than the original amount owed...
		// ... pay exactly the remainder of the loan.
		} else {
				paidInFull = true;
				cumulatives.exceeded.push(amountOwed)
				exceededPayments.push(amountOwed - cumulatives.exceeded[i])
		}
	}

// TODO use this or remove this.
	// Make sure last payment is exact
	var amountPaid = payments.reduce(function(a, b){
		return a + b;
	}, 0);

	//Error Handling
	var error = ''
	if(paybackMultiple < 1){
    error = "ERROR: Payback Multiple Must be 1 or greater"
  } else if(!paybackMultiple){
    error = "ERROR: Please specify a payback multiple."
  } else if(!loanAmount){
    error = "ERROR: Please enter a loan amount."
  } else if(!term){
    error = "ERROR: Please enter a term length."
  } else if(!currentRevenue){
    error = "ERROR: Please enter your current revenue."
  } else if(!growthRate){
    error = "ERROR: Please enter an expected growth rate."
  }

	if(error){
		display_error.innerHTML = error
		display_error.style.display = "block";
	} else {
		 display_error.style.display = "none";
		// Update Chart
		updateChart(cumulatives.noGrowth, cumulatives.estimate, cumulatives.exceeded)

		// Calculate the Internal Rate of Return (IRR) on both projected growth and exceeded growth payments
		var finance = new Finance()
		// finance-js required a very specific format to calculate IRR, which requires the first value in the array be the amount of the original investment in a negative form
		payments.splice(0,0, -Math.abs(loanAmount))
		var estimatedIRR = finance.IRR.apply(this, payments)
		// finance-js required a very specific format to calculate IRR, which requires the first value in the array be the amount of the original investment in a negative form
		exceededPayments.splice(0,0, -Math.abs(loanAmount))
		var exceededIRR = finance.IRR.apply(this, exceededPayments)

		var effectiveRate = findEffectiveRate(loanAmount, amountOwed, term, estimatedIRR)
		var effectiveExceededRate = findEffectiveRate(loanAmount, amountOwed, (cumulatives.exceeded.length), exceededIRR)


		// Update Details on page
	  div.innerHTML =
		// First card
				"<div class='col-33 fl'><div class='ph-20 card' style='border-top: solid rgba(253, 175, 59, 1)'><h4 style='color:#162d5a; padding-top: 15px; font-weight: 600'>Without Growth</h4>" +
				"<p><span class='fw-sb'>Amount Still Owed at End of Term:</span> $"  + formatNumber((amountOwed - cumulatives.noGrowth[cumulatives.noGrowth.length - 1]).toFixed(0)) + "<br /></p>" +
		// Second card
				"</div></div><div class='col-33 fl'><div class='ph-20 card' style='border-top: solid rgba(22, 45, 90, 1)'>" +
				"<h4 style='color:#162d5a; padding-top: 15px; font-weight: 600'>Projected Growth</h4>" +
				"<p><span class='fw-sb'>Required % of Revenue:</span> " + (percentageOfRevenue*100).toFixed(2) + "%<br /></p>" +
				"<p><span class='fw-sb'>Cost of Capital:</span> $" + formatNumber((amountOwed - loanAmount).toFixed(0)) + "<br /></p>" +
				"<p><span class='fw-sb'>Effective Annual Interest Rate:</span> " + (effectiveRate*100).toFixed(2)+ "%<br /></p>" +
		// Third Card
				"</div></div><div class='col-33 fl'><div class='ph-20 card' style='border-top: solid rgba(91, 204, 120, 1)'><h4 style='color:#162d5a; padding-top: 15px; font-weight: 600'>Double Growth</h4>" +
				"<p><span class='fw-sb'>Growth Rate:</span> " + growthRate * 2*100 +  "%<br /></p>" +
				"<p><span class='fw-sb'>Time to Repayment:</span> " + cumulatives.exceeded.length +  " Months<br /></p>" +
				"<p><span class='fw-sb'>Effective Annual Interest Rate:</span> " + (effectiveExceededRate*100).toFixed(2) + "%<br /></p></div></div>"

	 // Add required percentage of revenue to display DIV
			display.innerHTML = (percentageOfRevenue*100).toFixed(2) + "%"
	}
}


function updateChart(noGrowth, estimate, exceeded){
	var rndExceeded = []
	var rndEstimate = []
	var rndNoGrowth = []
	var labels = []
	exceeded.forEach(function(n){
		rndExceeded.push(Math.round(n *1e2) / 1e2)
	})
	noGrowth.forEach(function(n){
		rndNoGrowth.push(Math.round(n *1e2) / 1e2)
	})
	estimate.forEach(function(n){
		rndEstimate.push(Math.round(n *1e2) / 1e2)
	})

	// Create new label array
	for (var i = 0; i < (estimate.length); ++i){
		labels.push('Month ' + (i+1))
	}

	loanChart.data.datasets[0].data = rndNoGrowth
	loanChart.data.datasets[1].data = rndEstimate
	loanChart.data.datasets[2].data = rndExceeded
	loanChart.data.labels = labels
	loanChart.update()
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
