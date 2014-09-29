/*
 * Controls the moves in the game taking the input from the 
 * user
 * 
 * @author Maciej Garycki <maciekgarycki@gmail.com>
 */
var BrickGame = BrickGame || {};

(function($, ns, window, document, undefined) {
    
    'use strict';
    
    /**
     * Creates the MovesController instance
     * 
     * @param   {BrickGame.EventDispatcher}      eventDispatcher
     * @returns {undefined}
     * @constructor
     */
    ns.MovesController = (function () {
        
        /**
         * Initiates the object, sets event listeners
         * 
         * @param       {ns.MovesController}    movesController
         * @returns     {undefined}
         */
        function init (movesController)
        {
            var eventDispatcher = movesController.getEventDispatcher();
            var onKeyCoordsProviders = movesController.getOnKeyCoordsProviders();
            
            // Bind keydown event to the document object and check if pressed key
            // matches any registered coordinates provider. If so, let the event
            // dispatcher emit proper event containing the coordinates.
            movesController.$document.on('keydown', function (ev) {
                var keyCode = ev.which;
                var onKeyCoordsProvider = onKeyCoordsProviders[keyCode];
                if (!!onKeyCoordsProvider) {
                    var coords = onKeyCoordsProvider.getCoords();
                    
                    eventDispatcher.dispatchEvent(new ns.Event('controls_event', {
                        coords : coords
                    }));
                }
            });
        }
        
        
        return function (eventDispatcher)
        {
            this.eventDispatcher = eventDispatcher;
            this.$document = $(document);
            this.onKeyCoordsProviders = {};
            init(this);
        };
    })();
    
    
    ns.MovesController.prototype = (function () {
        
        /**
         * Validates if provider for given key exists, if so throws error,
         * otherwise returns the provider
         * 
         * @param       {Object}        providers               The collection of 
         *                                                      existing providers
         * @param       {Object}        onKeyCoordsProvider
         * @returns     {Object}
         * @throws      {Error}         If coords provider for given key
         *                              already exists
         */
        function validateGetCoordsProvider (providers, onKeyCoordsProvider)
        {
            var key = onKeyCoordsProvider.getKeyNumber();
            if (providers[key] !== undefined) {
                throw new Error('Provider for key ' + key + ' already exists!');
            }
            
            return onKeyCoordsProvider;
        }
        
        return {
        
            /**
             * Returns event dispatcher object
             * 
             * @return      {BrickGame.EventDispatcher}
             */
            getEventDispatcher : function ()
            {
                return this.eventDispatcher;
            },

            /**
             * Registers new onKeyCoordsProvider object for providing coordinates
             * related to pressed keyboard key
             * 
             * @param       {Object}                        onKeyCoordsProvider
             * @returns     {BrickGame.MovesController}
             * @throws      {Error}                         If coords provider for given key
             *                                              already exists
             */
            registerOnKeyCoordsProvider : function (onKeyCoordsProvider)
            {
                var key = onKeyCoordsProvider.getKeyNumber();
                this.onKeyCoordsProviders[key] = validateGetCoordsProvider(
                    this.onKeyCoordsProviders,
                    onKeyCoordsProvider
                );
        
                return this;
            },
            
            /**
             * Returns all available coordinates providers objects
             * 
             * @returns {Object}
             */
            getOnKeyCoordsProviders : function ()
            {
                return this.onKeyCoordsProviders;
            }

        };
        
    })();
    
    ns.MovesController.prototype.constructor = ns.MovesController;
    
    
    ns.OnKeyCoordsProviders = {};
    
    /**
     * Default prototype for the coords providers
     */
    ns.OnKeyCoordsProviders.ProvidersPrototype = {
        
        /**
         * Returns the char number of the keyboard key
         * 
         * @returns         {Number}
         * @throws          {Error}         If the char number is not defined 
         *                                  in the object property
         */
        getKeyNumber : function () 
        {
            if (this.charNumber === undefined) {
                throw new Error('The object does not contain the char number!');
            }
            
            return this.charNumber;
        },
        
        
        /**
         * Returns the coordinates object
         * 
         * @returns         {Object}        Coordinates object containing offsetX
         *                                  and offsetY integer values (optional, may be
         *                                  negative) and action name (mandatory)
         *                                  
         * @throws          {Error}         If the coordinates object is not defined 
         *                                  in the object property
         */
        getCoords : function ()
        {
            if (this.coords === undefined) {
                throw new Error('The object does not contain the coordinates!');
            }
            
            return this.coords;
        }
    };
    
    
    /////////////////////////////////////////////
    /////// DEFAULT KEY COORDS PROVIDERS ////////
    /////////////////////////////////////////////
    
    
    ns.OnKeyCoordsProviders.Left = function ()
    {
        this.charNumber = 37;
        this.coords = {
            action : ns.OnKeyCoordsProviders.ACTION_MOVE,
            offsetX : -1,
            offsetY : 0
        };
    };
    
    ns.OnKeyCoordsProviders.Left.prototype = ns.OnKeyCoordsProviders.ProvidersPrototype;
    
    
    ns.OnKeyCoordsProviders.Right = function ()
    {
        this.charNumber = 39;
        this.coords = {
            action : ns.OnKeyCoordsProviders.ACTION_MOVE,
            offsetX : 1,
            offsetY : 0
        };
    };
    
    ns.OnKeyCoordsProviders.Right.prototype = ns.OnKeyCoordsProviders.ProvidersPrototype;
    
    
    ns.OnKeyCoordsProviders.Down = function ()
    {
        this.charNumber = 40;
        this.coords = {
            action : ns.OnKeyCoordsProviders.ACTION_MOVE,
            offsetX : 0,
            offsetY : 1
        };
    };
    
    ns.OnKeyCoordsProviders.Down.prototype = ns.OnKeyCoordsProviders.ProvidersPrototype;
    
    
    ns.OnKeyCoordsProviders.Space = function ()
    {
        this.charNumber = 32;
        this.coords = {
            action : ns.OnKeyCoordsProviders.ACTION_ROTATE_RIGHT
        };
    };
    
    ns.OnKeyCoordsProviders.Space.prototype = ns.OnKeyCoordsProviders.ProvidersPrototype;
    
    
    
    /////////////////////////////////////////////
    ///////////////// CONSTSNTS /////////////////
    /////////////////////////////////////////////
    
    
    ns.OnKeyCoordsProviders.ACTION_ROTATE_RIGHT = 'rotate_right';
    ns.OnKeyCoordsProviders.ACTION_MOVE = 'move';
    
})(jQuery, BrickGame, window, window.document);