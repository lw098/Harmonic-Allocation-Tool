// **** This JS file governs the Step 3 Calculation *** 
// **To run this file, Step2alloc is required**


var GhHV = [];

function main_2() {
    // This function will contain hide(); functions for unnecessary data
    // Delete these comments upon script release !**
    $("#Step3_Results").hide();
}

main_2();

function Store_vars() {
    var HV = document.getElementById('HVVoltageSelect').value;
    Si = document.getElementById('SIHV').value;
    St = document.getElementById('STHV').value;

    switch (HV) {
        case "33000":
            Calc_STEP3(3)
        break;
        case "66000":
            Calc_STEP3(2)
        break;
        case "132000":
            Calc_STEP3(1)
        break;
    }
}

function Calc_STEP3(HVIndex) {
    $("#Step3_Results").show();
    $.ajax({
        url: "PlanningLevels.csv",
        async: false,
        success: function (csvd) {
            data = $.csv.toArrays(csvd);
        },
        dataType: "text",
    });
    var k=1;
    Alpha = 1;
    var Harmorder = 1;
    var htmlVoltage = "<table id='EuhiHVTable' class='table table-striped'>";
    htmlVoltage += "<tr><th> Harmonic Order h </th><th> Emission Limit (% Nominal Voltage)</th></tr>";
    
    for (i=0; i<=data.length-2; i++){
        GhHV[i] = 0.8*data[k][HVIndex];
        EUhi[i] = GhHV[i]*Math.pow((Si/St), Alpha);
        Harmorder++;
        set_Alpha(Harmorder);
        if (EUhi[i]<0.01) {
            EUhi[i] = 0.01;
        }
        htmlVoltage+="<tr>";
        htmlVoltage+="<td>"+ data[k][0] +"</td><td>"+EUhi[i]+"</td>";
        htmlVoltage+="</tr>";
        k++;
    }
    document.getElementById("Step3Results").innerHTML = htmlVoltage;
}