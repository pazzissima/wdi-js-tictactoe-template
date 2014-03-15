$(function() {

  //### 'jquery' UI elements for game manipulation
  //var game              =    // the game container
  //var board             =    // the board  container

  var game = $('#game');
  var board = $('#board')
  var status_indicators = $('#teams li');   // status bar container

  var tiles = [];                         // all the "tiles"

  var players = [                         // player data
    {
      name:      'Ernie',
      marker:    'X',
      img_url:   'img/ernie.jpg',
      indicator: $(status_indicators[0])
    },
    {
      name:      'Bert',
      marker:    '0',
      img_url:   'img/bert.jpg',
      indicator: $(status_indicators[1])
    }
  ];

  var current_player;                     // player data
  var turns  = 0;                         // elapsed turns

  //### There are eight winning combos, the first two are supplied.
  //### What are the other six? Add 'em.
  var win_combos = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];

  var initialize = function() {
    //### ready the board for game play

    //### 1.) Create nine tiles. Each is a div, each needs to be bound to 'handle_click'.
    //### Make sure giving each tile a unique 'id' for targeting. Find tile's 'class' in css.
    //### Append tiles to board.

    //### 2.) Make first player the current_player

    //### 3.) Set up the players 'indicators' in UI
    //### - set player image, name, marker
    //### - set player name
    //### - the 'current_player' has a different style (see css '.current')

    //### 4.) fade in the game
    _(9).times(function(i) {
      tiles.push(
         $('<div/>')
           .attr({'id':'tile'+i, 'class':'tile'})
           .on('click', handle_click)
           .appendTo(board));
    });
    current_player = _.first(players);
    var player_indicators = _.map(players, function(player) {
      return player.indicator
    });
    _.each(player_indicators, function(indicator, i) {
      var indicator = $(indicator);
      var player = players[i];
      $('.team', indicator).html(player.marker);
      $('.player', indicator).html(player.name);
      $('img', indicator).attr('src', player.img_url);
      if (player == current_player) {
        indicator.addClass('current');
      }
    });
    game.fadeIn();
  };

  var is_active = function(tile) {
    // boolean - evaluate whether or not is 'active'
    return tile.hasClass('active');
  };
  var activate_tile = function(tile) {
    // activate a tile and increment the turn counter
    tile.html(current_player.marker);
    tile.addClass('active');
    tile.data('player', current_player);
    turns++;
  };


  var toggle_player = function() {
    // toggle the current player and update related UI
    current_player = players[get_current_player_index()];
    status_indicators.removeClass('current');
    current_player.indicator.addClass('current');
  };

  var get_current_player_index = function() {
    // return the current player's index in the players array
    return turns % 2;
  };

  var get_board_data = function() {
    // return the current player's positions on the board
    var current_player_board_data = [];
    _.each(tiles, function(tile, i) {
      if (tile.data('player') == current_player) {
        current_player_board_data.push(i);
      }
    });
    return current_player_board_data;
  };

  var is_win = function() {
    // boolean - whether or not the current player's positions result in a win
    var board_data = get_board_data();
    var match_found = false;
    _.each(win_combos, function(combo) {
      if (_.intersection(combo, board_data).length == combo.length) {
        show_combo(combo);
        match_found = true;
      }
    });
    return match_found;
  };

  var is_tie = function() {
    // boolean - has the game resulted in a tie?
    return (turns == tiles.length);
  };

  var handle_win = function() {
    // update the UI to reflect that a win has occurred.
    _.each(tiles, function(tile) {
      tile.off('click');
    });
    update_results({
      img_src: current_player.img_url,
      img_alt: current_player.name,
      message: 'Congratulations, <span id="winner">'
        + current_player.name
        + '</span>!'
    });
  };

  var handle_tie = function() {
    // update the UI to reflect that a tie game has occurred.
    update_results({
      img_src: 'img/rubberduckie.jpg',
      img_alt: 'Rubber Duckie',
      message: 'Tie Game!'
    });
  }

  update_results = function(args) {
    /* call this to update the "results" container after detecting
       a win or a tie */

    var results   = $('#results');
    var winner_el = $('h1', results);
    var image_el  = $('.image', results);
    var button    = $('button', results);
    var image     = $('<img/>');
    var overlay   = $('#overlay');
    image.attr({
      src: args.img_src,
      alt: args.img_alt
    });
    image_el.html(image);
    winner_el.html(args.message);
    button.on('click', new_game);
    hide_indicators();
    setTimeout(function() {
      overlay.fadeIn(500);
      results.fadeIn(500);
    },1000);
  }

  var hide_indicators = function() {
    // call this to hide the "status" container after detecting a win or a tie
    status_indicators.animate({'opacity':0},2000);
  };

  var show_combo = function(combo) {
    // call this to highlight the combination of tiles that resulted in a win
    _.each(combo, function(tile_index) {
      tiles[tile_index].addClass('combo');
    });
  }

  var handle_click = function() {
    // this function is bound to a click event for each tile on the board
    var tile = $(this);
    if (is_active(tile)) {
      return false;
    }
    activate_tile(tile);
    if (is_win()) {
      handle_win();
      return false;
    }
    if (is_tie()) {
      handle_tie();
      return false;
    }
    toggle_player();
  }

  var new_game = function() {
    // refresh the page to begin a new game
    window.location.href = window.location.href
  };

  // call initialize() to get the party started
  initialize();

});
