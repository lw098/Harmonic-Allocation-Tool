/** @file Step 2 Allocation */



// ** Variable Descriptions **
// LVEmiss is the planning levels for the hth harmonic of the LV System
// MVEmiss is the planning levels for the hth harmonic of the MV System
// GlobalEmiss is the total global contribution to the hth harmonic voltage anywehere in the LV SYstem
// TransferCo is the Transfer Coefficient of the hth harmonic voltage from the upstream MV System to the LV System


// Declaration of Variables used throughout Step 2 Harmonic Allocation Script
var GlobalEmiss=[], LVEmiss, MVEmiss, TransferCo, Alpha, Si, St, EUhi=[], EIhi=[], EUhi_Fixed=[];
var ST_Table_No = 1;
var MVST_Table_No = 1;
var SetValue_TransferCo;
var TransferInt_No = 1;
var MV_TransferInt_No = 1
var Str;


// main_3() initialises step 2 harmonic allocation
function main_3() {
    $("#Step2Results").hide();
    $("#Step2MVResults").hide();
    document.getElementById("MV").addEventListener("change", function(){
        $("#Step2Results").hide();
    })
    document.getElementById("Si").addEventListener("change", function(){
        $("#Step2Results").hide()
    })
    document.getElementById("Str_Options").addEventListener("change", function(){
        $("#Step2Results").hide()
    })
    document.getElementById("Step2Sub").addEventListener("click", function(){
        $("#Step2Results").show();
    })
    document.getElementById("MV1").addEventListener("change", function(){
        $("#Step2MVResults").hide();
    })
    document.getElementById("HV1").addEventListener("change", function(){
        $("#Step2MVResults").hide();
    })
    document.getElementById("Si_MV").addEventListener("change", function(){
        $("#Step2MVResults").hide()
    })
    document.getElementById("Step2MVSub").addEventListener("click", function(){
        $("#Step2MVResults").show();
    })
    $("#DATA_TABLE").hide();
    $("#DATA_TABLE_MV").hide();
    $("#Value_TransferCo_Section").hide();
    $("#MV_Value_TransferCo_Section").hide();
    calc_MVST_ADD();
    calc_ST_ADD();
    TransferCo_Add();
    MV_TransferCo_Add();
    Str_Selection();
    MV_Str_Selection();
}


/** @st_visibility This function controls visibility of the St input table for LV */ 
function st_visibility() {
    var st_value = document.getElementById("Gen").value
    switch (st_value) {
        case "No":
            $("#DATA_TABLE").hide();
            break;
        case "Yes":
            $("#DATA_TABLE").show();
            break;
        }
}


/** @st_visibility_MV This function controls visibility of the St input table for MV */ 
function st_visibility_MV() {
    var MVst_value = document.getElementById("Gen_MV").value
    switch (MVst_value) {
        case "No":
            $("#DATA_TABLE_MV").hide();
            break;
        case "Yes":
            $("#DATA_TABLE_MV").show();
            break;
        }
}


/** @store_Vars Passes the relevant column number from the planning levels csv file to the calc_Limits() function */ 
function store_Vars() {
    MV = document.getElementById("MV").value;
    Si = document.getElementById("Si").value;
    Str_Selection();

    // Declares filename var and assigns Planning Level Csv filename to this var
    var filename = "PlanningLevels.csv"
    switch (MV) {
        case "11000":
            // if 11kV is selected on the MV Connection Side, column no is parsed as 5
            calc_Limits(5);
            break;
        case "22000":
            // if 22kV is selected on the MV Connection Side, column no is parsed as 4
            calc_Limits(4);
            break;
        case "33000":
            // if 33kV is selected on the MV Connection Side, column no is parsed as 3
            calc_Limits(3);
            break;
        }
}


/** @set_Alpha Set Conditions for Alpha Coefficient */
function set_Alpha(HarmOrder) {
    // Conditions for selection of the Alpha coefficient
    if (HarmOrder<=3) {
        // Sets Alpha coefficient to 1 if the harmonic order for the calculation is less than or equal to 3
        Alpha = 1;
    } else if (HarmOrder<=9 && HarmOrder>3) {
        // Sets Alpha coefficient to 1.4 if the harmonic order for the calculation is less than or equal to 9 but more than 3
        Alpha = 1.4;
    } else if (HarmOrder>9) {
        // Sets Alpha coefficient to 2 if the harmonic order for the calculation is more than 9
        Alpha = 2;
    }
}


