const { exec, execSync } = require("child_process");
const { EventEmitter } = require("stream");
const { copymanager } = require("../index.js");

var startTime = performance.now();

//CHANGE THESE PATHS TO SOMETHING ON YOUR MACHINE
copymanager.initiateCopy("C:\\Users\\Hayde\\Desktop\\AudacityPortable", "C:\\Users\\Hayde\\Desktop\\TestFolder", 200, 2, false);

copymanager.on("progress", (percent) => {
    console.log("Progress: " + percent);
})

copymanager.on("finished", () => {
    var endTime = performance.now();
    console.log("It took " + ((endTime - startTime)/1000).toFixed(1) + " seconds.");
})
