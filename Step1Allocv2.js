

/** Constructor for the Allocation Data - One of my biggest issues with this program has been making use of the duck typing that javascript 'forces' upon you, but this has proven to be very painful, I have tried to statically type the element data that is called from the DOMs. Ideally i would move to typescript instead of javascript for future reference. If scripts are to be rewritten in the future, preferably move in that direction.*/

/**
 * Object Constructor for the Allocation Data DOM Elements
 * @param {*} POWER DOM Element retrieved from html 'index' file - Generation/Load Capacity
 * @param {*} VOLTAGE DOM Element retrieved from html 'index' file - PCC Volts
 * @param {*} SHORT_CIRCUIT_LEVEL DOM Element retrieved from html 'index file' - Short Circuit Level
 * @param {*} POWER_FACTOR DOM Element retrieved from html 'index' file - Power Factor
 */

function Step_One_Allocation_Data(POWER, VOLTAGE, SHORT_CIRCUIT_LEVEL, POWER_FACTOR) {
    typeof(POWER)===Number ?this.power=POWER:this.power=Number(POWER);  // Power Var --> converts to a number if the POWER arg is not given as a number
    typeof(VOLTAGE)===Number ?this.voltage=VOLTAGE:this.voltage=Number(VOLTAGE);    // Voltage Var --> converts to a number if the POWER arg is not given as a number
    typeof(short_circuit_level)===Number ?this.short_circuit_level=SHORT_CIRCUIT_LEVEL:this.short_circuit_level=Number(SHORT_CIRCUIT_LEVEL);    // Short Circuit Level (MVA) Var --> converts to a number if the POWER arg is not given as a number
    typeof(POWER_FACTOR)===Number ?this.power_factor=POWER_FACTOR:power_factor=Number(POWER_FACTOR);   // Power Factor Var --> converts to a number if the POWER arg is not given as a number
    this.current = this.power/this.voltage/(3 ** (1/2));
    this.short_circuit_ratio = this.short_circuit_level/this.current;
}

var Allocation = new Step_One_Allocation_Data();

// This statement calls the Step_One_Allocation_Data(args) constructor to store the data from the step 1 allocation.
//var Step_One_Allocation = new Step_One_Allocation_Data();

/*
var voltage;
var AuthPower;
var PowerFactor;
var ShortCircuitLvl;
*/

/** @Call_Data_Py Calls the python API that accesses and creates asset classes based on Ellipse Data */ 
function Call_Data_Py() {
    $.ajax({
        type: "POST",
        url: "~/Py_Database_Access.py",
        data: { param: text}
    }).done(function( o ) {
        // do something
    });
}

/** @Step1_main */

function Step1_main() {
    $("#resultsSuccessForm").hide();
    $("#resultsFailedForm").hide();
    $("#resultsNAForm").hide();
    $("#Results").hide();
    if (document.getElementById("3P_AgrLoad").value==="Yes") {
        Disable_Init_Contents();
        console.log("AgrLoad = Yes")
        $("#resultsSuccessForm").show();
    } else if (document.getElementById("3P_AgrLoad").value==="No") {
        Enable_Init_Contents();
    }
}

/** @Disable_Init_Contents */

function Disable_Init_Contents() {
    document.getElementById("3P_PowerInp").disabled = true;
    document.getElementById("3P_PowElec").disabled = true;
    document.getElementById("3P_GenInp").disabled = true;
    Disable_Contents();
}

/** @Enable_Init_Contents */

function Enable_Init_Contents() {
    document.getElementById("3P_PowerInp").disabled = false;
    document.getElementById("3P_GenInp").disabled = false;
    document.getElementById("3P_PowElec").disabled = false;
}

/** @Disable_Contents */

function Disable_Contents() {
    document.getElementById("3P_PowerFactor").disabled = true;
    document.getElementById("3P_SCRatio").disabled = true;
    document.getElementById("PFSCbtn").disabled = true;
}

/** @Enable_Contents */

function Enable_Contents() {
    document.getElementById("3P_PowerFactor").disabled = false;
    document.getElementById("3P_SCRatio").disabled = false;
    document.getElementById("PFSCbtn").disabled = false;
}