/** @Str_Selection Toggles between selected Transformer Capacity Calculation Options: Normal, Emergency, & Other */
function Str_Selection() {
    // Add function to hide and show selected Str options
    // Function should Hide all Str Options Initially
    $('#Str_Normal_Div').hide();
    $('#Str_Emergency_Div').hide();
    $('#Str_Other_Div').hide();
    switch (document.getElementById('Str_Options').value) {
        case 'Normal':
            // Show 'Normal' Option
            $('#Str_Normal_Div').show();
            Str = document.getElementById('Str_Normal').value;
            Str_Option = "Transformer Capacity at Substation based on normal cyclic rating for a single transformer substation at system normal operating condition."
            console.log(Str)
            break;
        case 'Emergency':
            // Show 'Emergency' Option
            $('#Str_Emergency_Div').show();
            Str = Number(document.getElementById('Str_Emergency').value) * Number(document.getElementById('Str_Emergency_Multiplier').value);
            Str_Option = "Transformer Capacity at Substation based on N-1 for a closed bus multiple transformer substation which has been escalated by a multiplier."
            break;
        case 'Other':
            // Show 'Other' Option
            $('#Str_Other_Div').show();
            Str = Number(document.getElementById('Str_Other').value);
            Str_Option = "Transformer Capacity at Substation based on N for CBD Capacity."
            break;
        case 'Select':
            Str_Option = "Transformer Capacity option not selected"
            // Do Nothing
            break;
    }
    is_ST_LOW();
}


/** @MV_Str_Selection Toggles between selected Transformer Capacity Calculation Options: Normal, Emergency, & Other */
function MV_Str_Selection() {
    // Add function to hide and show selected Str options
    // Function should Hide all Str Options Initially
    $('#MV_Str_Normal_Div').hide();
    $('#MV_Str_Emergency_Div').hide();
    $('#MV_Str_Other_Div').hide();
    switch (document.getElementById('MV_Str_Options').value) {
        case 'Normal':
            // Show 'Normal' Option
            $('#MV_Str_Normal_Div').show();
            Str = Number(document.getElementById('MV_Str_Normal').value);
            Str_Option = "Transformer Capacity at Substation based on normal cyclic rating for a single transformer substation at system normal operating condition."
            console.log(Str)
            break;
        case 'Emergency':
            // Show 'Emergency' Option
            $('#MV_Str_Emergency_Div').show();
            Str = Number(document.getElementById('MV_Str_Emergency').value) * Number(document.getElementById('Str_Emergency_Multiplier').value);
            Str_Option = "Transformer Capacity at Substation based on N-1 for a closed bus multiple transformer substation which has been escalated by a multiplier."
            break;
        case 'Other':
            // Show 'Other' Option
            $('#MV_Str_Other_Div').show();
            Str = Number(document.getElementById('MV_Str_Other').value);
            Str_Option = "Transformer Capacity at Substation based on N for CBD Capacity."
            break;
        case 'Select':
            Str_Option = "Transformer Capacity option not selected"
            // Do Nothing
            break;
    }
    is_MV_ST_LOW();
}

// This function adds rows to list generators in the table for the System Capacity (St) Calculation
function calc_ST_ADD() {
    if (ST_Table_No >= 1 & ST_Table_No < 2) { 
        var table = document.getElementById("ST_Table");
        var row = table.insertRow(ST_Table_No);
        var cell0 = row.insertCell(0);
        var cell1 = row.insertCell(1); 
        var cell2 = row.insertCell(2);
        var cell3 = row.insertCell(3);

        cell0.innerHTML = "<input class='form-control' id='ST_Data2_1" + ST_Table_No + "' placeholder='Enter Generator Name/Type..'>"
        cell1.innerHTML = "<input class='form-control' id='ST_Data2_2" + ST_Table_No + "' placeholder='Enter Number of Gener ation Days per Year..'>"
        cell2.innerHTML = "<input class='form-control' id='ST_Data2_3" + ST_Table_No + "' placeholder='Enter Generation Hours per Day..'>"
        cell3.innerHTML = "<input class='form-control' id='ST_Data2_4" + ST_Table_No + "' placeholder='Enter Total Generation..'>"
        ST_Table_No += 1

        
    } else if (ST_Table_No >= 2) {

        if ((document.getElementById("ST_Data2_1"+(ST_Table_No-1)).value=="") || (document.getElementById("ST_Data2_2"+(ST_Table_No-1)).value=="") || (document.getElementById("ST_Data2_3"+(ST_Table_No-1)).value=="") || (document.getElementById("ST_Data2_4"+(ST_Table_No-1)).value=="")) {
        } else {
            var table = document.getElementById("ST_Table");
            var row = table.insertRow(ST_Table_No);
            var cell0 = row.insertCell(0);
            var cell1 = row.insertCell(1);
            var cell2 = row.insertCell(2);
            var cell3 = row.insertCell(3);
    
            cell0.innerHTML = "<input class='form-control' id='ST_Data2_1" + ST_Table_No + "' placeholder='Enter Generator Name/Type..'>"
            cell1.innerHTML = "<input class='form-control' id='ST_Data2_2" + ST_Table_No + "' placeholder='Enter Number of Generation Days per Year..'>"
            cell2.innerHTML = "<input class='form-control' id='ST_Data2_3" + ST_Table_No + "' placeholder='Enter Generation Hours per Day..'>"
            cell3.innerHTML = "<input class='form-control' id='ST_Data2_4" + ST_Table_No + "' placeholder='Enter Total Generation..'>"
    
            var row_Prev = table.insertRow(ST_Table_No-1);
            var cell0_Prev = row_Prev.insertCell(0);
            var cell1_Prev = row_Prev.insertCell(1);
            var cell2_Prev = row_Prev.insertCell(2);
            var cell3_Prev = row_Prev.insertCell(3);

            cell0_Prev.innerHTML = document.getElementById('ST_Data2_1'+(ST_Table_No-1)).value;
            cell1_Prev.innerHTML = document.getElementById('ST_Data2_2'+(ST_Table_No-1)).value;
            cell2_Prev.innerHTML = document.getElementById('ST_Data2_3'+(ST_Table_No-1)).value;
            cell3_Prev.innerHTML = document.getElementById('ST_Data2_4'+(ST_Table_No-1)).value;
            
            cell0_Prev.setAttribute("id", 'ST_Data1_1'+(ST_Table_No-1))
            cell1_Prev.setAttribute("id", 'ST_Data1_2'+(ST_Table_No-1))
            cell2_Prev.setAttribute("id", 'ST_Data1_3'+(ST_Table_No-1))
            cell3_Prev.setAttribute("id", 'ST_Data1_4'+(ST_Table_No-1))
            cell0_Prev.setAttribute("type", 'number')
            cell1_Prev.setAttribute("type", 'number')
            cell2_Prev.setAttribute("type", 'number')
            cell3_Prev.setAttribute("type", 'number')

            document.getElementById("ST_Table").deleteRow(ST_Table_No);
            ST_Table_No += 1
        }
    } else {}

}


