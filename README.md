# collectorMgr
## Pay Junction ThinkFul Capstone App

### About this Project
...

A few things to note: 
* I am using Gulp to produce builds (dev and prod, instructions below).
* I employed LESS as the CSS pre-processor.
* All JS is run through UglifyJS at build time, but when building for production, sourcemaps are excluded.
* LESS compress style is set to true for development, but when building for production, sourcemaps are excluded.
* I employed JSHint. Config files are included in the repo.
* ***PLEASE NOTE*** - I did not include a Ruby config file. If you want to use the linters, please install and configure Ruby, then the JSCS and SCSS-lint gems.

---

### Requirements to Build
* NodeJs

### How to Build
1. Fork the Repo and download to your local machine.
2. Open a command prompt, and navigate to the root directory of the forked repo.
3. Run "npm install" and wait for the installs to complete (run npm update if you experience issues building).
4. At this point you should be able to run all tasks in the gulp file.

##### Gulp Tasks
* gulp (default) -  Runs the development build and then gulp connect (***default server*** is http://localhost:64033)
* gulp build - Runs the development build
* gulp buildProd - Runs the production build
* watch - Runs the production build and then Gulp Watch - see gulp file for SASS/JS/HTML files being watched

---

### Thanks
