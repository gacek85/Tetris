var BrickGame = BrickGame || {};
(function($, window, document, undefined) {
    
    'use strict';
    
    // Stage setup...
    
    var $target = $('[data-container]');
    var width = 16;
    var height = 30;
    
    // The event dispatcher is the central point of the application
    var eventDispatcher = BrickGame.EventDispatcher.getInstance();
    var matrixCreator = BrickGame.MatrixCreator.getInstance();
    var renderer = new BrickGame
            .StageRenderer($target.get(0), {
                width : width,
                height : height
            })
    ;
    
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
    eventDispatcher.addEventListener('score_changed', function (event) {
        var score = event.getData().score;
        var speed,
            level;
        switch(true) {
            case (score < 500):
                speed = 1000;
                level = 1;
                break;
            case (score < 1000):
                speed = 800;
                level = 2;
                break;
            case (score < 2000):
                speed = 600;
                level = 3;
                break;
            case (score < 4000):
                speed = 400;
                level = 4;
                break;
            case (score < 6000):
                speed = 300;
                level = 5;
                break;
            case (score < 8000):
                speed = 200;
                level = 6;
                break;
            case (score < 9000):
                speed = 1500;
                level = 7;
                break;
            case (score < 10000):
                speed = 100;
                level = 8;
                break;
            default:
                speed = 20;
                level = 9;
                break;
        }
        
        if ($levelTarget.text() !== String(level)) {
            $levelTarget.text(level); // Only update the speed if the level changes
            eventDispatcher.dispatchEvent(new BrickGame.Event('update_speed', {
                speed : speed
            }));
        }
    });
    
    new BrickGame.ScoreManager(eventDispatcher);
    
})(jQuery, window, window.document);