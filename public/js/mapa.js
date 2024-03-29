/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/mapa.js":
/*!************************!*\
  !*** ./src/js/mapa.js ***!
  \************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function () {\r\n\r\n    // Logical OR para que no de error si no encuentra el elemento\r\n    const lat = document.querySelector('#lat').value || 5.7180412; \r\n    const lng = document.querySelector('#lng').value || -72.9423523;\r\n    const mapa = L.map('mapa').setView([lat, lng], 16);\r\n    let maker;\r\n\r\n\r\n    // Utilizar provider y Geocoder\r\n    const geocodeService = L.esri.Geocoding.geocodeService();\r\n\r\n\r\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\r\n        attribution:\r\n            '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors',\r\n    }).addTo(mapa);\r\n\r\n    // Agregar el pin\r\n    maker = new L.marker([lat, lng], {\r\n        draggable: true,\r\n        autoPan: true,\r\n    }).addTo(mapa);\r\n\r\n    \r\n    // Detectar movimiento del marker\r\n    maker.on('moveend', function (e) {\r\n\r\n        maker = e.target;\r\n\r\n        const position = maker.getLatLng(); // Get position\r\n        // console.log(position);\r\n        mapa.panTo(new L.LatLng(position.lat, position.lng)); // Set map center to marker position\r\n\r\n        // Obtener la información al mover el pin\r\n        geocodeService\r\n            .reverse()\r\n            .latlng(position, 16)\r\n            .run(function (error, result) {\r\n                if (error) {\r\n                    return;\r\n                }\r\n\r\n                console.log(result);\r\n                \r\n                maker.bindPopup(result.address.LongLabel);\r\n\r\n                document.querySelector('.calle').textContent = result?.address?.Address ?? '';\r\n                document.querySelector('#calle').value = result?.address?.Address ?? '';\r\n                document.querySelector('#lat').value = result?.latlng?.lat;\r\n                document.querySelector('#lng').value = result?.latlng?.lng;\r\n\r\n                maker.openPopup();\r\n            });\r\n\r\n    })\r\n\r\n})();\r\n\n\n//# sourceURL=webpack://bienesraices_mvc/./src/js/mapa.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/mapa.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;