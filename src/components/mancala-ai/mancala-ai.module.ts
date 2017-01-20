///<reference path="mancala-ai.service.ts"/>

angular.module('app.components.mancala-ai', [])
    .service('$mancalaAI', mancalaAIModule.MancalAIService);
