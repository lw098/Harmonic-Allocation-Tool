File Author: Lawson Wotley
File Name: Step-1-v1_0
File Type: html


The following files are to be assosciated with the Step-1-v1_0.html file - located in the same folder:
	csv.js
	iec519table2.csv
	jquery.csv.js
	main.js
	Step1Allocv2.js
	Step-1-v1_0.html

To Open:
	Double click on Step-1-v1_0.html to open the html file, IE Edge or Google Chrome are best, mozilla firefox is also supported but functionality is unconfirmed.
	IE8 and IE9 **WILL** experience problems regarding calculations as the javascript contains some functions introduced with ECMAScript 6 & later editions (ES6).
	IE8 and IE9 do not fully support ES6.
	
How to use:
	There are two tabs contained within the step 1 allocation html page. This includes a Single Phase Allocation and a Three Phase Allocation.
	
	*For Single Phase Allocation:
		If you are allocating for a Single Phase Connection, click on the Single Phase Connection Tab.
		You will need to complete this: 
			The Network Connection Type: Is it connected through a SWER Line?
			The Aggregated Load if there is any.
			The Aggregated Generation if there is any.
			If there is both aggregated load and generation, then put both the load and generation in the corresponding inputs.

		Click the submit button to confirm whether the connection passes or requires further assessment under the Step 2 Methodology (Refer to HAG Document).

	*For Three Phase Allocation:
		If you are allocating for a Three Phase Connection, click on the Three Phase Connection Tab.
			If the Aggregated Load and/or Generation is less than 16A per Phase (<11kVA approximately), then select no.
			Select the type of Power Electronics:
				- Equipment is not Power Electronics
				- Equipment is 6 pulse type power electronics
				- Equipment is 12 pulse type power electronics
				
				If the type of power electonics is not known, select the 6 pulse type power electronics.
			
			Input the Aggregated Load if there is any.
			Input the Aggregated Generation if there is any.
			If there is both aggregated load and generation, then put both the load and generation in the corresponding inputs.

			If the load/Generation is large enough, you will be required to input the Short Circuit Level at the POE/POC (Point of Evaluation/Point of Connection), this is input in MVA.
				If this is the case, the power factor will also be input. If the power electronics uses a volt-var type response, use a power factor of 1 unless specified otherwise.
			
			Click on Results to obtain the corresponding Allocation Results and limits.

Please Report any bugs with the tool to the Power Quality team, or contact Lawson Wotley on 07 4931 2694.