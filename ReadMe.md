NORMALIZED METRIC DISPLAY

Last updated: April 8 2019

# The purpose of the chart is to display the metrics obtained from NLP (Natural Language Processing) exercises. 

## script.js
This is where the sheet data is structured and the graph is generated and drawn. The data is saved to sheetData using the getData function and is parsed with the Cycle class (see Cycle.js), then the data is displayed using the drawGraph function.

### Functions
- anonymous ready function: binds the data getter followed by drawGraph function to the Draw button
- drawGraph: selects which graph type to draw based on the chartType selection. The functions for each type of graph are found in their respective files.

# How to use (Visual Studio Code):
    1. Install the Live Server extension in VS Code and make sure it is enabled. You should see a Go Live button on the bottom bar.

    2. Install Node.js.

    3. Go into the Phraseology-Visualizer terminal and input "cd server", then input "node server.js". The database should now be running on localhost:8000.

    4. Click the Go Live button at the bottom of the application. The application should now be running on port 5500 and a webpage should automatically be opened.

    5. Select what you want to see in the dropdown menus at the top, click draw, and your desired graph will be generated on screen. 
    Note: We have restricted certain data for some chart types because they are only compatible with certain charts.

 ## If you have not made any changes to the data, you should be able      to see graphs plotting data from the Winter 2019 interns.