let name;
let  age;

function confirmation(){
    let confirmation = confirm("Do you want to register?");
    start(confirmation);
}
function start(confirmation) {

  confirmation === false ? alert("Execution cancelled") : inicio();
}
function welcomeMessage(name) {
alert(`Welcome to the system, ${name}! Let's get started.`);
}
function validationName(){
    let v_loop = true
    while(v_loop == true){
    name = prompt("What is your name?:  ");
    try{
        switch(name){
            case "":
                throw new Error;
                break;
            case null:
                throw new Error;
                break;
            default:
                v_loop = false;
                break;
        }
        }catch(error){
            alert("Error: this camp cannot be empty.");
            continue
        }
    }
}
function validationAge(){
    let v_loop_age = true;
    while (v_loop_age == true) {
        age = prompt("what is your age?")
        if (age === null || age.trim() === "") {
            alert("Error: Please enter a age.");
            continue;
        }else if (isNaN(age)){
            alert("Error: Enter a number");
            continue
        }else if(age <= 0){
            alert("Error: Please enter a valid number greater than 0.");
            continue            
        }

    v_loop_age = false; 
    }
}
function  adultVerification(age){
    let msj = age < 18 ?  "You are a minor": `Hello ${name}, you are of legal age. Get ready for great opportunities in the world of programming!`
    alert(msj)
}
function registrationComplete() {
alert("Success! You are now registered.");
}
function inicio(){
    validationName();
    welcomeMessage(name)
    validationAge();
    adultVerification(age)
    registrationComplete()
}

  