var BrickGame = BrickGame || {};
(function($, window, document, undefined) {
    
    'use strict';
    
    var width = 6;
    var height = 6;

    // Next block box setup...
    var eventDispatcher = BrickGame.EventDispatcher.getInstance();
    var matrixCreator = BrickGame.MatrixCreator.getInstance();
    
    var $nextBlockTarget = $('[data-next]');
    var nextBlockRenderer = new BrickGame
            .StageRenderer($nextBlockTarget.get(0), {
                width : width,
                height : height
            })
    ;
    
    nextBlockRenderer
            .setMatrixCreator(matrixCreator)
            .setEventDispatcher(eventDispatcher)
            .init()
    ;
    
    /**
     * Normalizes brick block matrix to match the height and width of the
     * defined next item block matrix
     * 
     * @param       {BrickGame.Matrix}      matrix
     * @param       {Number}                width
     * @param       {Number}                height
     * @returns     {BrickGame.Matrix}
     */
    function normalizeBlockMatrix (matrix, width, height)
    {
        var offsetX = parseInt((width - matrix.getWidth()) / 2);
        var offsetY = parseInt((height - matrix.getHeight()) / 2);
        
        var newMatrix = matrixCreator.createEmpty(width, height);
        
        return matrixCreator.createCombined(newMatrix, matrix, {
            offsetX : offsetX,
            offsetY : offsetY
        });
    }
    
    eventDispatcher.addEventListener('new_block_generated', function (event) {
        var normalizedMatrix = normalizeBlockMatrix(
            event.getData().matrix,
            width,
            height
        );
        nextBlockRenderer.redraw(normalizedMatrix);
    });
    
})(jQuery, window, window.document);