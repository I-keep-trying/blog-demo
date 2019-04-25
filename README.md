# Blog Demo

## Crego Designs 

## Andrea Crego

### I built this by cloning the [Bootstrap 4](https://startbootstrap.com/template-overviews/clean-blog/) template made by [Blackrock Digital](https://github.com/BlackrockDigital/startbootstrap-clean-blog), however, I made some changes.

### In `gulpfile.js` I added two lines to the `browserSync` function:

```
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: './',
    },
    port: 3000,
->  notify: false,
->  browser: ['chrome', 'iexplore'],
  })
  done()
}
```

### In order to suppress the (imo) annoying browser-sync notification that pops up every single time, the `notify: false` flag was added, and to visually verify style changes wouldn't break Internet Explorer, I added it to the browser list.

### I changed the source directory in the `modules` function from bootstrap's /css to /scss, so I could grab styles from the /vendor directory more easily and make any changes I want.

### I changed the source directory in the `js` function to include all the javascript, because, why not???

### I noticed that for some reason, maybe there was a conflict with some settings in my IDE, I was not seeing immediate browser refresh after changes, so I had to change the third line of the `watchFiles` function from 
```
gulp.watch("./**/*.html", browserSyncReload)
```
###to 
```
gulp.watch("./*.html").on('change', browserSyncReload)
```
### THEN, I was not happy with just instantly seeing my style changes. I wanted instant git commit, push, and Netlify publish also, and it was easier than I thought it would be! I added `deploy.js`, and added a deploy script to `package.json`, and ta-da! 😁




## About Start Bootstrap

Start Bootstrap is an open source library of free Bootstrap templates and themes. All of the free templates and themes on Start Bootstrap are released under the MIT license, which means you can use them for any purpose, even for commercial projects.

* https://startbootstrap.com
* https://twitter.com/SBootstrap

### Photos provided by [Lorem Picsum](https://picsum.photos/), licensed by [Unsplash](https://unsplash.com/license)