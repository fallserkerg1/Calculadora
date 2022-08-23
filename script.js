

function main_chart(a, b, c, d) {
    // Build the chart
    Highcharts.chart('chart_container', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: ''
        },
        tooltip: {
            pointFormat: '<b>${point.y}</b>' + ' ({point.percentage:.1f}%)'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                borderWidth: 4,
                animation: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                shadow: {
                    color: '#aaa',
                    offsetX: '1',
                    offsetY: '1',
                    opacity: '.3',
                    width: '8'
                },
                //showInLegend: true
            }
        },
        "colors": ["#28a745", "#7bd896", "#8bc34a", "#cddc39"],
        "credits": { "enabled": false },
        "legend": {
            "enabled": true,
            "layout": "horizontal",
            "floating": false,
            "borderWidth": 1,
            "borderRadius": 5,
            "squareSymbol": true,
            "shadow": false,
            "rtl": false,
            "reversed": false,
            "symbolPadding": 5,
            "symbolRadius": 2
        },
        series: [{
            name: 'Brands',
            colorByPoint: true,
            size: "100%",
            innerSize: "70%",
            "borderWidth": "5",
            data: [{
                name: 'Principal And Interest',
                y: (a).toFixed(0) * 1,

            }, {
                name: 'Homeownwer\'s Insurance',
                y: (b).toFixed(0) * 1,
            }, {
                name: 'Property Tax',
                y: (c).toFixed(0) * 1,
            }, {
                name: 'HOA fees',
                y: (d).toFixed(0) * 1,
            }]
        }]
    });

}


function sanitize_input(x) {
    return x.replace(/\$|,| |%/gi, "") * 1;
}


function scrollTop() {
    //Scroll Top Functions
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}


//MAKE PURCHASE PRICE VAR GLOBAL
var purchase_price;

function calculate() {


    //Variable required and their respective values (You can change the values)
    var rate = (document.getElementById('rate').value) * 1;
    var total_installments = (document.getElementById('term').value) * 12;
    var principal_amount;
    purchase_price = sanitize_input(document.getElementById('purchase_price').value);
    var sale_percentage;
    var down_payment = sanitize_input(document.getElementById('down_payment_percentage').value);
    var installment;
    var insurance = sanitize_input(document.getElementById('legend_2').value);
    var property_tax = sanitize_input(document.getElementById('legend_3').value);
    var hoa_fee = sanitize_input(document.getElementById('legend_4').value), monthly_payment = 0;
    sale_percentage = 100 - down_payment;
    principal_amount = (purchase_price / 100) * sale_percentage;


    //Compund Interest Calculation
    var rate_effective = rate / 1200;
    var factor = Math.pow((1 + rate_effective), total_installments);
    installment = (principal_amount * (rate_effective * factor)) / (factor - 1);
    var balance = principal_amount;
    var total_interest = 0;

    monthly_payment = installment + property_tax + insurance + hoa_fee;

    //Amortization Table Printing
    var table_string = '<div class="table-responsive"> <table class="table table-striped table-condensed table-responsive"><thead><tr><th>#</th><th>Payment</th><th>Interest</th><th>Principal</th><th>Cumulative Interest</th><th>Balance</th></tr></thead><tbody>';
    for (i = 1; i <= total_installments; ++i) {
        var current_interest = balance * rate_effective;
        var current_principal = installment - current_interest;
        total_interest += current_interest;
        balance -= current_principal;
        table_string += '<tr><td>' + i + '</td><td>' + Math.round(installment) + '</td><td>' + Math.round(current_interest) + '</td><td>' + Math.round(current_principal) + '</td><td>' + Math.round(total_interest) + '</td><td>' + Math.round(balance) + '</td></tr>';


    }
    table_string += '</tbody></table></div>';


    //Legend and monthly payment printing
    document.getElementById('table').innerHTML = table_string;
    document.getElementById('installment_output').innerHTML = "$" + ((monthly_payment).toFixed(0) * 1).toLocaleString() + '</br>';
    document.getElementById('installment_output_1').innerHTML = "$" + ((monthly_payment).toFixed(0) * 1).toLocaleString() + '</br>';

    //legeng printing
    document.getElementById('legend_1').innerHTML = "$" + ((installment).toFixed(0) * 1).toLocaleString();
    // document.getElementById('legend_2').value = "$" + ((insurance).toFixed(0) * 1).toLocaleString();
    // document.getElementById('legend_3').value = "$" + ((property_tax).toFixed(0) * 1).toLocaleString();
    // document.getElementById('legend_4').value = "$" + ((hoa_fee).toFixed(0) * 1).toLocaleString();

    document.getElementById('installment_output_2').innerHTML = "$" + ((monthly_payment).toFixed(0) * 1).toLocaleString() + '</br>';


    //CAll the chart function
    main_chart(installment, insurance, property_tax, hoa_fee);
}

