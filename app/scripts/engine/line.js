/*
 * Detects full lines and removes them from the matrix
 * 
 * @author Maciej Garycki <maciekgarycki@gmail.com>
 */
var BrickGame = BrickGame || {};

(function(ns, undefined) {
    
    'use strict';
    
    /**
     * 
     * @constructor
     * @param       {BrickGame.EventDispatcher}     eventDispatcher
     * @returns     {undefined}
     */
    ns.LineDetector = function (eventDispatcher)
    {
        this.eventDispatcher = eventDispatcher;
    };
    
    
    ns.LineDetector.prototype = (function () {
        
        
        function updateSingleLine (ny, matrix)
        {
            var x;
            var y;
            for (y = ny; y > 0; y--) {
                for (x = 0; x < matrix.getWidth(); x ++) {
                    var state = matrix.getState(x, (y - 1));
                    matrix.setState(x, y, state);
                }
            }
            
            for (x = 0; x < matrix.getWidth(); x++) {
                matrix.setState(x, 0, false);
            }
        }
        
        
        /**
         * Updates the matrix by removing the full lines and moving the top lines
         * down
         * 
         * @param   {BrickGame.Matrix}              matrix
         * @param   {Array}                         fullLines
         * @param   {BrickGame.EventDispatcher}     eventDispatcher
         */
        function doUpdateMatrix (matrix, fullLines, eventDispatcher)
        {
            for (var i = 0; i < fullLines.length; i++) {
                updateSingleLine(fullLines[i], matrix);
            }
            
            eventDispatcher.dispatchEvent(new ns.Event('full_lines_found', {
                count : fullLines.length
            }));
        }
        
        return {
            
            
            updateMatrix : function (matrix)
            {
                var fullLines = this.detectLines(matrix);
                if (fullLines.length) {
                    doUpdateMatrix(matrix, fullLines, this.eventDispatcher);
                }
            },
            
            
            /**
             * Detects full lines ocurrances
             * 
             * @param       {BrickGame.Matrix}      matrix
             * @returns     {Array}                 An array of Y position values
             *                                      that represent rows indexes that
             *                                      are full lines
             */
            detectLines : function (matrix)
            {
                var lines = [];
                for (var y = 0; y < matrix.getHeight(); y++) {
                    var hasLine = true;
                    for (var x = 0; x < matrix.getWidth(); x++) {
                        if (!matrix.getState(x, y)) {
                            hasLine = false;
                            break;
                        }
                    }
                    if (hasLine) {
                        lines.push(y);
                    }
                }
                
                return lines;
            }
        };
        
    })();
    
    
    ns.LineDetector.prototype.constructor = ns.LineDetector;
    
})(BrickGame);