// This function is called when rows are to be removed from the St data table, when called, the previous row will be deleted from the table
function calc_ST_Remove() {
    if (ST_Table_No >= 3) {
    var table = document.getElementById("ST_Table");
    row_delete = table.deleteRow(ST_Table_No-1);
    ST_Table_No -= 1
    var row_insert = table.insertRow(ST_Table_No);
    var cell0 = row_insert.insertCell(0);
    var cell1 = row_insert.insertCell(1);
    var cell2 = row_insert.insertCell(2);
    var cell3 = row_insert.insertCell(3);
    
    cell0.innerHTML = "<input class='form-control' id='ST_Data2_1" + (ST_Table_No-1) + "' placeholder='Enter Generator Name/Type..'>"
    cell1.innerHTML = "<input class='form-control' id='ST_Data2_2" + (ST_Table_No-1) + "' placeholder='Enter Number of Generation Days per Year..'>"
    cell2.innerHTML = "<input class='form-control' id='ST_Data2_3" + (ST_Table_No-1) + "' placeholder='Enter Generation Hours per Day..'>"
    cell3.innerHTML = "<input class='form-control' id='ST_Data2_4" + (ST_Table_No-1) + "' placeholder='Enter Total Generation..'>"
    table.deleteRow(ST_Table_No-1);

    }
}

// This function adds rows to list generators in the table for the System Capacity (St) Calculation but for the Step 2 Medium Voltage section
function calc_MVST_ADD() {
    if (MVST_Table_No >= 1 & MVST_Table_No < 2) { 
        var table = document.getElementById("MVST_Table");
        var row = table.insertRow(MVST_Table_No);
        var cell0 = row.insertCell(0);
        var cell1 = row.insertCell(1); 
        var cell2 = row.insertCell(2);
        var cell3 = row.insertCell(3);

        cell0.innerHTML = "<input class='form-control' id='ST_Data3_1" + MVST_Table_No + "' placeholder='Enter Generator Name/Type..'>"
        cell1.innerHTML = "<input class='form-control' id='ST_Data3_2" + MVST_Table_No + "' placeholder='Enter Number of Gener ation Days per Year..'>"
        cell2.innerHTML = "<input class='form-control' id='ST_Data3_3" + MVST_Table_No + "' placeholder='Enter Generation Hours per Day..'>"
        cell3.innerHTML = "<input class='form-control' id='ST_Data3_4" + MVST_Table_No + "' placeholder='Enter Total Generation..'>"
        MVST_Table_No += 1

        
    } else if (MVST_Table_No >= 2) {

        if ((document.getElementById("ST_Data3_1"+(MVST_Table_No-1)).value=="") || (document.getElementById("ST_Data3_2"+(MVST_Table_No-1)).value=="") || (document.getElementById("ST_Data3_3"+(MVST_Table_No-1)).value=="") || (document.getElementById("ST_Data3_4"+(MVST_Table_No-1)).value=="")) {
        } else {
            var table = document.getElementById("MVST_Table");
            var row = table.insertRow(MVST_Table_No);
            var cell0 = row.insertCell(0);
            var cell1 = row.insertCell(1);
            var cell2 = row.insertCell(2);
            var cell3 = row.insertCell(3);

            cell0.innerHTML = "<input class='form-control' id='ST_Data3_1" + MVST_Table_No + "' placeholder='Enter Generator Name/Type..'>";
            cell1.innerHTML = "<input class='form-control' id='ST_Data3_2" + MVST_Table_No + "' placeholder='Enter Number of Generation Days per Year..'>";
            cell2.innerHTML = "<input class='form-control' id='ST_Data3_3" + MVST_Table_No + "' placeholder='Enter Generation Hours per Day..'>";
            cell3.innerHTML = "<input class='form-control' id='ST_Data3_4" + MVST_Table_No + "' placeholder='Enter Total Generation..'>";
    
            var row_Prev = table.insertRow(MVST_Table_No-1);
            var cell0_Prev = row_Prev.insertCell(0);
            var cell1_Prev = row_Prev.insertCell(1);
            var cell2_Prev = row_Prev.insertCell(2);
            var cell3_Prev = row_Prev.insertCell(3);

            cell0_Prev.innerHTML = document.getElementById('ST_Data3_1'+(MVST_Table_No-1)).value;
            cell1_Prev.innerHTML = document.getElementById('ST_Data3_2'+(MVST_Table_No-1)).value;
            cell2_Prev.innerHTML = document.getElementById('ST_Data3_3'+(MVST_Table_No-1)).value;
            cell3_Prev.innerHTML = document.getElementById('ST_Data3_4'+(MVST_Table_No-1)).value;
            
            cell0_Prev.setAttribute("id", 'ST_Data4_1'+(MVST_Table_No-1));
            cell1_Prev.setAttribute("id", 'ST_Data4_2'+(MVST_Table_No-1));
            cell2_Prev.setAttribute("id", 'ST_Data4_3'+(MVST_Table_No-1));
            cell3_Prev.setAttribute("id", 'ST_Data4_4'+(MVST_Table_No-1));
            cell0_Prev.setAttribute("type", 'number');
            cell1_Prev.setAttribute("type", 'number');
            cell2_Prev.setAttribute("type", 'number');
            cell3_Prev.setAttribute("type", 'number');

            document.getElementById("MVST_Table").deleteRow(MVST_Table_No);
            MVST_Table_No += 1;
        }
    } else {}

}


