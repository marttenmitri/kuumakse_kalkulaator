//Set default values
window.addEventListener('load', (event) => {
  document.getElementById("1").checked = true;
  calculate(document.getElementById("1"));
});

//Slider values
let Slider = document.getElementById("Slider");
let Selector = document.getElementById("Selector");
let SelectValue = document.getElementById("Selectvalue");
let ProgressBar = document.getElementById("ProgressBar");

//Output values
let interest_output = document.getElementById("interest_output"); 
let contract_output = document.getElementById("contract_output"); 
let service_output = document.getElementById("service_output"); 
let period_output = document.getElementById("period_output"); 
let totalsum_output = document.getElementById("totalsum_output"); 
let monthly_output = document.getElementById("monthly_output"); 

//Global data
let arraylist = [];
let payment_value;
let selected_category;
let default_credit;
let contract;
let managment;
let interest;
let selected_month;


//Read data from .csv
async function getData(){
    const response = await fetch('andmed.csv')
    const data = await response.text();
    
    const rows = data.split('\n').slice(2,16);

    rows.forEach(elt =>{
        const items = elt.split(';');
        arraylist.push(items);
    })

    document.getElementById("Slider").setAttribute('value', Slider.value);
    SelectValue.innerHTML = Slider.value + " €";
    Selector.style.left = parseInt(Slider.value / 250) + "%";
    ProgressBar.style.width = parseInt(Slider.value / 250) + "%";
    return arraylist;
}

//Function for manipulating data of selected radio button
 function manipulate_data(arraylist, is_radio){

//Gets positions of different categorys
  const solar = [0, 0];
  const pump = [1,3];
  const cars = [4,6];
  const off_grid = [7,9];
  const gas = [10,13];

  let selected_array = [];
  let category;

  
//Checks which category is selected and sets selected_array values
if(selected_category == 0){
  category = 0;
  selected_array = solar;
}else if(selected_category == 1){
    category = 1;
    selected_array = pump;
  }else if(selected_category == 2){
    category = 4;
    selected_array = cars;
  }else if(selected_category == 3){
    category = 7;
    selected_array = off_grid;
  }else if(selected_category == 4){
    category = 10;
    selected_array = gas;
  }

  default_credit = arraylist[category][6];


  if(is_radio){
    //if radio button is selected sets default values of that radio
    slider_value(default_credit);

  }else{
    //if not user can define its value by sliding
    slider_value(Slider.value);

  }

  //gets start and end point of the selected category from table in csv
  for(i = selected_array[0]; i <= selected_array[1];i++){
     
      //makes array of 2 spliting start and end point
      const ranges = arraylist[i][1].split('-');
     
      //checks if current value is in range
      if(parseInt(payment_value) <= parseInt(ranges[1]) && payment_value >= parseInt(ranges[0])){

          //gets all other values from selected range
          
          const Period = arraylist[i][5];
          const default_period = arraylist[category][7];
          interest = arraylist[i][2].replace("%", "").replace(",", ".");;
          contract = arraylist[i][3].replace(" €", "");
          managment = arraylist[i][4].replace(" €", "");

          let period_replace = Period.replace(" kuud", "").replace(" ", "");
          let period_new = period_replace.split("-");
          let period_start = parseInt(period_new[0]);
          let period_end = parseInt(period_new[1]);

          //calculate();
          calculate();
          if(is_radio){
            periods_between(period_start, period_end, default_period);
            calculate();
            
          }else{
            periods_between(period_start, period_end, selected_month);
          }

          //Prints out the values for user
          interest_output.innerHTML = interest + " %";
          contract_output.innerHTML = contract + " €";
          service_output.innerHTML = managment + " €";;
          break;
      }
  } 
  
}

//Creates selection list
function periods_between(start_period, end_period, default_period){

  let select_element;

  for(i = start_period; i <= end_period; i++){
      if(i == default_period){
        select_element += "<option selected='selected' value="+i+">"+i+" kuud</option>";
      }else if(i%6 == 0){
          //console.log(i);
          select_element += "<option class='selection' value="+i+1+">"+i+" kuud</option>";
      }
  }
  document.getElementById("Select_Box").innerHTML = select_element;
}

//Calculates and gets radio button values
function calculate(element){
  let radios = document.getElementsByName('radio');
  let submit_button = document.getElementById('submit_button');
  
  //Gets months and prints them out
  let get_month = document.getElementById("Select_Box").selectedIndex;
  selected_month = (parseInt(get_month) + 1)*6
  period_output.innerHTML = selected_month + " Kuud";
  
  //Gets deposit value and calculates total value
  let deposit = document.getElementById("deposit");
  let deposit_value;
  if(deposit.value == ""){
    deposit_value = 0;
  }else{
    deposit_value = parseFloat(deposit.value);
  }
  let total_value = parseInt(payment_value) - deposit_value;

  //Monthly payment calculation
  calculated_interest = (total_value / 100)*parseFloat(interest);
  let monthly_payment = ((total_value + parseInt(contract) + calculated_interest)/selected_month) +parseInt(managment);

  //Checks if deposit is valid

  if(total_value >= 300 && deposit_value >= 0){
      deposit.style.color = "green"; 
      totalsum_output.innerHTML = total_value + " €";
      monthly_output.innerHTML = monthly_payment.toFixed(2) + " €";
      submit_button.disabled = false;
  }else{
      deposit.style.color = "red";  
      totalsum_output.innerHTML = "";
      monthly_output.innerHTML = "";
      submit_button.disabled = true;
  }

  //If radio button is selected 
  if(typeof element !== "undefined" && element.name == "radio"){
    for (var i = 0, length = radios.length; i < length; i++) {
      if (radios[i].checked) { 
        selected_category = radios[i].value;
        getData().then(function(result) {manipulate_data(result, true);});
        break;
      }
    }
  }

  //If anything else but radio button is selected
  if(typeof element !== "undefined" && element.name !== "radio"){
     getData().then(function(result) {manipulate_data(result, false);});
  }

}

//Gets or sets slider values
function slider_value(slider_input){
  document.getElementById("Slider").value = slider_input;
    Selector.style.left = parseInt(slider_input / 250) + "%";
    ProgressBar.style.width = parseInt(slider_input / 250) + "%";  
    SelectValue.innerHTML = slider_input + " €";
    payment_value = slider_input;
}