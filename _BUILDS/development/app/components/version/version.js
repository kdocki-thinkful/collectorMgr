'use strict';

angular.module('cmgrApp.version', [
  'cmgrApp.version.interpolate-filter',
  'cmgrApp.version.version-directive'
])

.value('version', '0.1');
