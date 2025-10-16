
import fs from "fs"
// NextTick loop 
console.log('Start');
function nextTickLoop()
 { process.nextTick(nextTickLoop); } 
// Promise loop 
 function promiseLoop() { Promise.resolve().then(promiseLoop); } 
// Let's test 
console.log(process.cwd());

fs.readFile("main.js", () => console.log('✅ File read complete!')); 
// Uncomment one of the following: 
 nextTickLoop(); 
// ❌ File read will NEVER log promiseLoop(); 
// promiseLoop(); 
// ✅ File read WILL log eventually 
