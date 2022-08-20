const { exec, execSync } = require("child_process");
const { EventEmitter } = require("stream");
const {copyManager} = require("../copyManager.js");

var startTime = performance.now();
var copymanager = new copyManager;
//CHANGE THESE PATHS TO SOMETHING ON YOUR MACHINE
copymanager.initiateCopy("C:\\Users\\Desktop\\WindowsNoEditor", "C:\\Users\\Desktop\\WinFS\\TestCopyFolder", 200, 2, true);

copymanager.on("progress", (percent) => {
    console.log("Progress: " + percent);
})

copymanager.on("finished", () => {
    var endTime = performance.now();
    console.log("It took " + ((endTime - startTime)/1000).toFixed(1) + " seconds.");
})
