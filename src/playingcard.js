(function() {
    var CardModel, CardView, DeckModel, DeckView, NAMESPACE, RANK, RANKS, SUIT, SUITS, Templates,
      __hasProp = {}.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
  
    Templates = (function() {
  
      function Templates() {}
  
      /*
        Returns HTML rendered using named template.
        IMPL: Templates are expected to be textual content of a DOM SCRIPT element
        which is retrieved by ID, compiled into a function, cached, and rendered
        on first-use. Subsequent access retrieves template rendering function from
        cache then rendered with template parameters.
      */
  
  
      Templates.prototype.compiledTemplates = [];
  
      Templates.prototype.get = function(name) {
        var elem, template, text;
        template = this.compiledTemplates[name];
        if (template) {
          return template;
        }
        elem = document.getElementById(name);
        if (elem) {
          text = $(elem).text();
        }
        if (text) {
          return this.compiledTemplates[name] = Hogan.compile(text);
        }
      };
  
      Templates.prototype.render = function(name, context) {
        var _ref;
        return (_ref = this.get(name)) != null ? _ref.render(context) : void 0;
      };
  
      return Templates;
  
    })();
  
    SUIT = {
      club: {
        name: 'club',
        symbol: '♣',
        color: 'black'
      },
      diamond: {
        name: 'diamond',
        symbol: '&diams;',
        color: 'red'
      },
      spade: {
        name: 'spade',
        symbol: '&spades;',
        color: 'black'
      },
      heart: {
        name: 'heart',
        symbol: '&hearts;',
        color: 'red'
      }
    };
  
    SUITS = [SUIT.club, SUIT.diamond, SUIT.spade, SUIT.heart];
  
    RANK = RANK = {
      ace: {
        name: 'ace',
        symbol: 'A'
      },
      two: {
        name: 'two',
        symbol: '2'
      },
      three: {
        name: 'three',
        symbol: '3'
      },
      four: {
        name: 'four',
        symbol: '4'
      },
      five: {
        name: 'five',
        symbol: '5'
      },
      six: {
        name: 'six',
        symbol: '6'
      },
      seven: {
        name: 'seven',
        symbol: '7'
      },
      eight: {
        name: 'eight',
        symbol: '8'
      },
      nine: {
        name: 'nine',
        symbol: '9'
      },
      ten: {
        name: 'ten',
        symbol: '10'
      },
      jack: {
        name: 'jack',
        symbol: 'J'
      },
      queen: {
        name: 'queen',
        symbol: 'Q'
      },
      king: {
        name: 'king',
        symbol: 'K'
      }
    };
  
    RANKS = RANKS = [RANK.ace, RANK.two, RANK.three, RANK.four, RANK.five, RANK.six, RANK.seven, RANK.eight, RANK.nine, RANK.ten, RANK.jack, RANK.queen, RANK.king];
  
    CardModel = (function(_super) {
  
      __extends(CardModel, _super);
  
      function CardModel() {
        return CardModel.__super__.constructor.apply(this, arguments);
      }
  
      CardModel.prototype.defaults = {
        front: false
      };
  
      return CardModel;
  
    })(Backbone.Model);
  
    CardView = (function(_super) {
  
      __extends(CardView, _super);
  
      function CardView() {
        return CardView.__super__.constructor.apply(this, arguments);
      }
  
      CardView.prototype.className = 'card';
  
      CardView.prototype.events = {
        'click': 'flip'
      };
  
      CardView.prototype.initialize = function() {};
  
      CardView.prototype.flip = function() {
        var _this = this;
        this.model.set('front', !(this.model.get('front')));
        return this.$el.flippy({
          content: this.content("<div />"),
          onStart: function() {
            return _this.$el.addClass('noshadow');
          },
          onFinish: function() {
            return _this.$el.removeClass('noshadow');
          }
        });
      };
  
      CardView.prototype.content = function(wrap) {
        var $content, $wrap, front, rank, suit;
        front = this.model.get('front');
        if (front) {
          rank = this.model.get('rank');
          suit = this.model.get('suit');
          $content = $(this.options.templates.render("card-" + rank.name, {
            rank: rank,
            suit: suit
          }));
          $content.addClass(suit.name);
        } else {
          $content = $(this.options.templates.render("card-back"));
        }
        if (wrap) {
          $wrap = $(wrap);
          $wrap.wrapInner($content);
          $content = $wrap;
        }
        return $content;
      };
  
      CardView.prototype.render = function() {
        this.$el.attr('id', this.cid);
        this.$el.empty();
        this.$el.append(this.content());
        return this;
      };
  
      return CardView;
  
    })(Backbone.View);
  
    DeckModel = (function(_super) {
  
      __extends(DeckModel, _super);
  
      function DeckModel() {
        return DeckModel.__super__.constructor.apply(this, arguments);
      }
  
      DeckModel.prototype.initialize = function(models, options) {
        var card, front, rank, suit, _i, _len, _results;
        front = options.front || false;
        _results = [];
        for (_i = 0, _len = SUITS.length; _i < _len; _i++) {
          suit = SUITS[_i];
          _results.push((function() {
            var _j, _len1, _results1;
            _results1 = [];
            for (_j = 0, _len1 = RANKS.length; _j < _len1; _j++) {
              rank = RANKS[_j];
              card = new CardModel({
                rank: rank,
                suit: suit,
                front: front
              });
              _results1.push(this.add(card));
            }
            return _results1;
          }).call(this));
        }
        return _results;
      };
  
      DeckModel.prototype.sort = function() {
        return this.models = _.sortBy(this.models, function(model) {
          var rank, rankOrder, suit, suitOrder;
          suit = model.get('suit');
          rank = model.get('rank');
          suitOrder = SUITS.indexOf(suit);
          rankOrder = RANKS.indexOf(rank);
          return suitOrder * 13 + rankOrder;
        });
      };
  
      DeckModel.prototype.shuffle = function() {
        return this.models = _.shuffle(this.models);
      };
  
      return DeckModel;
  
    })(Backbone.Collection);
  
    DeckView = (function(_super) {
  
      __extends(DeckView, _super);
  
      function DeckView() {
        return DeckView.__super__.constructor.apply(this, arguments);
      }
  
      DeckView.prototype.setCardWidth = function(pixels) {
        var fontsize;
        fontsize = pixels * 12.5 / 200;
        return this.$el.css({
          'font-size': "" + fontsize + "px"
        });
      };
  
      DeckView.prototype.sort = function() {
        this.model.sort();
        this.clear();
        return this.render();
      };
  
      DeckView.prototype.shuffle = function() {
        this.model.shuffle();
        this.clear();
        return this.render();
      };
  
      DeckView.prototype.render = function() {
        var _this = this;
        this.$el.empty();
        this.model.each(function(cardModel) {
          var cardView;
          cardView = new CardView({
            model: cardModel,
            className: "card",
            templates: _this.options.templates
          });
          return _this.$el.append(cardView.render().$el);
        });
        return this;
      };
  
      DeckView.prototype.clear = function() {
        this.$el.empty();
        return this;
      };
  
      return DeckView;
  
    })(Backbone.View);
  
    NAMESPACE = typeof window !== "undefined" && window !== null ? window : this;
  
    NAMESPACE.PlayingCards = {
      RANK: RANK,
      SUIT: SUIT,
      RANKS: RANKS,
      SUITS: SUITS,
      CardModel: CardModel,
      CardView: CardView,
      DeckModel: DeckModel,
      DeckView: DeckView,
      Templates: Templates
    };
  
  }).call(this);