/*
 * A set of default shape providers plus a shape generator
 * service
 * 
 * @author Maciej Garycki <maciekgarycki@gmail.com>
 */
var BrickGame = BrickGame || {};

(function(ns, undefined) {
    
    'use strict';
    
    /** Global namespace for the providers */
    ns.ShapeProviders = ns.ShapeProviders || {};
    
    /**
     * Provides a single long line shape, 4 rows, 1 column
     * 
     *      #
     *      #
     *      #
     *      #
     */
    ns.ShapeProviders.LongLineShapeProvider = {
        
        /**
         * Provides a matrix description of a shape
         * 
         * @returns {Array}
         */
        getMatrix : function () 
        {
            return [
                [1, 1, 1, 1]
            ];
        },
        
        /**
         * Provides an unique name for the shape and the provider itself
         * 
         * @returns {String}
         */
        getUniqueNameIdentifier : function () 
        {
            return 'long_line';
        }
    };
    
    
    /**
     * Provides a L shape block
     * 
     *     ###
     *       #
     */
    ns.ShapeProviders.LShapeLeftProvider = {
        
        /**
         * Provides a matrix description of a shape
         * 
         * @returns {Array}
         */
        getMatrix : function () 
        {
            return [
                [1, 0],
                [1, 0],
                [1, 1]
            ];
        },
        
        /**
         * Provides an unique name for the shape and the provider itself
         * 
         * @returns {String}
         */
        getUniqueNameIdentifier : function () 
        {
            return 'l_shape_left';
        }
    };
    
    
    
    /**
     * Provides a L shaped block
     * 
     *     ###
     *     #
     */
    ns.ShapeProviders.LShapeRightProvider = {
        
        /**
         * Provides a matrix description of a shape
         * 
         * @returns {Array}
         */
        getMatrix : function () 
        {
            return [
                [1, 1],
                [1, 0],
                [1, 0]
            ];
        },
        
        /**
         * Provides an unique name for the shape and the provider itself
         * 
         * @returns {String}
         */
        getUniqueNameIdentifier : function () 
        {
            return 'l_shape_right';
        }
    };
    
    
    /**
     * Provides a ZigZag shape Z
     * 
     *     ##
     *      ##
     */
    ns.ShapeProviders.ZigZagZProvider = {
        
        /**
         * Provides a matrix description of a shape
         * 
         * @returns {Array}
         */
        getMatrix : function () 
        {
            return [
                [1, 0],
                [1, 1],
                [0, 1]
            ];
        },
        
        /**
         * Provides an unique name for the shape and the provider itself
         * 
         * @returns {String}
         */
        getUniqueNameIdentifier : function () 
        {
            return 'zigzag_shape_z';
        }
    };
    
    
    /**
     * Provides a ZigZag shape S
     * 
     *     ##
     *    ##
     */
    ns.ShapeProviders.ZigZagSProvider = {
        
        /**
         * Provides a matrix description of a shape
         * 
         * @returns {Array}
         */
        getMatrix : function () 
        {
            return [
                [0, 1],
                [1, 1],
                [1, 0]
            ];
        },
        
        /**
         * Provides an unique name for the shape and the provider itself
         * 
         * @returns {String}
         */
        getUniqueNameIdentifier : function () 
        {
            return 'zigzag_shape_s';
        }
    };
    
    
    /**
     * Provides a 4 x 4 block shape, 2 rows, 2 columns
     * 
     *      ##
     *      ##
     */
    ns.ShapeProviders.FourByFourBlock = {
        
        /**
         * Provides a matrix description of a shape
         * 
         * @returns {Array}
         */
        getMatrix : function () 
        {
            return [
                [1, 1],
                [1, 1]
            ];
        },
        
        /**
         * Provides an unique name for the shape and the provider itself
         * 
         * @returns {String}
         */
        getUniqueNameIdentifier : function () 
        {
            return 'four_by_four';
        }
    };
    
    
    /**
     * Provides a T shaped block
     * 
     *     ###
     *      #
     */
    ns.ShapeProviders.TShapeProvider = {
        
        /**
         * Provides a matrix description of a shape
         * 
         * @returns {Array}
         */
        getMatrix : function () 
        {
            return [
                [1, 0],
                [1, 1],
                [1, 0]
            ];
        },
        
        /**
         * Provides an unique name for the shape and the provider itself
         * 
         * @returns {String}
         */
        getUniqueNameIdentifier : function () 
        {
            return 't_shape';
        }
    };
    
    
    /**
     * Produces a shape matrix
     * 
     * @param       {MatrixCreator}     matrixCreator
     * @returns     {undefined}
     */
    ns.ShapeGenerator = function (matrixCreator) {
        this.matrixCreator = matrixCreator;
        this.shapeProviders = {};
    };
    
    
    ns.ShapeGenerator.prototype = (function () {
        
        /**
         * Checks if provider with given key exists within the collection.
         * If not, returns it, if so - throws error
         * 
         * @param       {Object}        shapeProvider
         * @param       {Object}        collection
         * @returns     {Object}        shapeProvider
         * @throws      {Error} 
         */
        function validateGetProvider (shapeProvider, collection)
        {
            var key = shapeProvider.getUniqueNameIdentifier();
            if (!!collection[key]) {
                throw new Error('Provider with identifier ' + key + 'is already registered!');
            }
            
            return shapeProvider;
        }
        
        
        /**
         * Provides object's own keys in an array
         * 
         * @param       {Object}        object
         * @returns     {Array}         an array of strings
         */
        function getKeys (object)
        {
            var keys = [];
            for (var key in object) {
                if (object.hasOwnProperty(key)) {
                    keys.push(key);
                }
            }

            return keys;
        }
        
        
        /**
         * Provides random value from an array given
         * 
         * @param       {Array}         theArray
         * @returns     {Object}        The random value from given array
         */
        function getRandomValue (theArray)
        {
            var randomKey = Math.round(Math.random() * (theArray.length - 1));
            return theArray[randomKey];
        }
        
        
        return {
        
            /**
             * Registers a shape provider, throws an error if shape provider
             * with given identifier name is already registered
             * 
             * @param       {Object}            shapeProvider
             * @return      {ShapeGenerator}    This object
             */
            registerShapeProvider : function (shapeProvider)
            {
                var key = shapeProvider.getUniqueNameIdentifier();
                this.shapeProviders[key] = validateGetProvider(
                    shapeProvider, 
                    this.shapeProviders
                );
        
                return this;
            },
            
            
            /**
             * Returns a name provider for given nameIdentifier. Throws error
             * if such does not exist.
             * 
             * @param       {String}    nameIdentifier
             * @returns     {Object}
             * @throws      {Error}     If shape provider for given name identifier 
             *                          does not exist
             */
            getProvider : function (nameIdentifier)
            {
                var provider = this.shapeProviders[nameIdentifier];
                return !!provider ? provider : (function (key) {
                    throw new Error('Provider for name identifier ' + key + 'does not exist!');
                })(nameIdentifier);
            },
            
            /**
             * Provides a matrix for given nameIdentifier
             * 
             * @param       {String}    nameIdentifier
             * @returns     {Matrix}
             */
            getShapeBlock : function (nameIdentifier)
            {
                var provider = this.getProvider(nameIdentifier);
                var matrixArray = provider.getMatrix();
                
                return this.matrixCreator.createFromArray(matrixArray);
            },
            
            /**
             * Provides a randomly selected shape matrix
             * 
             * @returns     {Matrix}
             */
            getRandomShapeBlock : function ()
            {
                var keys = getKeys(this.shapeProviders);
                var randomIdentifier = getRandomValue(keys);
                
                return this.getShapeBlock(randomIdentifier);
            }

        };
    })();
    
    
    /**
     * Provides default setup of ShapeGenerator with injected services in
     * form of a single instance
     * 
     * @returns {ShapeGenerator}
     */
    ns.ShapeGenerator.getDefaultInstance = (function () {
        
        var shapeGenerator = null;
        
        
        /**
         * Produces and populates the default setup of ShapeGenerator
         * 
         * @return {ShapeGenerator}
         */
        function doGetDefaultInstance ()
        {
            var shapeGenerator = new ns.ShapeGenerator(ns.MatrixCreator.getInstance());
            for (var name in ns.ShapeProviders) {
                if (ns.ShapeProviders.hasOwnProperty(name)) {
                    var provider = ns.ShapeProviders[name];
                    shapeGenerator.registerShapeProvider(provider);
                }
            }
            
            return shapeGenerator;
        }
        
        
        return function ()
        {
            if (shapeGenerator === null) {
                shapeGenerator = doGetDefaultInstance();
            }
            
            return shapeGenerator;
        };
    })();
    
})(BrickGame);