// This function is called when rows are to be removed from the Medium Voltage St data table, when called, the previous row will be deleted from the table
function calc_MVST_Remove() {
    if (MVST_Table_No >= 3) {
    var table = document.getElementById("MVST_Table");
    row_delete = table.deleteRow(MVST_Table_No-1);
    MVST_Table_No -= 1
    var row_insert = table.insertRow(MVST_Table_No);
    var cell0 = row_insert.insertCell(0);
    var cell1 = row_insert.insertCell(1);
    var cell2 = row_insert.insertCell(2);
    var cell3 = row_insert.insertCell(3);
    
    cell0.innerHTML = "<input class='form-control' id='ST_Data3_1" + (MVST_Table_No-1) + "' placeholder='Enter Generator Name/Type..'>";
    cell1.innerHTML = "<input class='form-control' id='ST_Data3_2" + (MVST_Table_No-1) + "' placeholder='Enter Number of Generation Days per Year..'>";
    cell2.innerHTML = "<input class='form-control' id='ST_Data3_3" + (MVST_Table_No-1) + "' placeholder='Enter Generation Hours per Day..'>";
    cell3.innerHTML = "<input class='form-control' id='ST_Data3_4" + (MVST_Table_No-1) + "' placeholder='Enter Total Generation..'>";
    table.deleteRow(MVST_Table_No-1);

    }
}

function Show_TransferCo() {
    if (document.getElementById("Set_TransferCo").value==="Yes") {
        $("#Value_TransferCo_Section").show();
    } else {
        $("#Value_TransferCo_Section").hide();
    }
}

