/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"TechInnovation/TechInnovation/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});