/**
 * Primitive event dispatcher
 * 
 * @author Maciej Garycki <maciekgarycki@gmail.com>
 */
var BrickGame = BrickGame || {};
(function(ns, undefined) {
    
    'use strict';
    
    /**
     * Constructs a simple event
     * 
     * @param           {String}        type        The name of the event
     * @param           {Object}        data        Optional event data
     * @returns         {undefined}
     * @throws          {TypeError}                 When type not present
     * @constructor
     */
    ns.Event = function (type, data)
    {
        if (type === undefined) {
            throw new TypeError('Event type must be provided!');
        }
        this.type = type;
        this.data = data || {};
        this.isStoppedPropagation = false;
    };
    
    
    ns.Event.prototype = {
        
        /**
         * Returns the type of the event
         * 
         * @return      {String}
         */
        getType : function ()
        {
            return this.type;
        },
        
        /**
         * Returns the event data
         * 
         * @return      {Object}
         */
        getData : function ()
        {
            return this.data;
        },
        
        /**
         * Sets the event's additional data
         * 
         * @param       {Object}                data
         * @returns     {BrickGame.Event}       This event object
         */
        setData : function (data)
        {
            this.data = data;
            return this;
        },
        
        /**
         * Adds data to existing event's data
         * 
         * @param       {String}                paramName
         * @param       {Object}                paramValue
         * @returns     {BrickGame.Event}       This event object
         */
        addData : function (paramName, paramValue)
        {
            this.data[paramName] = paramValue;
            return this;
        },
        
        /**
         * Returns info if propagation is stopped for this event
         * 
         * @returns     {Boolean}
         */
        isPropagationStopped : function ()
        {
            return this.isStoppedPropagation;
        },
        
        /**
         * Stops the event propagation
         * 
         * @returns     {BrickGame.Event}       This event object
         */
        stopPropagation : function ()
        {
            this.isStoppedPropagation = true;
            return this;
        }
    };
    
    ns.Event.prototype.constructor = ns.Event;
    
    
    /**
     * Creates the Event Dispatcher object
     * 
     * @constructor
     * @returns         {undefined}
     */
    ns.EventDispatcher = function ()
    {
        this.listeners = {};
    };
    
    ns.EventDispatcher.prototype = {
        
        /**
         * Adds listener for events of given type
         * 
         * @param       {String}        type
         * @param       {Function}      callback        A function that takes three arguments:
         *                                              event (the dispatched event), eventData
         *                                              (the data Object asociated with the event)
         *                                              and the dispatcher instance itself
         *                                              
         * @return      {BrickGame.EventDispatcher}     This object
         */
        addEventListener : function (type, callback)
        {
            this.listeners[type] = this.listeners[type] || [];
            this.listeners[type].push(callback);
            
            return this;
        },
        
        
        /**
         * Adds listener for events of given type that will be run once and 
         * automatically unbound
         * 
         * @param       {String}        type
         * @param       {Function}      callback        A function that takes three arguments:
         *                                              event (the dispatched event), eventData
         *                                              (the data Object asociated with the event)
         *                                              and the dispatcher instance itself
         *                                              
         * @return      {BrickGame.EventDispatcher}     This object
         */
        addEventListenerOnce : function (type, callback)
        {
            var callbackWrapper = function (event, data, eventDispatcher) 
            {
                var args = Array.prototype.slice.call(arguments, 0);
                callback.apply(callback, args);
                eventDispatcher.removeEventListener(type, callbackWrapper);
            };
            
            return this;
        },
        
        
        /**
         * Removes all listeners of given type
         * 
         * @param       {String}                            type
         * @return      {BrickGame.EventDispatcher}         This object
         */
        removeEventListeners : function (type)
        {
            delete this.listeners[type];
            return this;
        },
        
        /**
         * Removes particular event listener from the poll for given type
         * 
         * @param       {String}                            type
         * @param       {Function}                          callback
         * @return      {BrickGame.EventDispatcher}         This object
         */
        removeEventListener : function (type, callback)
        {
            if (!!this.listeners[type]) {
                var listeners = this.listeners[type];
                for (var k = 0; k < listeners.length; k++) {
                    var listener = listeners[k];
                    if (listener === callback) {
                        listeners.splice(k, 1);
                    }
                }
            }
            
            return this;
        },
        
        
        /**
         * Dispatches event
         * 
         * @param       {ns.Event}                          event
         * @return      {BrickGame.EventDispatcher}         This object
         */
        dispatchEvent : function (event)
        {
            var type = event.getType();
            var data = event.getData();
            var listeners = this.listeners[type] || [];
            for (var i = 0; i < listeners.length; i++) {
                var listener = listeners[i];
                if (!event.isPropagationStopped()) {
                    listener.apply(listener, [
                        event,
                        data,
                        this
                    ]);
                }
            }
            
            return this;
        }
        
    };
    
    ns.EventDispatcher.prototype.constructor = ns.EventDispatcher;
    
    
    /**
     * Provides a single instance of the event dispatcher
     * 
     * @return          {BrickGame.EventDispatcher}
     */
    ns.EventDispatcher.getInstance = (function () {
        
        /**
         * 
         * @type ns.EventDispatcher
         */
        var instance = null;
        
        return function ()
        {
            if (instance === null) {
                instance = new ns.EventDispatcher();
            }
            
            return instance;
        };
    })();
    
})(BrickGame);