function TransferCo_Add() {
    //if (TransferInt_No >= 1 & TransferInt_No < 2) { 
        var table = document.getElementById("Table_TransferCo");
        var row = table.insertRow(TransferInt_No);
        console.log(TransferInt_No)
        row.innerHTML = "<td><input class='form-control' type='number' id='TransferCo_Value" + TransferInt_No + "' placeholder='Enter Transfer Coefficient Value.. '></td><td><select class='form-control' id='TransferCo_Range1" + TransferInt_No + "'><option value='Select..'>Select</option><option value='2'>2</option><option value='3'>3</option><option value='4'>4</option><option value='5'>5</option><option value='6'>6</option><option value='7'>7</option><option value='8'>8</option><option value='9'>9</option><option value='10'>10</option><option value='11'>11</option><option value='12'>12</option><option value='13'>13</option><option value='14'>14</option><option value='15'>15</option><option value='16'>16</option><option value='17'>17</option><option value='18'>18</option><option value='19'>19</option><option value='20'>20</option><option value='21'>21</option><option value='22'>22</option><option value='23'>23</option><option value='24'>24</option><option value='25'>25</option><option value='26'>26</option><option value='27'>27</option><option value='28'>28</option><option value='29'>29</option><option value='30'>30</option><option value='31'>31</option><option value='32'>32</option><option value='33'>33</option><option value='34'>34</option><option value='35'>35</option><option value='36'>36</option><option value='37'>37</option><option value='38'>38</option><option value='39'>39</option><option value='40'>40</option></select></td><td><select class='form-control' id='TransferCo_Range2" + TransferInt_No + "'><option value='Select..'>Select</option><option value='2'>2</option><option value='3'>3</option><option value='4'>4</option><option value='5'>5</option><option value='6'>6</option><option value='7'>7</option><option value='8'>8</option><option value='9'>9</option><option value='10'>10</option><option value='11'>11</option><option value='12'>12</option><option value='13'>13</option><option value='14'>14</option><option value='15'>15</option><option value='16'>16</option><option value='17'>17</option><option value='18'>18</option><option value='19'>19</option><option value='20'>20</option><option value='21'>21</option><option value='22'>22</option><option value='23'>23</option><option value='24'>24</option><option value='25'>25</option><option value='26'>26</option><option value='27'>27</option><option value='28'>28</option><option value='29'>29</option><option value='30'>30</option><option value='31'>31</option><option value='32'>32</option><option value='33'>33</option><option value='34'>34</option><option value='35'>35</option><option value='36'>36</option><option value='37'>37</option><option value='38'>38</option><option value='39'>39</option><option value='40'>40</option></select></td>";
        
        TransferInt_No += 1;

}

function TransferCo_Remove() {
    if (TransferInt_No>=2) {
        var table = document.getElementById("Table_TransferCo");
        var row = table.deleteRow(TransferInt_No-1);
        TransferInt_No -= 1;

    } else {
        // Do Nothing
    }
}

function TransferCo_Error() {
    for (var i=2; i<=TransferInt_No-1; i++) {
        for (var k=1; k<=i-1; k++) {
            if (Number(document.getElementById("TransferCo_Range1"+i).value)<=Number(document.getElementById("TransferCo_Range2"+(i-k)).value)) {
                return true
            } else {}
        }
    }
    return false
}

function MV_Show_TransferCo() {
    if (document.getElementById("MV_Set_TransferCo").value==="Yes") {
        $("#MV_Value_TransferCo_Section").show();
    } else {
        $("#MV_Value_TransferCo_Section").hide();
    }
}


function MV_TransferCo_Add() {
    //if (TransferInt_No >= 1 & TransferInt_No < 2) { 
        var table = document.getElementById("MV_Table_TransferCo");
        var row = table.insertRow(MV_TransferInt_No);
        console.log(MV_TransferInt_No)
        row.innerHTML = "<td><input class='form-control' type='number' id='MV_TransferCo_Value" + MV_TransferInt_No + "' placeholder='Enter Transfer Coefficient Value.. '></td><td><select class='form-control' id='MV_TransferCo_Range1" + MV_TransferInt_No + "'><option value='Select..'>Select</option><option value='2'>2</option><option value='3'>3</option><option value='4'>4</option><option value='5'>5</option><option value='6'>6</option><option value='7'>7</option><option value='8'>8</option><option value='9'>9</option><option value='10'>10</option><option value='11'>11</option><option value='12'>12</option><option value='13'>13</option><option value='14'>14</option><option value='15'>15</option><option value='16'>16</option><option value='17'>17</option><option value='18'>18</option><option value='19'>19</option><option value='20'>20</option><option value='21'>21</option><option value='22'>22</option><option value='23'>23</option><option value='24'>24</option><option value='25'>25</option><option value='26'>26</option><option value='27'>27</option><option value='28'>28</option><option value='29'>29</option><option value='30'>30</option><option value='31'>31</option><option value='32'>32</option><option value='33'>33</option><option value='34'>34</option><option value='35'>35</option><option value='36'>36</option><option value='37'>37</option><option value='38'>38</option><option value='39'>39</option><option value='40'>40</option></select></td><td><select class='form-control' id='MV_TransferCo_Range2" + MV_TransferInt_No + "'><option value='Select..'>Select</option><option value='2'>2</option><option value='3'>3</option><option value='4'>4</option><option value='5'>5</option><option value='6'>6</option><option value='7'>7</option><option value='8'>8</option><option value='9'>9</option><option value='10'>10</option><option value='11'>11</option><option value='12'>12</option><option value='13'>13</option><option value='14'>14</option><option value='15'>15</option><option value='16'>16</option><option value='17'>17</option><option value='18'>18</option><option value='19'>19</option><option value='20'>20</option><option value='21'>21</option><option value='22'>22</option><option value='23'>23</option><option value='24'>24</option><option value='25'>25</option><option value='26'>26</option><option value='27'>27</option><option value='28'>28</option><option value='29'>29</option><option value='30'>30</option><option value='31'>31</option><option value='32'>32</option><option value='33'>33</option><option value='34'>34</option><option value='35'>35</option><option value='36'>36</option><option value='37'>37</option><option value='38'>38</option><option value='39'>39</option><option value='40'>40</option></select></td>";
        
         MV_TransferInt_No += 1;

}

