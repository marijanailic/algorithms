(function (ex) {
    'use strict';

    var matrix = (function (rows, cols, defaultValue) {
        var arr = [];
        for (var i = 0; i < rows; i++) {
            arr.push([]);
            arr[i].push(new Array(cols));
            for (var j = 0; j < cols; j++) {
                arr[i][j] = defaultValue;
            }
        }

        return arr;

    })();

    
    ex.matrix = matrix;
}(typeof ex === 'undefined' ? window : ex));