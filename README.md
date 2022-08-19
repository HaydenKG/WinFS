# WinFS
A NodeJS package to copy large files extremly fast and with copy progress 
  
If your nodejs project is running on windows and you need to move large chunks of data (files or directories) you can use this package.

Upsides against FS and FS-extra:
-	Progress indication
-	Up to 2.5 times faster if more threads are used

Improvements: 
-	Define how many threads should be used.
-	Define cases for older node versions or “export” only the initiate copy
