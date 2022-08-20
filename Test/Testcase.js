const { exec, execSync } = require("child_process");
const { EventEmitter } = require("stream");

class copyManager extends EventEmitter{

    constructor(){
        super();
        this.totalFiles = 0;
    }

    // since ECMAScript2022 '#' is useable to make functions in a class private 
    async #getTotalFileCount(source){
        let processOutput = execSync('dir /a:-d /s /b "' + source + '" | find /c ":"').toString();
        this.totalFiles = parseInt(processOutput);
        console.log("Number of files: " + this.totalFiles );
    }

    #copyFiles(source, destination, progressAccuracy, threadCount, clearExisting){     
        if(threadCount > 128) threadCount = 128;
        let copiedFileCount = 0;
        let copyProcess = null; 
        if(!clearExisting)
            copyProcess = exec('robocopy "' + source + '" "' + destination + '" /NDL /NJH /NJS /nc /ns /MT:' + threadCount);
        else 
            copyProcess = exec('robocopy "' + source + '" "' + destination + '" /MIR /NDL /NJH /NJS /nc /ns /MT:' + threadCount);

        copyProcess.stdout.on("data", data => {
            console.debug(data.toString());
            copiedFileCount++;
            if(copiedFileCount < this.totalFiles && copiedFileCount % progressAccuracy == 0)
                this.emit("progress", ((copiedFileCount / this.totalFiles) * 100).toFixed(0))
        })

        copyProcess.stderr.on("data", data => {
            console.log("[WinFS] Error: " + data.toString());
        })

        copyProcess.on("close", () => {
            console.debug("[WinFS] Done copying. Counted: " + copiedFileCount);
            console.debug("[WinFS] Counted: " + this.totalFiles);
            this.emit("progress", 100);
            this.emit("finished");
        })
    }
    
    /**
     * Initialises the copy process of source to destination. The destination folder will be cleared of any existing files
     * @param {string} source - path to source. Example: "C:\\\Users\\\Documents\\\Unreal" or "C:/Users/Documents/Unreal".
     * @param {string} destination - path to destination
     * @param {number} progressAccuracy - wanted accuracy of progress logging 10 very fine - 1000 low. Default = 500 
     * @param {number} threadCount - is the number of threads you want to use. 128 are supported at max. Default = 2
     * @param {boolean} clearExisting - to determine if the files in the destination directory should be cleared prior copying. Default = false
     */
    async initiateCopy(source, destination, progressAccuracy = 500, threadCount = 2, clearExisting = false){
        try {   
            await this.#getTotalFileCount(source);
            this.#copyFiles(source, destination, progressAccuracy, threadCount, clearExisting);
        } catch (error) {
            console.warn("[WinFS] Error: " + error);
        }
    }
}

var zeit0 = performance.now();
let node1Test = new copyManager();
//CHANGE THESE PATHS TO SOMETHING ON YOUR MACHINE
node1Test.initiateCopy("C:\\Python310\\Scripts", "C:\\Users\\Desktop\\WinFS\\TestCopyFolder", 200, 2, true);

node1Test.on("progress", (percent) => {
    console.log("Progress: " + percent);
})

node1Test.on("finished", () => {
    var zeit1 = performance.now();
    console.log("It took " + ((zeit1 - zeit0)/1000).toFixed(1) + " seconds.");
})