function MV_TransferCo_Remove() {
    if (MV_TransferInt_No>=2) {
        var table = document.getElementById("MV_Table_TransferCo");
        table.deleteRow(MV_TransferInt_No-1);
        MV_TransferInt_No -= 1;

    } else {
        // Do Nothing
    }
}

function MV_TransferCo_Error() {
    for (var i=2; i<=MV_TransferInt_No-1; i++) {
        for (var k=1; k<=i-1; k++) {
            if (Number(document.getElementById("MV_TransferCo_Range1"+i).value)<=Number(document.getElementById("MV_TransferCo_Range2"+(i-k)).value)) {
                return true
            } else {}
        }
    }
    return false
}


function is_ST_LOW(){
    // if the transformer capacity hasn't been specified, then break the statement, if so then continue 
    if (Str!=(null||0)) {
        if (Number(document.getElementById("Si").value)/1000/Str<=0.25) {
            return true;
        } else {
            return false;
        }
    } else {
        // exit statement
    }
}

function is_MV_ST_LOW(){
    // if the transformer capacity hasn't been specified, then break the statement, if so then continue 
    if (Str!=(null||0)) {
        if (Number(document.getElementById("Si_MVs").value)/1000/Str<=0.25) {
            return true;
        } else {
            return false;
        }
    } else {
        // exit statement
    }
}



/**
 * Calc_Limits function performs the calculations for the harmonic allocation limits.
 * @param {*} MVIndex Column number for the respective planning levels to perform calculations.
 */
function calc_Limits(MVIndex) {
    

    // Calls the csv function through AJAX (Asynchronous Javascript And XML) - used to create a read request for the planning levels csv file
    $.ajax({
        // *** Change this to the location of the .csv file you are importing ***
        url: "PlanningLevels.csv",
        async: false,
        success: function (csvd) {
            data = $.csv.toArrays(csvd);
        },
        dataType: "text",
    });

    var st = Str;

    // if there is an Sgi componenent to the allocation then it will summate the Sgi components with the transformer capacity to calculate the overall supply capacity
    // if there is no Sgi component, nothing happens and st remains equal to the total transformer capacity based on the selected options
    if (is_ST_LOW()===false) {    
        if (document.getElementById("Gen").value==="Yes") {
            for (var i = 1; i < (ST_Table_No-1); i++) {
                var Generator_S = Number(document.getElementById("ST_Data1_2" + i).innerText)/365 * Number  (document.getElementById("ST_Data1_3" + i).innerText)/24 * Number(document.getElementById ("ST_Data1_4" + i).innerText);
                st = Number(st) + Generator_S;
            }
        } else {
            // Do nothing
        }
    } else {
        St = Str;
    }

    // Insert to data tab in html document after converting to a string with 2 decimal points
    var st_Fixed = Number(st).toFixed(2);
    document.getElementById('Data_S2_1').innerHTML = st_Fixed + " MVA";
    console.log(st)
    
    // Variable declaration for calculation methodology
    Alpha = 1
    var HarmOrder = 1, k=2, j=0, EUhi_Sum = 0, TransferCo = [], Si = document.getElementById("Si").value;
    var htmlVoltage = "<table id='EuhiTable' class='table table-striped'>";
    htmlVoltage += "<tr><th> Harmonic Order h </th><th> Emission Limit (% Nominal Voltage)</th><th> Emission Limit (Volts) </th></tr>";
    var htmlCurrent = "<table id='EihiTable' class='table table-striped'>";
    htmlCurrent += "<tr><th> Harmonic Order h </th><th> Emission Limit (% Nominal Current)</th></tr>";

    Si = Number(Si)/1000;
    var si_Fixed = Number(Si).toFixed(2)
    document.getElementById('Data_S2_2').innerHTML = si_Fixed + " MVA";
    
    // if there is a transfer component value, this is added to an array respective to each individual harmonic
    if (document.getElementById("Set_TransferCo").value=="Yes") {
        if (TransferCo_Error()==false) {
            for (var i=1; i<=TransferInt_No-1; i++) {
                if (k === Number(document.getElementById("TransferCo_Range1"+i).value)) {
                    while (k <= Number(document.getElementById("TransferCo_Range2"+i).value)) {
                        TransferCo.push(document.getElementById("TransferCo_Value"+i).value);
                        k++;
                    }
                } else {
                    while (k <= Number(document.getElementById("TransferCo_Range1"+i).value)-1) {
                        k++;
                        TransferCo.push(1);
                        i--;
                    }
                }
            }
        } else if (TransferCo_Error()==true) {
            // if the specified transfer coefficients overlap, this will result in an error alert, in this instance, these transfer coefficients specified for these harmonic values will result in the transfer coefficient defaulting back to a value of 1
            alert('Multiple Transfer Coefficients has been specified for one or more of the same harmonics, transfer coefficient has been defaulted to a value of 1');
            for (i=0; i<=39; i++) {
                TransferCo.push(1);
            }
        }
    } else if (document.getElementById("Set_TransferCo").value="No") {
        for (i=0; i<=39; i++){
            TransferCo.push(1);
        }
    }

    
    
    // **MAIN CALCULATION**
    k=1
    for (var i=0; i<(data.length-2); i++) {

        if (Math.pow(Math.pow(data[k][6], Alpha)>=Math.pow(TransferCo[i]*data[k][MVIndex], Alpha), (1/Alpha))) {
            GlobalEmiss[i] = (Math.pow(Math.pow(data[k][6], Alpha)-Math.pow(TransferCo[i]*data[k][MVIndex], Alpha), (1/Alpha)));
        } else if (Math.pow(Math.pow(data[k][6], Alpha)<=Math.pow(TransferCo[i]*data[k][MVIndex], Alpha),(1/Alpha))) {
            alert("Error: Transfer Coefficient too high");
            break;
        }
        EUhi[i] = GlobalEmiss[i]*Math.pow(Si/st, (1/Alpha));
        console.log(EUhi[i])
/*
        if (EUhi[i]<=0.1) {
            EUhi[i] = 0.1;
        } else {}*/
        // Calculation of the total sum of emission limit values for use in the THD limit calculation
        EUhi_Sum += Math.pow(EUhi[i], 2);
        // fixes the Emission limit value to 3 decimal places
        EUhi_Fixed[i] = EUhi[i].toFixed(3);
        

        // Inserts the data into the Euhi table. 
        htmlVoltage+="<tr>";
        htmlVoltage+="<td>"+ data[k][0] +"</td><td>"+EUhi_Fixed[i]+"</td><td>"+(EUhi[i]*400/100).toFixed(2)+"</td>";
        htmlVoltage+="</tr>";

        k++;
        }
    
    // Calculate and Display THD, also fixes results to 2 decimals places (this comes out as a string)
    var EUhi_THD = Math.pow(EUhi_Sum, 0.5);
    EUhi_THD = EUhi_THD/0.4;
    EUhi_THD_Fixed = EUhi_THD.toFixed(3);
    htmlVoltage+= "<tr><th>THD</th><th>"+EUhi_THD_Fixed+"</th><th>"+(EUhi_THD_Fixed*400/100).toFixed(2)+"</th></tr>";
    htmlCurrent+= "<tr><th>TDD</th><th>TDD</th></tr>";
    document.getElementById("EUhiTableData").innerHTML = htmlVoltage;
}






