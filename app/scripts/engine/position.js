/*
 * Monitors the position of blocks matrixes against stage matrix
 * and returns overall (combined) matrix being an addition of
 * block matrix on current position and the stage matrix
 * 
 * @author Maciej Garycki <maciekgarycki@gmail.com>
 */
var BrickGame = BrickGame || {};

(function(ns, undefined) {
    
    'use strict';
    
    
    /**
     * Constructs a PositionInfo instance
     * 
     * @constructor
     * @param       {Number}                    offsetX
     * @param       {Number}                    offsetY
     * @param       {BrickGame.Matrix}          matrix
     * @returns     {undefined}
     */
    ns.PositionInfo = function (offsetX, offsetY, matrix)
    {
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.matrix = matrix;
    };
    
    
    ns.PositionInfo.prototype = {
        
        /**
         * Returns an object with current position of the matrix containing 
         * x and y coordinates as positive integers
         * 
         * @returns         {Object}    Object with two keys: offsetX and offsetY
         */
        getPosition : function ()
        {
            return {
                offsetX : this.offsetX,
                offsetY : this.offsetY
            };
        },
        
        /**
         * Returns the X offset coordinate of the matrix
         * 
         * @returns         {Number}    Positive integer 
         */
        getOffsetX : function ()
        {
            return this.offsetX;
        },
        
         
        /**
         * Returns the Y offset coordinate of the matrix
         * 
         * @returns         {Number}    Positive integer 
         */
        getOffsetY : function () 
        {
            return this.offsetY;
        },
        
        
        /**
         * Sets the X offset of the matrix
         * 
         * @param       {Number}                        offsetX
         * @returns     {BrickGame.PositionInfo}        This object
         */
        setOffsetX : function (offsetX)
        {
            this.offsetX = parseInt(offsetX);
            return this;
        },
        
        
        /**
         * Sets the Y offset of the matrix
         * 
         * @param       {Number}                        offsetY
         * @returns     {BrickGame.PositionInfo}        This object
         */
        setOffsetY : function (offsetY)
        {
            this.offsetY = parseInt(offsetY);
            return this;
        },
        
        
        /**
         * Returns the matrix object
         * 
         * @return      {BrickGame.Matrix}          The matrix related to the
         *                                          Position info object
         */
        getMatrix : function ()
        {
            return this.matrix;
        },
        
        
        /**
         * Clones the position info object
         * 
         * @return      {BrickGame.PositionInfo}
         */
        clone : function ()
        {
            var matrix = this.getMatrix().clone();
            return new ns.PositionInfo(this.getOffsetX(), this.getOffsetY(), matrix);
        }
        
    };
    
    
    /**
     * Creates PositionManager instance
     * 
     * @constructor
     * @param       {BrickGame.MatrixCreator}       matrixCreator
     * @param       {BrickGame.Matrix}              stageMatrix
     * @param       {BrickGame.ShapeGenerator}      shapeGenerator
     * @param       {BrickGame.EventDispatcher}     eventDispatcher
     * @param       {BrickGame.CollisionsDetector}  collisionsDetector
     * @param       {BrickGame.StageRenderer}       stageRenderer
     * @param       {BrickGame.MatrixTransformer}   matrixTransformer
     * @param       {BrickGame.LinesDetector}       linesDetector
     * @param       {Object}                        config 
     * 
     * @todo        Refactor to use setters?
     */
    ns.PositionManager = (function () 
    {
        
        /**
         * Extends the first argument object with as many objects passed as
         * further arguments as given. Thanks to:
         * 
         * https://stackoverflow.com/questions/20590177/merge-two-objects-without-override/20591261#20591261
         * 
         * @param       {Object}        target
         * @returns     {Object}
         */
        function extend (target) 
        {
            for (var i = 1; i < arguments.length; ++i) {
                var from = arguments[i];
                if (typeof from !== 'object') {
                    continue;
                }
                for (var j in from) {
                    if (from.hasOwnProperty(j)) {
                        target[j] = (typeof from[j] === 'object')   ?   extend({}, target[j], from[j])
                                                                    :   from[j];
                    }
                }
            }
            return target;
        }
        
        
        // Heavy fuckin' constructor
        return function (
            matrixCreator,
            stageMatrix,
            shapeGenerator,
            eventDispatcher,
            collisionsDetector,
            stageRenderer,
            matrixTransformer,
            linesDetector,
            config
        ) 
        {
            // Services
            this.matrixCreator = matrixCreator;
            this.shapeGenerator = shapeGenerator;
            this.eventDispatcher = eventDispatcher;
            this.collisionsDetector = collisionsDetector;
            this.stageRenderer = stageRenderer;
            this.matrixTransformer = matrixTransformer;
            this.linesDetector = linesDetector;
            
            // State
            this.stageMatrix = stageMatrix;
            this.currentBlockPosition = null;
            this.nextBlock = null;
            this.movementTimeout = null;
            this.movementProvider = new ns.OnKeyCoordsProviders.Down();
            this.config = extend({
                speed : ns.PositionManager.DEFAULT_SPEED
            }, (config || {}));
        };
        
    })();
    
    
    ns.PositionManager.prototype = (function () {
        
        
        /**
         * Updates the position info by coords (offsetX and offsetY) given
         * in the coords object
         * 
         * @param   {BrickGame.PositionInfo}        positionInfo
         * @param   {Object}                        coords
         * @returns {BrickGame.PositionInfo}
         */
        function updatePosition (positionInfo, coords)
        {
            coords = coords || {};
            var offsetX = positionInfo.getOffsetX();
            var offsetY = positionInfo.getOffsetY();
            var dx = offsetX + (coords.offsetX || 0);
            var dy = offsetY + (coords.offsetY || 0);
            
            return positionInfo
                            .setOffsetX(dx)
                            .setOffsetY(dy)
            ;
        }
        
        
        
        /**
         * Sets the event listeners
         * 
         * @param       {BrickGame.EventDispatcher}     eventDispatcher
         * @param       {BrickGame.PositionManager}     positionManager
         */
        function setupEventListeners (eventDispatcher, positionManager)
        {
            eventDispatcher.addEventListener('controls_event', function (event) {
                var data = event.getData();
                var matrix = positionManager.stageMatrix;
                var collisionsDetector = positionManager.collisionsDetector;
                var position;
                
                if (ns.OnKeyCoordsProviders.ACTION_MOVE === data.coords.action) {
                    
                    var outOfBoundsCallback = function (event)
                    {
                        var data = event.getData();
                        var errors = data.errors;
                        if ((errors[0].invalid === ns.OutOfBoundsError.Y_COORD) &&
                            errors[0].value === ns.OutOfBoundsError.MAX_VALUE_EXCEEDED) {

                            positionManager.updateMatrix();
                        }
                    };
                    
                    eventDispatcher.addEventListenerOnce('out_of_bounds', outOfBoundsCallback);
                    var canMove = collisionsDetector.canMove(positionManager.currentBlockPosition, matrix, data.coords);
                    eventDispatcher.removeEventListener('out_of_bounds', outOfBoundsCallback);
                    
                    if (canMove) {
                        position = updatePosition(
                            positionManager.currentBlockPosition.clone(),
                            data.coords
                        );
                        eventDispatcher.dispatchEvent(new ns.Event('block_position_changed', {
                            oldPosition : positionManager.currentBlockPosition,
                            newPosition : position
                        }));
                        positionManager.currentBlockPosition = position;
                        positionManager.renderBlock();
                        if (!!data.auto) {
                            positionManager.initAutoMovement();
                        }
                    } else if (!!data.auto) {
                        eventDispatcher.dispatchEvent(new ns.Event('cycle_ended', {
                            position : positionManager.currentBlockPosition
                        }));
                    }
                } else if (ns.OnKeyCoordsProviders.ACTION_ROTATE_RIGHT === data.coords.action){
                    var currentMatrix = positionManager.currentBlockPosition.getMatrix();
                    var transformedMatrix = positionManager.matrixTransformer.rotateRight(currentMatrix);
                    var transformedPosition = new ns.PositionInfo(
                        positionManager.currentBlockPosition.getOffsetX(),
                        positionManager.currentBlockPosition.getOffsetY(),
                        transformedMatrix
                    );
            
                    if (collisionsDetector.canMove(transformedPosition, matrix)) {
                        position = updatePosition(
                            transformedPosition.clone()
                        );
                        eventDispatcher.dispatchEvent(new ns.Event('block_position_changed', {
                            oldPosition : positionManager.currentBlockPosition,
                            newPosition : position
                        }));
                        positionManager.currentBlockPosition = position;
                        positionManager.renderBlock();
                    }
                }
            });
            
            
            eventDispatcher.addEventListener('cycle_ended', function () {
                positionManager.updateMatrix();
            });
            
            
            eventDispatcher.addEventListener('pre_update_matrix', function (event) {
                var data = event.getData();
                var matrix = data.matrix;
                
                positionManager.linesDetector.updateMatrix(matrix);
            });
            
            
            eventDispatcher.addEventListener('update_speed', function (event) {
                var speed = event.getData().speed;
                positionManager.updateConfig('speed', speed);
            });
        }
        
        
        /**
         * Returns the x offset for given stage block which represents
         * the middle point of the x axis
         * 
         * @param {BrickGame.Matrix} stageMatrix
         * @returns {Number}
         */
        function getMiddlePointX (stageMatrix)
        {
            var width = stageMatrix.getWidth();
            var offsetX = parseInt(width / 2);
            return offsetX ? offsetX - 1 : 0;
        }
        
        
        return {
        
            /**
             * Initializes the whole process of the application.
             * In this case everything is event-oriented so the 
             * event dispatcher plays the main role here
             * 
             * @return      {BrickGame.PositionManager}     This instance
             */
            init : function ()
            {
                setupEventListeners(this.eventDispatcher, this);
                this.stageRenderer.init();
                this.currentBlockPosition = this.generateNewBlockPosition();
                this.nextBlock = this.shapeGenerator.getRandomShapeBlock();
                
                this.eventDispatcher.dispatchEvent(new ns.Event('new_block_generated', {
                    matrix : this.nextBlock
                }));
                
                this.run();
            },
            
            
            /**
             * Generates a new block shape matrix and wraps it into PositionInfo
             * object 
             * 
             * @returns         {BrickGame.PositionInfo}
             */
            generateNewBlockPosition : function ()
            {
                
                var matrix = this.nextBlock ?   this.nextBlock 
                                            :   this.shapeGenerator.getRandomShapeBlock();
                var offsetX = getMiddlePointX(this.stageMatrix);
                var offsetY = 0;
                
                return new ns.PositionInfo(offsetX, offsetY, matrix);
            },
            
            
            /**
             * Runs the auto movement process
             * 
             * @returns         {BrickGame.PositionManager}
             */
            run : function ()
            {
                this.renderBlock();
                this.initAutoMovement();
                
                return this;
            },
            
            
            /**
             * Creates overall matrix and calls redraw method on the stageRenderer,
             * which causes rerendering of the stage
             * 
             * @returns         {BrickGame.PositionManager}
             */
            renderBlock : function ()
            {
                var renderMatrix = this.matrixCreator.createCombined(
                    this.stageMatrix,
                    this.currentBlockPosition.getMatrix(),
                    this.currentBlockPosition.getPosition()
                );
                
                this.eventDispatcher.dispatchEvent(new ns.Event('pre_render_matrix', {
                    matrix : renderMatrix
                }));
                
                this.stageRenderer.redraw(renderMatrix);
                
                return this;
            },
            
            
            /**
             * Initiates auto movement of the brick block 'down'
             * 
             * @returns         {BrickGame.PositionManager}
             */
            initAutoMovement : function ()
            {
                var that = this;
                if (this.movementTimeout) {
                    clearTimeout(this.movementTimeout);
                }
                this.movementTimeout = setTimeout(function () {
                    that.eventDispatcher.dispatchEvent(new ns.Event('controls_event', {
                        coords : that.movementProvider.getCoords(),
                        auto : true
                    }));
                },this.config.speed);
                
                return this;
            },
            
            
            /**
             * Updates the inner values of the matrix
             * 
             * @returns         {BrickGame.PositionManager}
             */
            updateMatrix : function ()
            {
                var newStageMatrix = this.matrixCreator.createCombined(
                    this.stageMatrix,
                    this.currentBlockPosition.getMatrix(),
                    this.currentBlockPosition.getPosition()
                );
        
                this.eventDispatcher.dispatchEvent(new ns.Event('pre_update_matrix', {
                    matrix : newStageMatrix
                }));
        
                this.stageMatrix = newStageMatrix;

                this.currentBlockPosition = this.generateNewBlockPosition();
                this.nextBlock = this.shapeGenerator.getRandomShapeBlock();
                
                this.eventDispatcher.dispatchEvent(new ns.Event('new_block_generated', {
                    matrix : this.nextBlock
                }));

                this.run();
                
                return this;
            },
            
            
            /**
             * Updates the config value
             * 
             * @param       {String}                    key
             * @param       {Object}                    value
             * @returns     {BrickGame.PositionManager}
             */
            updateConfig : function (key, value)
            {
                this.config[key] = value;
                return this;
            }
        };
    })();
    
    ns.PositionManager.prototype.constructor = ns.PositionManager;
    
    
    /////////////////////////////////////////////
    ////////////// CLASS CONSTANTS //////////////
    /////////////////////////////////////////////
    
    ns.PositionManager.DEFAULT_SPEED = 1000;  // Delay in ms, 1000ms = 1s
    
})(BrickGame);