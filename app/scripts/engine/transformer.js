/*
 * Enables basic transforms for matrixes:
 * rotate left (90 deg), rotate right (90 deg),
 * flip horizontal, flip vertical
 * 
 * @author Maciej Garycki <maciekgarycki@gmail.com>
 */
var BrickGame = BrickGame || {};
(function(ns, undefined) {
    
    'use strict';
    
    /**
     * Creates a transformer for matrixes
     * 
     * @returns {undefined}
     * @constructor
     */
    ns.MatrixTransformer = function (matrixCreator) 
    {
        this.matrixCreator = matrixCreator;
    };
    
    
    ns.MatrixTransformer.prototype = (function ()
    {
        
        /**
         * Returns an array with columns reversed
         * 
         * @param       {Array}         inputArray
         * @returns     {Array}
         */
        function reverseColumns (inputArray)
        {
            var outputArray = [];
            for (var x = 0; x < inputArray.length; x++) {
                outputArray.push(inputArray[x].reverse());
            }
            
            return outputArray;
        }
        
        
        /**
         * Modifies the input array by switching the columns to rows
         * 
         * @param       {Array}     inputArray
         * @returns     {Array} 
         */
        function colsToRows (inputArray)
        {
            var outputArray = [];
            for (var i = 0; i < inputArray[0].length; i++) {
                outputArray[i] = [];
                for (var j = 0; j < inputArray.length; j++) {
                    outputArray[i][j] = inputArray[j][i];
                }
            }
            
            return outputArray;
        }
        
        
        return {
        
            /**
             * Rotates given matrix 90 deg clockwise
             * 
             * @param       {Matrix}        matrix
             * @return      {Matrix}        The rotated equivalent of the given matrix
             */
            rotateRight : function (matrix)
            {
                var matrixArray = matrix.getArray();
                var reversedMatrixArray = reverseColumns(matrixArray);
                var rotatedMatrixArray = colsToRows(reversedMatrixArray);

                return this.matrixCreator.createFromArray(rotatedMatrixArray);
            },

            /**
             * Rotates given matrix 90 deg counterclockwise
             * 
             * @param       {Matrix}        matrix
             * @return      {Matrix}        The rotated equivalent of the given matrix
             */
            rotateLeft : function (matrix)
            {
                var matrixArray = matrix.getArray();
                var reversedMatrixArray = matrixArray.reverse();
                var rotatedMatrixArray = colsToRows(reversedMatrixArray);

                return this.matrixCreator.createFromArray(rotatedMatrixArray);
            },

            /**
             * Flips the given matrix vertically
             * 
             * @param       {Matrix}        matrix
             * @return      {Matrix}        The flipped equivalent of the given matrix
             */
            flipVertical : function (matrix)
            {
                var matrixArray = matrix.getArray();
                var reversedMatrixArray = reverseColumns(matrixArray);
                
                return this.matrixCreator.createFromArray(reversedMatrixArray);
            },

            /**
             * Flips the given matrix horizontally
             * 
             * @param       {Matrix}        matrix
             * @return      {Matrix}        The flipped equivalent of the given matrix
             */
            flipHorizontal : function (matrix)
            {
                var matrixArray = matrix.getArray();
                var reversedMatrixArray = matrixArray.reverse();
                
                return this.matrixCreator.createFromArray(reversedMatrixArray);
            }

        };
    })();
    
    
    
    
})(BrickGame);