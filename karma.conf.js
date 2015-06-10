module.exports = function(config){
  config.set({

    basePath : './',

    files : [
      '_SRC/app/bower_components/angular/angular.js',
      '_SRC/app/bower_components/angular-route/angular-route.js',
      '_SRC/app/bower_components/angular-mocks/angular-mocks.js',
      '_SRC/app/components/**/*.js',
      '_SRC/app/view*/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
