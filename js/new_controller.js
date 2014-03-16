var TicTacApp = angular.module("TicTacApp", ['ngSanitize']);
function TicTacController($scope, $sce) {

  var turns  = 0;                         // elapsed turns

  var win_combos = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];

  $scope.initialize = function() {
    $scope.result = {
      img_src: null,
      img_alt: null,
      message: null
    };

    $scope.tiles = [
      {id: 0, player: null, is_combo: false},
      {id: 1, player: null, is_combo: false},
      {id: 2, player: null, is_combo: false},
      {id: 3, player: null, is_combo: false},
      {id: 4, player: null, is_combo: false},
      {id: 5, player: null, is_combo: false},
      {id: 6, player: null, is_combo: false},
      {id: 7, player: null, is_combo: false},
      {id: 8, player: null, is_combo: false}
    ];

    $scope.players = [                         // player data
      {
        name:      'Ernie',
        marker:    $sce.trustAsHtml('&times;'),
        img_url:   'img/ernie.jpg'
      },
      {
        name:      'Bert',
        marker:    $sce.trustAsHtml('&oslash;'),
        img_url:   'img/bert.jpg'
      }
    ];

    $scope.current_player = _.first($scope.players);

    $('#game').fadeIn();
  };

  $scope.is_active = function(tile) {
    // boolean - evaluate whether or not is 'active'
    return tile.player != null;
  };
  $scope.activate_tile = function(tile) {
    // activate a tile and increment the turn counter
    tile.player = $scope.current_player;
    turns++;
  };


  $scope.toggle_player = function() {
    // toggle the current player and update related UI
    $scope.current_player = $scope.players[$scope.get_current_player_index()];
  };

  $scope.get_current_player_index = function() {
    // return the current player's index in the players array
    return turns % 2;
  };

  $scope.get_board_data = function() {
    // return the current player's positions on the board
    var current_player_board_data = [];
    _.each($scope.tiles, function(tile, i) {
      if (tile.player == $scope.current_player) {
        current_player_board_data.push(i);
      }
    });
    return current_player_board_data;
  };

  $scope.is_win = function() {
    // boolean - whether or not the current player's positions result in a win
    var board_data = $scope.get_board_data();

    var win_result = false;

    _.each(win_combos, function(combo) {
      if (_.intersection(combo, board_data).length == combo.length) {
        $scope.show_combo(combo);
        win_result = true;
      }
    });

    return win_result;
  };

  $scope.is_tie = function() {
    // boolean - has the game resulted in a tie?
    return (turns == $scope.tiles.length);
  };

  $scope.handle_win = function() {
    $scope.update_results({
      img_src: $scope.current_player.img_url,
      img_alt: $scope.current_player.name,
      message: 'Congratulations, <span id="winner">'
        + $scope.current_player.name
        + '</span>!'
    });
  };

  $scope.handle_tie = function() {
    $scope.update_results({
      img_src: 'img/rubberduckie.jpg',
      img_alt: 'Rubber Duckie',
      message: 'Tie Game!'
    });
  }

  $scope.update_results = function(args) {
    /* call this to update the "results" container after detecting
       a win or a tie */

    $scope.result = args;

    var results   = $('#results');
    var overlay   = $('#overlay');
    setTimeout(function() {
      overlay.fadeIn(500);
      results.fadeIn(500);
    }, 1000);
  }

  $scope.show_combo = function(combo) {
    // call this to highlight the combination of tiles that resulted in a win
    _.each(combo, function(tile_index) {
      $scope.tiles[tile_index].is_combo = true;
    });
  }

  $scope.handle_click = function(tile) {
    // this function is bound to a click event for each tile on the board
    if ($scope.is_active($scope.tiles[tile])) {
      return false;
    }
    $scope.activate_tile($scope.tiles[tile]);

    if ($scope.is_win()) {
      $scope.handle_win();
      return false;
    }

    if ($scope.is_tie()) {
      $scope.handle_tie();
      return false;
    }
    $scope.toggle_player();
  }

  $scope.new_game = function() {
    // refresh the page to begin a new game
    window.location.href = window.location.href
  };

  // call initialize() to get the party started
  $scope.initialize();

};

