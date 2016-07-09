var BrickGame = BrickGame || {};
(function(ns, undefined) {
    
    'use strict';
    
    ns.SpeedManager = (function () {
        
        /**
         * 
         * @param   {BrickGame.EventDispatcher}     eventDispatcher
         * @param   {Array}                         providers
         * @returns {undefined}
         */
        function registerEvent (eventDispatcher, providers) {
            eventDispatcher.addEventListener('score_changed', function (event) {
                var score = event.getData().score,
                    speed,
                    level
                ;
                for (var k in providers) {
                    var provider = providers[k];
                    if (provider.matchesScore(score)) {
                        speed = provider.getSpeed();
                        level = provider.getLevel();
                        
                        eventDispatcher.dispatchEvent(new BrickGame.Event('level_updated', {
                            speed : speed,
                            level : level,
                            score : score
                        }));
                    }
                }
            });
        }
        
        
        /**
         * Constructor function
         * 
         * @param {BrickGame.EventDispatcher}   eventDispatcher
         */
        return function (eventDispatcher) {
            this.eventDispatcher = eventDispatcher;
            registerEvent(eventDispatcher, this.providers);
        };
        
    })();
    
    ns.SpeedManager.prototype = {
        
        providers : [],
        
        /**
         * Registers speed provider
         * 
         * 
         */
        addSpeedProvider : function (provider) {
            this.providers.push(provider);
        }
    };
    
    ns.SpeedManager.prototype.constructor = ns.SpeedManager;
    
    
    /**
     * Constructs a default speed provider
     * 
     * @param   {Object} range
     * @param   {Number} speed
     * @param   {Number} level
     * @constructor
     */
    ns.SpeedProvider = function (range, speed, level) {
        this.range = range;
        this.speed = speed;
        this.level = level;
    };
    
    ns.SpeedProvider.prototype = {
        
        /**
         * Returns related level
         * 
         * @return      {Number}
         */
        getLevel : function () {
            return this.level;
        },
        
        
        /**
         * Returns related speed
         * 
         * @return      {Number}
         */
        getSpeed : function () {
            return this.speed;
        },
        
        
        /**
         * Checks if given score matches the provider's related
         * range
         * 
         * @param       {Number}
         * @return      {Boolean}
         */
        matchesScore : function (score) {
            return (score >= this.range.from) && (score <= this.range.to);
        }
    };
    
    ns.SpeedProvider.prototype.constructor = ns.SpeedProvider;
    
})(BrickGame);