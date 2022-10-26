// Stuart Daniells
// C0829441

/* --------------------------- References/Sources --------------------------- */
// REF01: npm library -> 'zip-local' -> zips folders: https://github.com/Mostafa-Samir/zip-local
// REF02: Node.js Docs -> https://nodejs.org/docs/latest-v16.x/api/process.html#processargv

/* -------------------------------------------------------------------------- */
/*                      DocString or tooltips for script                      */
/* -------------------------------------------------------------------------- */
/** Node.js script that zips any node modules folder seen in specified directory.
 * 
 * 1. After downloading "NodeZipper.js" & "package.json" files, run -> 'npm install' to download the package.json dependencies.
 * 
 * 2. Then in terminal/command prompt, pass the below command:
 *       node NodeZipper.js "starting_path_to_search_node_modules"
 * 
 * 3. Or, to run as a package.json script file:
 *        npm run start "starting_path_to_search_node_modules"
*/

/* -------------------------------------------------------------------------- */
/*                          imports/global variables                          */
/* -------------------------------------------------------------------------- */
const argsVal = process.argv[2],                  //getting the path to starting dir to search the node_modules folder
      fs = require("fs"),                         // file system module
      path = require("path"),                     // used path module to concat paths, for cross platform path support
      folderZipper = require("zip-local");        //library that does folder zipping (async/sync)

let NodeModPaths = [];

/* -------------------------------------------------------------------------- */
/*                                  Main code                                 */
/* -------------------------------------------------------------------------- */

/* ----------------- Check for empty paths entered from cli ----------------- */
if (argsVal === "" || argsVal === null || argsVal === undefined){
   console.log("\n'node_modules' folder path was not provided, please enter the path to 'node_modules' folder as 3rd parameter\n");  
   process.exit(1);
}

/* ----- Get path to all sub-directories that have 'node_modules' folders in them - using an IIFE ----- */
(function walkDirs (dir) {
   fs.readdirSync(dir).forEach(fileOrDir => {
      let dirPath = path.join(dir, fileOrDir)               // used path module to concat paths, to make it cross platform
      let isDir = fs.statSync(dirPath).isDirectory();
      if(isDir) (fileOrDir === "node_modules") ? NodeModPaths.push(dirPath) : walkDirs(dirPath);      
   });
})(argsVal);


/* --------------- For each path that contain 'node_modules', zip it and delete the 'node_modules' dir --------------- */
NodeModPaths.forEach(pathToNM => {
   folderZipper.zip(pathToNM, (zipError, zipped) => {
      if (zipError){
         console.log("\nThe below error message was encountered when creating the zip folder\n", zipError);
         process.exit(1);                             // exit with code 1 from script if errors exist
      }
   
      if(!zipError) zipped.compress();      // if no errors exist, compress the folder
   
      // saving the zip file to disk if no errors exist
      zipped.save(`${pathToNM}.zip`, (saveError) => {
         if (saveError) {
            console.log("\nThe below error message was encountered when saving zip folder to disk\n", saveError);
            process.exit(1);
         }
   
         if(!saveError) {
            console.log(`\n------- Zip of node_modules at '${pathToNM}' - Created Successfully! -------\n`);
   
            //removing the 'node_modules' folder after zip created (similar to rm -rf)
            fs.rmSync(pathToNM, { recursive: true, force: true })                            //extra feature improvement
         }
      })
   });
});


/* -------------------------------------------------------------------------- */
/*                                 END OF FILE                                */
/* -------------------------------------------------------------------------- */

