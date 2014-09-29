var BrickGame = BrickGame || {};
(function(ns, undefined) {
    
    'use strict';
 
    /**
     * Creates the score manager object
     * 
     * @constructor
     * @param   {BrickGame.EventDispatcher}     eventDispatcher
     * @returns {undefined}
     */
    ns.ScoreManager = (function () {
        
        /**
         * Sets up the event listeners
         * 
         * @param {BrickGame.ScoreManager}      scoreManager
         * @param {BrickGame.EventDispatcher}   eventDispatcher
         */
        function setupListeners (scoreManager, eventDispatcher)
        {
            eventDispatcher.addEventListener('full_lines_found', function (event) {
                var count = event.getData().count;
                var score = scoreManager.getScoreByLinesCount(count);
                scoreManager.updateScore(score);
                
                eventDispatcher.dispatchEvent(new ns.Event('score_changed', {
                    score : scoreManager.getScore(),
                    scoreHistory : scoreManager.getScoreHistory()
                }));
            });
        }
        
        return function (eventDispatcher)
        {
            this.eventDispatcher = eventDispatcher;
            this.currentScore = 0;
            this.scoreHistory = [];
            setupListeners(this, this.eventDispatcher);
        };
    })();
    
    ns.ScoreManager.prototype = {
        
        /**
         * Returns a score numeric value for given number of lines
         * 
         * @param   {Number} count
         * @return  {Number}
         */
        getScoreByLinesCount : function (count)
        {
            return (10 * count) + (count - 1) * 5;
        },
        
        /**
         * Returns current score
         * 
         * @returns {Number}
         */
        getScore : function ()
        {
            return this.currentScore;
        },
        
        /**
         * Returns all scores in an array
         * 
         * @returns {Array}
         */
        getScoreHistory : function ()
        {
            return this.scoreHistory;
        },
        
        /**
         * Updates the score
         * 
         * @param       {Number}                        score
         * @return      {BrickGame.ScoreManager}        description
         */
        updateScore : function (score)
        {
            this.scoreHistory.push(score);
            this.currentScore += score;
            return this;
        }
       
    };
    
    ns.ScoreManager.prototype.constructor = ns.ScoreManager;
    
})(BrickGame);