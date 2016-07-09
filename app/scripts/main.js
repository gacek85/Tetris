var BrickGame = BrickGame || {};
(function($, window, document, undefined) {
    
    'use strict';
    
    // Stage setup...
    
    var $target = $('[data-container]'),
        width = 16,
        height = 30,
        // The event dispatcher is the central point of the application
        eventDispatcher = BrickGame.EventDispatcher.getInstance(),
        matrixCreator = BrickGame.MatrixCreator.getInstance(),
        renderer = new BrickGame.StageRenderer($target.get(0), {
            width : width,
            height : height
        }),
        speeds = [
            {level: 1, speed : 1000, range : {from: 0, to: 499}},
            {level: 2, speed : 800, range : {from: 500, to: 999}},
            {level: 3, speed : 600, range : {from: 1000, to: 1999}},
            {level: 4, speed : 400, range : {from: 2000, to: 3999}},
            {level: 5, speed : 300, range : {from: 4000, to: 5999}},
            {level: 6, speed : 200, range : {from: 6000, to: 7999}},
            {level: 7, speed : 150, range : {from: 8000, to: 8999}},
            {level: 8, speed : 100, range : {from: 9000, to: 9999}},
            {level: 9, speed : 20, range : {from: 10000, to: Infinity}}
        ],
        speedManager = new BrickGame.SpeedManager(eventDispatcher);
    ;
    
    for (var t in speeds) {
        var speedInput = speeds[t],
            speedProvider = new BrickGame.SpeedProvider(
                                            speedInput.range, 
                                            speedInput.speed, 
                                            speedInput.level
            );
            speedManager.addSpeedProvider(speedProvider);
        ;
    }
    
    renderer
            .setMatrixCreator(matrixCreator)
            .setEventDispatcher(eventDispatcher)
    ;
    
    var movesController = new BrickGame.MovesController(eventDispatcher);
    var linesDetector = new BrickGame.LineDetector(eventDispatcher);
    
    for (var providerName in BrickGame.OnKeyCoordsProviders) {
        if (providerName !== 'ProvidersPrototype') {
            var ProviderFn = BrickGame.OnKeyCoordsProviders[providerName];
            
            if (typeof ProviderFn === 'function') {
                var provider = new ProviderFn();
                movesController.registerOnKeyCoordsProvider(provider);
            }
        }
    }
    
    var collisionsDetector = new BrickGame.CollisionsDetector(matrixCreator);
    
    var positionManager = new BrickGame.PositionManager(
        matrixCreator,
        matrixCreator.createEmpty(width, height),
        BrickGame.ShapeGenerator.getDefaultInstance(),
        eventDispatcher,
        collisionsDetector.setEventDispatcher(eventDispatcher),
        renderer,
        new BrickGame.MatrixTransformer(matrixCreator),
        linesDetector,
        {}
    );
    
    positionManager.init();
    
    
    var $scoreTarget = $('[data-score]');
    eventDispatcher.addEventListener('score_changed', function (event) {
        var score = event.getData().score;
        $scoreTarget.text(score);
    });
    
    var $levelTarget = $('[data-level]');
    eventDispatcher.addEventListener('level_updated', function (event) {
        var data = event.getData(),
            speed = data.speed,
            level = data.level
        ;
        
        
        if ($levelTarget.text() !== String(level)) {
            $levelTarget.text(level); // Only update the speed if the level changes
            eventDispatcher.dispatchEvent(new BrickGame.Event('update_speed', {
                speed : speed
            }));
        }
    });
    
    new BrickGame.ScoreManager(eventDispatcher);
    
})(jQuery, window, window.document);