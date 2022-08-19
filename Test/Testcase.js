//@ts-check
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
        //  .toString().replace(/[^\d.]/g, "");
        console.log("Number of files: " + this.totalFiles );
    }

    #copyFiles(source, destination, progressAccuracy){     
        let copiedFileCount = 0;
        let copyProcess = exec('robocopy "' + source + '" "' + destination + '" /MIR /NDL /NJH /NJS /nc /ns /MT:10');
        // let copyProcess = exec('robocopy "' + source + '" "' + destination + '" /MIR /E /NJH /NJS /nc /ns | find /v "\\"');
        copyProcess.stdout.on("data", data => {
            // console.log(data.toString());
            copiedFileCount++;
            if(copiedFileCount < this.totalFiles && copiedFileCount % progressAccuracy == 0)
                this.emit("progress", ((copiedFileCount / this.totalFiles) * 100).toFixed(0))
        })

        copyProcess.stderr.on("data", data => {
            console.log("[CopyManager] Error: " + data.toString());
        })

        copyProcess.on("close", () => {
            console.log("Done copying. Counted: " + copiedFileCount);
            console.log("Counted: " + this.totalFiles);
            this.emit("progress", 100);
            this.emit("finished");
        })
    }
    
    /**
     * Initialises the copy process of source to destination
     * @param {*} source path to source
     * @param {*} destination path to destination
     * @param {*} progressAccuracy wanted accuracy of progress logging 10 very fine - 1000 low  
     */
    async initiateCopy(source, destination, progressAccuracy = 500){
        await this.#getTotalFileCount(source);
        this.#copyFiles(source, destination, progressAccuracy);
    }
}

var zeit0 = performance.now();
let node1Test = new copyManager();
node1Test.initiateCopy("C:\\Users\\KulleH\\Documents\\Unreal Projects\\nDisplayTest", "C:\\Users\\KulleH\\Desktop\\CopyTests\\Test")

node1Test.on("progress", (percent) => {
    console.log("Progress: " + percent);
})

node1Test.on("finished", () => {
    var zeit1 = performance.now();
    console.log("Der Aufruf dauerte " + ((zeit1 - zeit0)/1000).toFixed(1) + " Sekunden.");
})
