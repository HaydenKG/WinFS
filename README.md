# WinFS
A NodeJS package to copy large files extremly fast and with copy progress 
  
If your nodejs project is running on windows and you need to move large chunks of data (files or directories) you can use this package.

#### Upsides against FS and FS-extra:
-	Progress indication
-	Up to 2.5 times faster if more threads are used compared to standart node fs module

Comparison:  
Results for 9.2 GB on a local Samsung PM9A1 SSD
| Tool  | Time in seconds|
| ------------- | ------------- |
| node fs | 33 |
| this 1 thread  | 33  |
| this 10 threads  | 9  | 

#### Functionality 
It uses windows robocopy tool that gets the original and destination path as well as further options like thread number to speed up the process ('robocopy "' + source + '" "' + destination + '" /MIR /NDL /NJH /NJS /nc /ns /MT:10'). It is executed with a child_process.exec to keep the load away from the main thread.

The class inherits from EventEmitter to emit the progress. The progress is calculated by getting the number of files in the directory and then checking how many time robocopy printed a scuceesful copy process. This progress tracking gets less accurate the more threads are being used because for some reason that is yet to discovered not all threads print something.  

#### Background
For a development project with a nodejs express server running on windows I needed to move large directories to other PCs in the network and couldn't find an easy and reliable way to get a progress indication with the node FS or FS-extra modules. Therefore I experimented and created this package. 

#### Example
```
let testCopyManager = new copyManager();
testCopyManager.initiateCopy("C:\\Source\\Example", "C:\\Users\\Destination\\Example", 200, 2, true);

testCopyManager.on("progress", (percent) => {
    console.log("Progress: " + percent);
})

testCopyManager.on("finished", () => {
    //do something here
})
```

