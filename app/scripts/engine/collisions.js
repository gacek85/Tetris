/*
 * Detects matrix collisions
 * 
 * @author Maciej Garycki <maciekgarycki@gmail.com>
 */
var BrickGame = BrickGame || {};

(function(ns, undefined) {
    
    'use strict';
    
    /**
     * Constructs a collision detection service
     * 
     * @constructor
     * @parameter       {BrickGame.MatrixCreator}
     * @returns         {undefined}
     */
    ns.CollisionsDetector = function (matrixCreator) 
    {
        this.eventDispatcher = null;
        this.matrixCreator = matrixCreator;
    };
    
    
    ns.CollisionsDetector.prototype = (function () {
        
        /**
         * Returns an array of coords on which the fields in both matrixes
         * have positive state
         * 
         * @param       {BrickGame.Matrix}      matrix1
         * @param       {BrickGame.Matrix}      matrix2
         * @returns     {Array}
         */
        function crateConflictDiff (matrix1, matrix2)
        {
            var collisions = [];
            for (var x = 0; x < matrix1.getWidth(); x++) {
                for (var y = 0; y < matrix1.getHeight(); y++) {
                    var state1 = matrix1.getState(x, y);
                    var state2 = matrix2.getState(x, y);
                    
                    if (state1 && state2) {
                        collisions.push({
                            x : x,
                            y : y
                        });
                    }
                }
            }
            
            return collisions;
        }
        
        return {
        
            /**
             * Detects if a block represented by positionInfo can be moved
             * to given point without collisions
             * 
             * @param   {BrickGame.PositionInfo}    positionInfo    The info of the block
             *                                                      matrix to move
             * @param   {BrickGame.Matrix}          matrix          The stage matrix
             * @param   {Object}                    vector          An object containing
             *                                                      offsetX and offsetY
             *                                                      keys, may be negative
             *                                                      integers
             * @return  {Boolean}    
             */
            canMove : function (positionInfo, matrix, vector)
            {
                vector = vector || {};
                var moveX = vector.offsetX || 0;
                var moveY = vector.offsetY || 0;
                var submatrix;

                var coords = {
                    offsetX     :   positionInfo.getOffsetX() + moveX,
                    offsetY     :   positionInfo.getOffsetY() + moveY,
                    width       :   positionInfo.getMatrix().getWidth(),
                    height      :   positionInfo.getMatrix().getHeight()
                };

                try {
                    submatrix = this.matrixCreator.createSubmatrix(matrix, coords);
                } catch (error) {
                    if (error instanceof ns.OutOfBoundsError) {
                        
                        this.dispatchEvent(new ns.Event('out_of_bounds', {
                            errors : error.getErrors()
                        }));
                        
                        return false;
                    } else {
                        throw error;
                    }
                }

                var conflictDiff = crateConflictDiff(submatrix, positionInfo.getMatrix());
                return conflictDiff.length === 0;

            },

            /**
             * Sets the event dispatcher object
             * 
             * @param       {Object}                            eventDispatcher
             * @returns     {BrickGame.CollisionsDetector}      This object
             */
            setEventDispatcher : function (eventDispatcher)
            {
                this.eventDispatcher = eventDispatcher;
                return this;
            },
            
            /**
             * Dispatches the event if the event dispatcher is present
             * 
             * @param       {BrickGame.Event} event
             * @returns     {BrickGame.CollisionsDetector}      This object
             */
            dispatchEvent : function (event)
            {
                if (this.eventDispatcher !== null) {
                    this.eventDispatcher.dispatchEvent(event);
                }
                
                return this;
            }
        };
        
    })();
    
    
})(BrickGame);