
/* This script contains all of the methods that control the functionality of the web page tool, the buttons, and the navigation between the various sections of the tool. */


function openPage(pageName, elmnt, color) {
    // Hide all elements with class="tabcontent" by default */
    var i, tabcontent, navlink;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Remove the background color of all nav-link buttons when another tab is clicked
    navlink = document.getElementsByClassName("nav-link");
    for (i = 0; i < navlink.length; i++) {
      navlink[i].style.backgroundColor = "";
    }
  
    // Show the specific tab content
    document.getElementById(pageName).style.display = "block";
  
    // Set the 'current' tab colour to indicate it is he current tab open
    elmnt.style.backgroundColor = color;
}

// This sets the tab which will default open
document.getElementById("Step1tab").click();

function download_README() {
    // This function will be written to include a feature to download a readme
}

$("ul.nav-tabs a").click(function (e) {
    e.preventDefault();  
      $(this).tab('show');
  });

  