function Sub_SP_Step1() {
    Allocation.voltage = 230;
    Step1_main();
    console.log(Number(document.getElementById("SP_PowerInp").value) + Number(document.getElementById("SP_GenInp").value));

    if (document.getElementById("SP_SWERInp").value==="No") {
        if (Number(document.getElementById("SP_PowerInp").value) + Number(document.getElementById("SP_GenInp").value) <= 5){
            $("#resultsSuccessForm").show();
        } else {
            $("#resultsFailedForm").show();
        }
    } else {
        if (document.getElementById("SP_PowerInp").value + document.getElementById("SP_GenInp").value <= 3.5) {
            $("#resultsSuccessForm").show();
        } else  {
            $("#resultsFailedForm").show();
        }
    }
}

function ThreePh_main(Conditions) {
    Allocation.voltage = 400;
    Allocation.power = Number(document.getElementById("3P_PowerInp").value) + Number(document.getElementById("3P_GenInp").value);
    var PowerElec = document.getElementById("3P_PowElec").value;
    console.log(PowerElec);
    Step1_main();
    if (Conditions===true) {
        if (Allocation.power<=10 && PowerElec=="6_Pulse") {
            $("#resultsSuccessForm").show();
            Disable_Contents()
        } else if (Allocation.power>10 && PowerElec=="6_Pulse") {
            Enable_Contents()
        } else if (Allocation.power<=30 && PowerElec=="12_Pulse") {
            $("#resultsSuccessForm").show();
            Disable_Contents()
        } else if (Allocation.power>30 && PowerElec=="12_Pulse") {
            Enable_Contents()
        } else if (PowerElec=="Not_PowElec") {
            Enable_Contents()
        }
    } else if (Conditions===false) {
        document.getElementById("3P_PowerInp").value="";
        Disable_Contents();
    }
}

function ThreePh_main_2() {
    Allocation.short_circuit_level = document.getElementById("3P_SCRatio").value;
    Allocation.power_factor = document.getElementById("3P_PowerFactor").value;
    if (Allocation.power<=1500) {
        // Take ShortCircuitRatio and do calculations
        csvCalcs();
    } else {
        $("#resultsFailedForm").show();
    }
}


function csvCalcs() {
    let Al = Allocation
    Al.current = Al.power/(1.73*Al.power_factor*Al.voltage)*1000;
    var current_fixed = Al.current.toFixed(2);
    Al.short_circuit_ratio = Al.short_circuit_level*1000/Al.power;
    var short_circuit_ratio_fixed = Al.short_circuit_ratio.toFixed(2);
    //var ShortCircuitCurrent = 
    var filename = "iec519table2.csv";
    document.getElementById("SCRatio").innerHTML = short_circuit_ratio_fixed;
    document.getElementById("Load_Current").innerHTML = current_fixed + " Amps"

    if (Al.short_circuit_level == 0 || Al.power_factor == 0) {
        alert('Please Enter a Value for both the Short Circuit Level and the Power Factor');
    } else {
        if (Al.short_circuit_ratio<=20) {
            getCSVfile_Limits(0, 1, filename, "HarmonicArray", "Harmonic Order h", "Emission Limit (% Load Current I<sub>L</sub>)", "Emission Limit (A)", Al.current);
            $("#Results").show();
        } else if (Al.short_circuit_ratio>20 && Al.short_circuit_ratio<=50) { 
            getCSVfile_Limits(0, 2, filename, "HarmonicArray", "Harmonic Order h", "Emission Limit (% Load Current I<sub>L</sub>)", "Emission Limit (A)", Al.current);
            $("#Results").show();
        } else if (Al.short_circuit_ratio>50 && Al.short_circuit_ratio<=100) {
            getCSVfile_Limits(0, 3, filename, "HarmonicArray", "Harmonic Order h", "Emission Limit (% Load Current I<sub>L</sub>)", "Emission Limit (A)", Al.current);
            $("#Results").show();
        } else if (Al.short_circuit_ratio>100 && Al.short_circuit_ratio<=1000) {
            getCSVfile_Limits(0, 4, filename, "HarmonicArray", "Harmonic Order h", "Emission Limit (% Load Current I<sub>L</sub>)", "Emission Limit (A)", Al.current);
            console.log(Al.current)
            $("#Results").show();
        } else if (Al.short_circuit_ratio>1000) {
            getCSVfile_Limits(0, 5, filename, "HarmonicArray", "Harmonic Order h", "Emission Limit (% Load Current I<sub>L</sub>)", "Emission Limit (A)", Al.current);
            $("#Results").show();
        }
    }
}

Disable_Contents();
Step1_main();
