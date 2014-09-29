/*
 * Matrix class definition and matrix factory
 * 
 * @author Maciej Garycki <maciekgarycki@gmail.com>
 */
var BrickGame = BrickGame || {};

(function(ns, undefined) {
    
    'use strict';
    
    /**
     * Creates a BrickGame.OutOfBoundsError
     * 
     * @param           {string}        message
     * @param           {Array}         errors
     * @returns         {undefined}
     * @constructor
     */
    ns.OutOfBoundsError = function (message, errors) 
    {
        this.name = 'OutOfBoundsError';
        this.message = message;
        this.errors = errors;
    };
    
    ns.OutOfBoundsError.prototype = new Error();
    ns.OutOfBoundsError.prototype.constructor = ns.OutOfBoundsError;
    
    /**
     * Returns the error objects provided by the error thrown
     * 
     * @return      {Array}         An array of Objects
     */
    ns.OutOfBoundsError.prototype.getErrors = function ()
    {
        return this.errors;
    };
    
    // Constants
    ns.OutOfBoundsError.MIN_VALUE_EXCEEDED = 'min_value_exceeded';
    ns.OutOfBoundsError.MAX_VALUE_EXCEEDED = 'max_value_exceeded';
    ns.OutOfBoundsError.X_COORD = 'X';
    ns.OutOfBoundsError.Y_COORD = 'Y';
    
    
    
    /**
     * Defines the Matrix
     * 
     * @param           {Number}        width       The matrix width
     * @param           {Number}        height      The matrix height
     * @returns         {undefined}     
     * @constructor
     */
    ns.Matrix = (function () {
        
        /**
         * Creates an empty value object representing the matrix field state
         * 
         * @returns     {Object}
         */
        function createValueObject ()
        {
            return {
                state : false,
                params : {}
            };
        }
        
        /**
         * Creates a column array
         * 
         * @param       {Number}    height
         * @returns     {Array}
         */
        function createColumn (height)
        {
            var column = [];
            for (var y = 0; y < height; y++) {
                column.push(createValueObject());
            }
            
            return column;
        }
        
        /**
         * Initializes the empty matrix
         * 
         * @param   {Array}     matrix
         * @param   {Number}    width
         * @param   {Number}    height
         * @returns {Array}
         */
        function initialize (matrix, width, height)
        {
            for (var x = 0; x < width; x++) {
                matrix.push(createColumn(height));
            }
            
            return matrix;
        }
        
        
        return function (width, height)
        {
            this.matrix = initialize([], width, height);
        };
        
    })();
    
    
    ns.Matrix.prototype = (function () {
        
        /**
         * Validates if any value does not exceed bounds
         * 
         * @param       {Number}            x
         * @param       {Number}            y
         * @param       {Array}             theArray 
         * @returns     {undefined}
         * @throws      {Error}             If any value exceedes bounds
         */
        function validateXY (x, y, theArray)
        {
            if (x >= theArray.length) {
                throw new Error('The x value exceedes the matrix boundaries!');
            } else if (y >= theArray[0].length) {
                throw new Error('The y value exceedes the matrix boundaries!');
            }
        }
        
        return {

            /**
             * Returns the matrix array
             * 
             * @returns     {Array}
             */
            getArray : function ()
            {
                return this.matrix;
            },

            /**
             * Sets the state for given matrix element
             * 
             * @param       {Number}                x       Horizontal index of the block in
             *                                              2D matrix (0 based)
             * @param       {Number}                y       Vertical index of the block in
             *                                              2D matrix (0 based)
             * @param       {Boolean}               state
             * @returns     {BrickGame.Matrix}      This object
             */
            setState : function (x, y, state)
            {
                validateXY(x, y, this.matrix);
                this.matrix[x][y].state = !!state;
                return this;
            },

            /**
             * Returns a state of given element
             * 
             * @param       {Number}        x       Horizontal index of the block in
             *                                      2D matrix (0 based)
             * @param       {Number}        y       Vertical index of the block in
             *                                      2D matrix (0 based)
             * @returns     {Boolean}
             */
            getState : function (x, y)
            {
                validateXY(x, y, this.matrix);
                return !!this.matrix[x][y].state;
            },
            
            
            /**
             * Toggles a state of the matrix
             * 
             * @param           {Number}            x
             * @param           {Number}            y
             * @returns         {BrickGame.Matrix}  This object
             */
            toggleState : function (x, y)
            {
                var state = this.getState(x, y);
                this.setState(x, y, !state);
                
                return this;
            },
            

            /**
             * Sets the params for given matrix element
             * 
             * @param       {Number}                x       Horizontal index of the block in
             *                                              2D matrix (0 based)
             * @param       {Number}                y       Vertical index of the block in
             *                                              2D matrix (0 based)
             * @param       {Object}                params
             * @returns     {BrickGame.Matrix}      This object
             */
            setParams : function (x, y, params)
            {
                validateXY(x, y, this.matrix);
                this.matrix[x][y].params = params;
                return this;
            },


            /**
             * Returns params related with given element
             * 
             * @param       {Number}        x       Horizontal index of the block in
             *                                      2D matrix (0 based)
             * @param       {Number}        y       Vertical index of the block in
             *                                      2D matrix (0 based)
             * @returns     {Object}
             */
            getParams : function (x, y)
            {
                validateXY(x, y, this.matrix);
                return this.matrix[x][y].params || {};
            },


            /**
             * Loads the matrix from existing matrix. Provided matrix
             * can be an array of arrays of value objects (containing
             * 'state' and 'params' fields) or integer/boolean numbers
             * 
             * @param       {Array}                     matrix
             * @return      {BrickGame.Matrix}          This object
             */
            fromArray : function (matrix)
            {
                for (var x = 0; x < matrix.length; x++) {
                    var column = matrix[x];
                    for (var y = 0; y < column.length; y++) {
                        var value = column[y];

                        if (value.hasOwnProperty('state')) {
                            this.setState(x, y, value.state);
                        } else {
                            this.setState(x, y, !!value);
                        }

                        if (value.hasOwnProperty('params')) {
                            this.setParams(x, y, value.params);
                        }
                    }
                }

                return this;
            },
            
            /**
             * Returns a clone of this matrix
             * 
             * @returns     {BrickGame.Matrix}
             */
            clone : function ()
            {
                var matrix = new ns.Matrix(this.getWidth(), this.getHeight());
                return matrix.fromArray(this.matrix);
            },
            
            /**
             * Clears all the matrix (sets false to all values)
             * 
             * @returns     {BrickGame.Matrix}
             */
            clear : function ()
            {
                for (var x = 0; x < this.getWidth(); x++) {
                    for (var y = 0; y < this.getHeight(); y ++) {
                        this.setState(x, y, false);
                    }
                }
                
                return this;
            },

            /**
             * Returns an object containing two values: width and height as positive
             * integer numbers
             * 
             * @returns     {Object}
             */
            getDimensions : function ()
            {
                return {
                    width: this.getWidth(),
                    height : this.getHeight()
                };
            },

            /**
             * Returns the width of the matrix as positive integer number
             * 
             * @returns     {Number}
             */
            getWidth : function ()
            {
                return this.matrix.length;
            },

            /**
             * Returns the height of the matrix as positive integer number
             * 
             * @returns     {Number}
             */
            getHeight : function ()
            {
                return this.matrix[0].length;
            }

        };
    })();
    
    
    /**
     * Creates a new instance of matrix creator
     * 
     * @returns     {undefined}
     * @constructor
     */
    ns.MatrixCreator = function ()
    {
        
    };
    
    ns.MatrixCreator.prototype = (function () {
        
        /**
         * Validates the matrix and returns it if valid.
         * Throws error if not valid
         * 
         * @param       {Array}         matrix
         * @returns     {Array}
         * @throws      {TypeError}     description
         */
        function validateGetArray (matrix)
        {
            if (matrix.length === 0 || matrix[0].length === 0) {
                throw new TypeError('The matrix must be at least 1x1 in size!');
            }
            var columnLen;
            for (var x = 0; x < matrix.length; x++) {
                var currentLength = matrix[x].length;
                if (x === 0) {
                    columnLen = currentLength;
                } else {
                    if (columnLen !== currentLength) {
                        throw new TypeError('The matrix provided has various column lengths!');
                    }
                }
            }
            
            return matrix;
        }
        
        
        /**
         * Validates coords object for negative values
         * 
         * @param       {BrickGame.Matrix}              matrix
         * @param       {Object}                        coords
         * @returns     {Object}
         * @throws      {BrickGame.OutOfBoundsError}    If negative offsets
         *                                              provided (or invalid width,
         *                                              height)
         */
        function validateCoords (matrix, coords)
        {
            var errors = [];
            if (coords.offsetX < 0) {
                errors.push({
                    invalid : ns.OutOfBoundsError.X_COORD,
                    value : ns.OutOfBoundsError.MIN_VALUE_EXCEEDED
                });
            }
            if (coords.offsetY < 0) {
                errors.push({
                    invalid : ns.OutOfBoundsError.Y_COORD,
                    value : ns.OutOfBoundsError.MIN_VALUE_EXCEEDED
                });
            }
            if ((coords.offsetX + coords.width) > (matrix.getWidth())) {
                errors.push({
                    invalid : ns.OutOfBoundsError.X_COORD,
                    value : ns.OutOfBoundsError.MAX_VALUE_EXCEEDED
                });
            }
            
            if ((coords.offsetY + coords.height) > (matrix.getHeight())) {
                errors.push({
                    invalid : ns.OutOfBoundsError.Y_COORD,
                    value : ns.OutOfBoundsError.MAX_VALUE_EXCEEDED
                });
            }
            
            if (errors.length) {
                throw new ns.OutOfBoundsError(
                    'Given coords exceed the bounds of the matrix!',
                    errors
                );
            } else {
                return coords;
            }
        }
        
        
        return {
            
            /**
             * Creates a new empty matrix of given size
             * 
             * @param       {Number}            width
             * @param       {Number}            height
             * @returns     {BrickGame.Matrix}
             */
            createEmpty : function (width, height) {
                return new ns.Matrix(width, height);
            },

            /**
             * Creates a matrix and populates it with given data
             * 
             * @param       {Array}                 matrixArray
             * @return      {BrickGame.Matrix}
             */
            createFromArray : function (matrixArray) 
            {
                matrixArray = validateGetArray(matrixArray);
                var width = matrixArray.length;
                var height = matrixArray[0].length;
                var outputMatrix = this.createEmpty(width, height);
                
                return outputMatrix.fromArray(matrixArray);
            },
            
            /**
             * Creates a matrx as a part of existing, bigger matrix
             * 
             * @param       {BrickGame.Matrix}          matrix      The matrix to take
             *                                                      part from
             * @param       {Object}                    coords      Contains keys:
             *                                                      offsetX, offsetY,
             *                                                      width, height
             * @returns     {BrickGame.Matrix}
             * @throws      {BrickGame.OutOfBoundsError}            If the coords are out
             *                                                      of bounds
             */
            createSubmatrix : function (matrix, coords)
            {
                coords = validateCoords(matrix, coords);
                var matrixArray = matrix.getArray();
                var submatrixArray = [];
                var dx = 0;
                var dy = 0;
                for (var x = coords.offsetX; x < (coords.offsetX + coords.width); x++) {
                    submatrixArray[dx] = submatrixArray[dx] || [];
                    for (var y = coords.offsetY; y < (coords.offsetY + coords.height); y++) {
                        submatrixArray[dx][dy++] = matrixArray[x][y];
                    }
                    dx++;
                    dy = 0;
                }
                
                return this.createFromArray(submatrixArray);
            },
            
            
            /**
             * Combines two matrixes by placing given submatrix on given matrix
             * with given coords (offsetX, offsetY)
             * 
             * @param       {BrickGame.Matrix}      matrix
             * @param       {BrickGame.Matrix}      submatrix
             * @param       {Object}                coords      Contains offsetX 
             *                                                  and offsetY properties
             * @returns     {BrickGame.Matrix}      
             */
            createCombined : function (matrix, submatrix, coords)
            {
                var resultMatrix = this.createFromArray(matrix.getArray());
                for (var x = 0; x < submatrix.getWidth(); x++) {
                    var dx = coords.offsetX + x;
                    for (var y = 0; y < submatrix.getHeight(); y++) {
                        var dy = coords.offsetY + y;
                        var submatrixState = submatrix.getState(x, y);
                        try {
                            var matrixState = matrix.getState(dx, dy);
                            
                            // The logix "OR" - if any state is positive, the output state
                            // will be positive
                            resultMatrix.setState(dx, dy, (submatrixState || matrixState)); 
                        } catch (error) {}
                    }
                }
                
                return resultMatrix;
            }
        };
        
    })();
    
    
    /////////////////////////////////////////////
    ////////////////// FACTORY //////////////////
    /////////////////////////////////////////////
    
    /**
     * Returns a single instance of MatrixCreator
     * 
     * @return  {BrickGame.MatrixCreator}
     */
    ns.MatrixCreator.getInstance = (function ()
    {
        /**
         * 
         * @type {BrickGame.MatrixCreator}
         */
        var instance = null;
        
        function doGetInstance () 
        {
            return new ns.MatrixCreator();
        }
        
        return function () {
            if (instance === null) {
                instance = doGetInstance();
            }
            
            return instance;
        };
    })();
    
})(BrickGame);
