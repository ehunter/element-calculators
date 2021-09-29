// setup sample data for chart placeholder
var sampleWarrantData = 150000;
var sampleInterestData = 25000;
// Render Sample Chart
//define context for chart.
var ctx = jQuery('#debt-vs-equity-chart');
// Build the chart
var financingChart = new Chart(ctx, {
	type: 'bar',
	data: {
		labels: ["Debt", "Equity",],
		datasets: [
			{
				// label: ['Debt', 'Equity'],
				data: [sampleInterestData, sampleWarrantData,],
				hoverBackgroundColor: [
          'rgba(22, 45, 90, 1)',
          'rgba(91, 204, 120, 1)',
        ],
				backgroundColor: [
					'rgba(22, 45, 90, 1)',
					'rgba(91, 204, 120, 1)',
				],
				borderColor: [
					'rgba(22, 45, 90, 1)',
          'rgba(91, 204, 120, 1)',
				],
				borderWidth: 1
			},
		]
	},
	options: {
    legend: {
        display: false
    },
    tooltips: {
        callbacks: {
           label: function(tooltipItem) {
                  return tooltipItem.yLabel;
           }
        }
    },
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
					},
          beginAtZero: true,
				}
			}]
		}
	}
});

// Runs when the calculate button is clicked.
document.querySelector("#calculate").addEventListener('click', function (e) {
	e.preventDefault();
  calculate()
}, false);

function  calculate(){
  var data = {}
  // Get values
  data.fundingAmount = parseFloat(Number(document.getElementById("funding_amount").value.replace(/[^0-9.-]+/g,"")));
  data.valuation = parseFloat(Number(document.getElementById("valuation").value.replace(/[^0-9.-]+/g,"")));
  data.equityPercentage = parseFloat(document.getElementById("equity_percentage").value/100.0);
  data.interestRate = parseFloat(document.getElementById("interest_rate").value/100.0);
	data.terms = parseInt(document.getElementById("term").value);
	data.monthlyRate = (data.interestRate/12)
  data.payment = data.fundingAmount * (data.monthlyRate/(1-Math.pow(
			1+data.monthlyRate, -data.terms)))
  data.interestCost = (data.payment * data.terms) - data.fundingAmount
	data.equityCost = (data.valuation * data.equityPercentage)
  updateChart(data.interestCost, data.equityCost)
}

// Graph to display
function updateChart(debtCost, equityCost){
	financingChart.data.datasets[0].data[0] = Number(debtCost.toFixed(0))
	financingChart.data.datasets[0].data[1] = Number(equityCost.toFixed(0))
	financingChart.update()
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
