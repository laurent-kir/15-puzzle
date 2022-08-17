(function() {
  'use strict';

  function getItems(len) {
    var items = [];
    while (items.push(items.length + 1) < len);
    return items;
  }

  var puzzle = {
    __init__: function() {
      this.setImagePos();
      this.onKeyDown = this.onKeyDown.bind(this);
      this.target.innerHTML = this.cells.map(function(x) {
        return '<div data-id="' + x + '"></div>';
      }).join('');

      !this.isSolvable && this.swap(0, 1);
      window.addEventListener('keydown', this.onKeyDown);
      window.focus();
    },
    counter: 0,
    hole: 15,
    startTime: Date.now(),
    target: document.getElementById('puzzle'),
    directions: {up: -4, down: 4, left: -1, right: 1},
    keys: {39: 'left', 37: 'right', 40: 'up', 38: 'down'},
    token: getItems(15).concat(0).join(''),
    cells: getItems(15).sort(function() { return Math.random() - 0.5; }).concat(0),
    get isCompleted() { return this.cells.join('') === this.token; },
    get isSolvable() {
      var cells = this.cells;
      var len = cells.length - 1;

      for (var x = 0, i = 1; i < len; i++) {
        for (var j = i - 1; j >= 0; j--) cells[j] > cells[i] && x++;
      }

      return !(x % 2);
    },
    onKeyDown: function(e) {
      var key = this.keys[e.keyCode];
      this.go(this.directions[key]);
    },
    go: function(step) {
      var ind = step + this.hole;

      if (!this.cells[ind]) return;
      if ((step & 1) === 1 && ~~(this.hole / 4) !== ~~(ind / 4)) return;

      this.swap(ind, this.hole);
      this.hole = ind;
    },
    swap: function(a, b) {
      this.cells[a] = this.cells[b] + (this.cells[b] = this.cells[a]) * 0;
      this.draw(a, b);
    },
    draw: function(a, b) {
      this.counter++;
      this.target.children[a].setAttribute('data-id', this.cells[a]);
      this.target.children[b].setAttribute('data-id', this.cells[b]);
      this.isCompleted && this.success(Date.now() - this.startTime);
    },
    success: function(time) {
      var min = time / 60000 >> 0;
      var sec = (time / 1000 >> 0) % 60;
      var text = 'Всего ходов: ' + this.counter + '\nВремени затрачено: ' + min +
      ' мин. и ' + sec + ' сек.';

      window.removeEventListener('keydown', this.onKeyDown);
      setTimeout(alert.bind(null, text), 200);
    },
    setImagePos: function() {
      function perc(n) {
        return n === 3 ? 100 : 33.333 * n;
      }

      var style = document.head.appendChild(document.createElement('style'));
      style.textContent = getItems(15).map(function(x, i) {
        return '[data-id="' + x + '"] {background-position: ' + perc(i % 4) + '% ' +
        perc(i / 4 >> 0) + '%}';
      }).join('\n');
    }
  };

  puzzle.__init__();
})();