/* *******Step 2 MV Allocation Script below******* */
function calc_Limits_MV(MVIndex, HVIndex) {
    $.ajax({
        url: "PlanningLevels.csv",
        async: false,
        success: function (csvd) {
            data = $.csv.toArrays(csvd);
        },
        dataType: "text",
    });

    console.log(Str)
    var st = Number(Str);
    var Si = document.getElementById("Si_MVs").value;
    var MV_TransferCo = [];
    var k = 2;
    if (document.getElementById("MV_Set_TransferCo").value=="Yes") {
        console.log(MV_TransferCo_Error())
        if (MV_TransferCo_Error()===false) {
            console.log('its false')
            for (var i=1; i<=MV_TransferInt_No-1; i++) {
                if (k === Number(document.getElementById("MV_TransferCo_Range1"+i).value)) {
                    while (k <= Number(document.getElementById("MV_TransferCo_Range2"+i).value)) {
                        MV_TransferCo.push(document.getElementById("MV_TransferCo_Value"+i).value);
                        k++;
                        console.log("hey this is working")
                    }
                } else {
                    while (k <= Number(document.getElementById("MV_TransferCo_Range1"+i).value)-1) {
                        k++;
                        MV_TransferCo.push(1);
                        i--;
                    }
                }
            }
        } else if (MV_TransferCo_Error()==true) {
            alert('Multiple Transfer Coefficients has been specified for one or more of the same harmonics, transfer coefficient has been defaulted to a value of 1');
            for (i=0; i<=39; i++) {
                MV_TransferCo.push(1);
            }
        }
    } else if (document.getElementById("MV_Set_TransferCo").value="No") {
        for (i=0; i<=39; i++){
            MV_TransferCo.push(1);
        }
    }

    // if there is an Sgi componenent to the allocation then it will summate the Sgi components with the transformer capacity to calculate the overall supply capacity
    // if there is no Sgi component, nothing happens and st remains equal to the total transformer capacity based on the selected options
    if (is_MV_ST_LOW()===false) {
        for (var i = 1; i < (MVST_Table_No-1); i++) {
            console.log(ST_Table_No)
            console.log(document.getElementById("ST_Data4_2" + i))
            var Generator_S = Number(document.getElementById("ST_Data4_2" + i).innerText)/365 * Number  (document.getElementById("ST_Data4_3" + i).innerText)/24 * Number(document.getElementById("ST_Data4_4"    + i).innerText);
            st = Number(st) + Generator_S;
        }
    } else {
        st = Str;
    }
    st += Number(document.getElementById('MV_Si_G').value);
    mv_si_fixed = Number(Si).toFixed(2);
    mv_st_fixed = Number(st).toFixed(2);
    document.getElementById('Data_S3_1').innerHTML = mv_st_fixed + " MVA";
    document.getElementById('Data_S3_2').innerHTML = mv_si_fixed + " MVA";

    var EUhi_Fixed=[]

    var Alpha = 1;
    var HarmOrder = 1;
    var htmlVoltage = "<table id='EuhiMVTable' class='table table-striped'>";
    htmlVoltage += "<tr><th> Harmonic Order h </th><th> Emission Limit (% Nominal Voltage)</th><th> Emission Limit (Volts) </th></tr>";

    var htmlCurrent = "<table id='EihiMVTable' class='table table-striped'>";
    htmlCurrent += "<tr><th> Harmonic Order h </th><th> Emission Limit (% Nominal Current)</th></tr>";
    
    var k=1;
    var EUhi_Sum = 0;  
    
    if (MVIndex===5) {
        volts_EUhi = 11000;
    } else if (MVIndex===4) {
        volts_EUhi = 22000;
    } else if (MVIndex===3) {
        volts_EUhi = 33000; 
    }

    for (var i=0; i<(data.length-2); i++) {

        GlobalEmiss[i] = (Math.pow(Math.pow(data[k][MVIndex], Alpha)-Math.pow(MV_TransferCo[i]*data[k][HVIndex], Alpha), (1/Alpha)));
        EUhi[i] = GlobalEmiss[i]*Math.pow(Si/st, (1/Alpha));
        EIhi[i] = (Math.pow(400, 2)/(Si*1000))*GlobalEmiss[i]*Math.pow(Si/st, (1/Alpha));
        HarmOrder++;
        set_Alpha(HarmOrder); 
        if (EUhi[i]<0.1) {
            EUhi[i] = 0.1;
        }
        
        EUhi_Sum += Math.pow(EUhi[i], 2);
        EUhi_Fixed[k] = EUhi[i].toFixed(2)

        //THD_sum += EUhi[i]
        htmlVoltage+="<tr>";
        htmlVoltage+="<td>"+ data[k][0] +"</td><td>"+EUhi_Fixed[k]+"</td><td>"+(EUhi[i]*volts_EUhi/100).toFixed(2)+"</td>";
        htmlVoltage+="</tr>";
        htmlCurrent+="<tr>";
        htmlCurrent+="<td>"+ data[k][0] +"</td><td>"+EIhi[i]+"</td>";
        htmlCurrent+="</tr>";
        k++;
    }
    var EUhi_THD = Math.pow(EUhi_Sum, 0.5);
    EUhi_THD = EUhi_THD/0.4;
    var EUhi_THD_Fixed = EUhi_THD.toFixed(2);

    htmlVoltage+= "<tr><th>THD</th><th>"+EUhi_THD_Fixed+"</th><th>"+(EUhi_THD*400/100).toFixed(2)+"</th></tr>";
    htmlCurrent+= "<tr><th>TDD</th><th>TDD</th></tr>";
    document.getElementById("EUhiMVTableData").innerHTML = htmlVoltage;
    document.getElementById("EIhiMVTableData").innerHTML = htmlCurrent;
    k++
    Table_Element = "Planning_Table_MV";
    Add_Planning_Table(Table_Element, MVIndex, HVIndex)
}





