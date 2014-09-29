/*
 * Brick stage area renderer. Renders DOM objects for
 * given dimentions displaying N x M matrix of square
 * bricks (each in inactive state initially). Provides
 * a method for re-rendering the entire grid for matrix
 * with given binary states for each brick.
 * 
 * @author Maciej Garycki <maciekgarycki@gmail.com>
 */
var BrickGame = BrickGame || {};

(function($, ns, document, undefined) {
    
    'use strict';
    
    /**
     * Constructs the BrickGame.StageRenderer object
     * 
     * @returns {undefined}
     * @constructor
     */
    ns.StageRenderer = function (domElement, config)
    {
        this.config = config || {};
        this.domElement = domElement;
        this.$domElement = $(domElement);
        this.matrixCreator = null;
        this.eventDispatcher = null;
        this.matrix = null;
        
    };
    
    
    ns.StageRenderer.prototype = (function () {
        
        /**
         * Validates if the key exists in the object. Returns the value
         * if exists, throws error otherwise
         * 
         * @param   {String}        key
         * @param   {Object}        object
         * @returns {Object}
         * @throws  {TypeError}     Thrown if key does not exist within the object
         */
        function validateKey (key, object)
        {
            if (!object.hasOwnProperty(key)) {
                throw new TypeError('Property ' + key + ' does not exist within the object!'); 
            } else {
                return object[key];
            }
        }
        
        /**
         * Returns the class name for given state
         * 
         * @param       {Boolean}       state
         * @returns     {String}
         */
        function getClass (state)
        {
            return state    ?   ns.StageRenderer.STATE_POSITIVE_CLASS
                            :   ns.StageRenderer.STATE_NEGATIVE_CLASS;
        }
        
        
        /**
         * Sets up the DOM with proper elements
         * 
         * @param       {BrickGame.Matrix}      matrix
         * @param       {jQuery}                $domElement
         * @returns     {undefined}
         */
        function render (matrix, $domElement)
        {
            var matrixArray = matrix.getArray();
            for (var x = 0; x < matrix.getWidth(); x++) {
                var column = matrixArray[x];
                var $row = $('<div class="column"></div>');
                for (var y = 0; y < column.length; y++) {
                    var $block = $('<div class="block ' + getClass(matrix.getState(x, y)) + '"></div>');
                    $row.append($block);
                    var params = matrix.getParams(x, y);
                    params.$element = $block;
                    matrix.setParams(x, y, params);
                }
                
                $domElement.append($row);
            }
        }
        
        
        /**
         * Redraws the matrix using the changeset
         * 
         * @param       {BrickGame.Matrix}          matrixInstance
         * @param       {Array}                     changeset
         */
        function doRedraw (matrixInstance, changeset)
        {
            for (var i = 0; i < changeset.length; i++) {
                var x = changeset[i].x;
                var y = changeset[i].y;
                var $element = matrixInstance.getParams(x, y).$element;
                $element
                        .toggleClass(ns.StageRenderer.STATE_POSITIVE_CLASS)
                        .toggleClass(ns.StageRenderer.STATE_NEGATIVE_CLASS)
                ;
                matrixInstance.toggleState(x, y);
            }
        }
        
        
        return {
            
            /**
             * Sets the matrix creator object
             * 
             * @param       {BrickGame.MatrixCreator}       matrixCreator
             * @returns     {BrickGame.StageRenderer}       This object
             */
            setMatrixCreator : function (matrixCreator)
            {
                this.matrixCreator = matrixCreator;
                return this;
            },
        
            
            /**
             * Sets the event dispatcher object
             * 
             * @param       {Object}                    eventDispatcher
             * @returns     {BrickGame.StageRenderer}   This object
             */
            setEventDispatcher : function (eventDispatcher)
            {
                this.eventDispatcher = eventDispatcher;
                return this;
            },
           
            /**
             * Initializes the StageRenderer object
             * 
             * @returns     {BrickGame.StageRenderer}
             */
            init : function ()
            {
                this.matrix = this.matrixCreator.createEmpty(
                    validateKey('width', this.config),
                    validateKey('height', this.config)
                );
                render(this.matrix, this.$domElement);
                
                this.dispatchEvent(new ns.Event('view_rendered', {
                    matrix : this.matrix,
                    domElement : this.domElement
                }));
                
                return this;
            },
            
            
            /**
             * Dispatches the event if the event dispatcher is present
             * 
             * @param       {BrickGame.Event}               event
             * @returns     {BrickGame.StageRenderer}       This object
             */
            dispatchEvent : function (event)
            {
                if (this.eventDispatcher !== null) {
                    this.eventDispatcher.dispatchEvent(event);
                }
                
                return this;
            },
            
            
            /**
             * 
             * @param       {BrickGame.Matrix}              matrix
             * @returns     {BrickGame.StageRenderer}       This object
             */
            redraw : function (matrix)
            {

                var changeset = [];
                for (var x = 0; x < this.matrix.getWidth(); x++) {
                    for (var y = 0; y < this.matrix.getHeight(); y++) {
                        
                        
                        if (this.matrix.getState(x, y) !== matrix.getState(x, y)) {
                            changeset.push({
                                x : x,
                                y : y
                            });
                        }
                    }
                }
                
                doRedraw(this.matrix, changeset);
                
                this.dispatchEvent(new ns.Event('view_redrawn', {
                    matrix : this.matrix,
                    domElement : this.domElement,
                    changeset : changeset
                }));
                
                return this;
            }
        };
    })();
    
    
    /////////////////////////////////////////////
    ////////////// CLASS CONSTANTS //////////////
    /////////////////////////////////////////////
    
    ns.StageRenderer.STATE_POSITIVE_CLASS = 'on';
    ns.StageRenderer.STATE_NEGATIVE_CLASS = 'off';
    
    
})(jQuery, BrickGame, window.document);
