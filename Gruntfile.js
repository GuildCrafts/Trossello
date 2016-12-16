module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
    selenium_start: {port: 4444}
  })
  grunt.loadNpmTasks('grunt-selenium-webdriver')
  grunt.registerTask('e2e', [
        'selenium_phantom_hub',
        'mocha_e2e',
        'selenium_stop'
    ])
}