function store_Vars_MV() {
    MV = document.getElementById("MV1").value;
    HV = document.getElementById("HV1").value;
    MV_Str_Selection();
    switch (MV) {
        case "11000":
            switch (HV) {
                case "22000":
                    calc_Limits_MV(5, 4);
                    break;
                case "33000":
                    calc_Limits_MV(5, 3);
                    break;
                case "66000":
                    calc_Limits_MV(5, 2);
                    break;
                case "132000":
                    calc_Limits_MV(5, 1);
                    break;
            }
            break;
        case "22000":
            switch (HV) {
                case "33000":
                    calc_Limits_MV(4, 3);
                    break;
                case "66000":
                    calc_Limits_MV(4, 2);
                    break;
                case "132000":
                    calc_Limits_MV(4, 1);
                    break;
            }
            break;
        case "33000":
            switch (HV) {
                case "66000":
                    calc_Limits_MV(3,2);
                break;
                case "132000":
                    calc_Limits_MV(3,1);
                break;
            }
            break;
        case "66000":
            switch (HV) {
                case "66000":
                    calc_Limits_MV(3,2);
                break;
                case "132000":
                    calc_Limits_MV(3,1);
            }
    }
}

function Add_Planning_Table(Table_Element, Column1, Column2, Data) {
    console.log(Data);
    console.log(Column2);
    console.log(Column1);
    console.log(Table_Element);
}


/*    // If no argument is given for either column, he following conditions apply
    if (Column1==null||0) {
        //document.getElementById('')
    } else if (Column2==null||0) {
        
    } else {

    }
}*/

main_3();