calculate();

function update(x) {
    if (x) {
        var this_value = sanitize_input(x.value);
        if (isNaN(this_value)) {
            alert('Invalid Input');
            x.value = x.name + 0;
            //CHECK IF IT IS DOWNPAYMENT FIELD
            if (x.id == 'down_payment') {
                update_percentage(x.id);
            }

        } else {
            x.value = x.name + (this_value).toLocaleString();
            //CHECK IF IT IS DOWNPAYMENT FIELD
            if (x.id == 'down_payment') {
                update_percentage(x.id);
            }

            //If it is purchase price field, then update its slider value
            if (x.id === 'purchase_price') {
                document.getElementById('purchase_priceSlider').value = sanitize_input(x.value);
            }
        }
    }

    calculate();
}

function update_down_payment_percentage(x) {
    var this_value = x.value;
    if (isNaN(this_value)) {
        alert('Invalid Input');
        x.value = x.name + 0;
        //CHECK IF IT IS DOWNPAYMENT FIELD
        update_percentage('down_payment_percentage');
    }

    update_percentage('down_payment_percentage');
    calculate();
}


function update_percentage(x) {

    purchase_price = sanitize_input(document.getElementById('purchase_price').value);
    if (x == 'down_payment') {
        var value = sanitize_input(document.getElementById('down_payment').value);
        var updated_percentage = (value / purchase_price) * 100;

        //Update input field
        document.getElementById('down_payment_percentage').value = (updated_percentage).toFixed(2);
    } else if (x == 'down_payment_percentage') {
        var value = document.getElementById('down_payment_percentage').value;
        var updated_down_payment = purchase_price * (value / 100);

        //Update input field
        document.getElementById('down_payment').value = "$" + ((updated_down_payment).toFixed(0) * 1).toLocaleString();
    }


    //Call Calculate Functipn
    calculate();
}

function updateSlider(x) {
    var effected_field = (x.id).replace('Slider', '');
    document.getElementById(effected_field).value = '$' + (x.value * 1).toLocaleString();

    calculate();
}

//Toggle  Panels
function toggle_panels(x) {
    var target = (x.id).replace('activate-', '');

    if (x.id == 'activate-result_panel_1' || x.id == 'activate-result_panel_2') {
        //Hide all Panels
        document.getElementById('result_panel_1').style.display = 'none';
        document.getElementById('result_panel_2').style.display = 'none';

        //Remove active class from activator tabs
        document.getElementById('activate-result_panel_1').classList.remove('active');
        document.getElementById('activate-result_panel_2').classList.remove('active');

        //Now display the target panel and set active class to target tab
        document.getElementById(x.id).classList.add('active');
        document.getElementById(target).style.display = 'block';
    } else {
        //Hide all Panels
        document.getElementById('mortgage_panel').style.display = 'none';
        document.getElementById('dti_panel').style.display = 'none';

        //Remove active class from activator tabs
        document.getElementById('activate-mortgage_panel').classList.remove('active_md');
        document.getElementById('activate-dti_panel').classList.remove('active_md');

        //Now display the target panel and set active class to target tab
        document.getElementById(x.id).classList.add('active_md');
        document.getElementById(target).style.display = 'block';

        //Call Scroll Top Function
        scrollTop();
    }


}


//Sanitize DTI fields Input
let form = document.querySelector("#dti_form");
form.addEventListener("input", (evt) => {
    let trg = evt.target;
    if (trg.type === "tel") {
        let value = sanitize_input(trg.value);

        if (isNaN(value)) {
            alert('Invalid Input');
            trg.value = '$' + 0;
        } else {
            trg.value = '$' + value.toLocaleString()
        }
    }

    if (trg.type === "range" || trg.id === 'dti_income') {
        document.getElementById('income_output').innerHTML = '$' + (sanitize_input(trg.value)).toLocaleString();
        //Update Slider As well
        document.getElementById('dti_incomeSlider').value = (sanitize_input(trg.value));
    }
}, false);





//Calculate DTI
function calculate_dti() {
    let total_debt = 0, dti = 0;
    let dti_form = document.querySelector("#dti_form");
    let inputs = dti_form.getElementsByTagName('input');
    for (i = 0; i < inputs.length; i++) {
        if (inputs[i].type === 'tel' && inputs[i].id != 'dti_income') {
            total_debt += sanitize_input(inputs[i].value) * 1;
        }
    }

    let total_income = sanitize_input(document.getElementById('dti_income').value);
    dti = ((total_debt / total_income) * 100).toFixed(2);

    document.getElementById('dti_output').innerHTML = dti + '%';
}



//Remove $0 on click for legend input fields
let legend_form = document.querySelector(".legend_list");
legend_form.addEventListener("click", (evt) => {
    let trg = evt.target;
    if (trg.type === "tel" && trg.value === '$0') {
        trg.value = '';

    }
}, false);