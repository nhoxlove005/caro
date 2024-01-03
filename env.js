var board;
var rows = 15;
var columns = 15;
var center_row = Math.floor(rows / 2);
var center_column = Math.floor(columns / 2);
var center = [center_row, center_column]
var up_left = [center_row - 3, center_column - 3];
var up_right = [center_row - 3, center_column + 3];
var down_left = [center_row + 3, center_column - 3];
var down_right = [center_row + 3, center_column + 3];
var lastMove = null;
var game = {player: 1, state: get_initial_state()};

window.onload = function(){
    environments();
    table_board();
};

function player(action) {
    game.state = get_next_state(game.state, action, game.player);
    let [value, terminated] = get_value_and_terminated(game.state, action);
    if (terminated) {
        if (value === 1) {
            alert('You win!');
        } else {
            alert('Draw!');
        }
        return;
    }
    get_opponent();
}

function get_initial_state() {
    return new Array(rows).fill(0).map(() => new Array(columns).fill(0));
}

function get_next_state(state, action, player) {
    let row = Math.floor(action / columns);
    let column = action % columns;
    state[row][column] = player;
    return state;
}

function get_valid_moves(state) {
    let flattened = state.flat();
    return flattened.map(value => value === 0 ? 1 : 0);
}

function check_winner(state, action) {
    if (action == null) {
        return false;
    }

    let row = Math.floor(action / columns);
    let column = action % columns;
    let player = state[row][column];

    function checkConsecutive(array) {
        let count = 0;
        for (let i = 0; i < array.length; i++) {
          if (array[i] === player) {
            count++;
            if (count === 5) return true;
          } else {
            count = 0;
          }
        }
        return false;
      }
    
      // Check row
      if (checkConsecutive(state[row])) {
        return true;
      }
    
      // Check column
      let columnArray = [];
      for (let i = 0; i < rows; i++) {
        columnArray.push(state[i][column]);
      }
      if (checkConsecutive(columnArray)) {
        return true;
      }
    
      // Check main diagonal
      let mainDiagonalArray = [];
      let startRow = row - Math.min(row, column);
      let startColumn = column - Math.min(row, column);
      for (let i = 0; i < Math.min(rows - startRow, columns - startColumn); i++) {
        mainDiagonalArray.push(state[startRow + i][startColumn + i]);
      }
      if (checkConsecutive(mainDiagonalArray)) {
        return true;
      }
    
      // Check secondary diagonal
      let secondaryDiagonalArray = [];
      let startRow2 = row - Math.min(row, columns - column - 1);
      let startColumn2 = column + Math.min(row, columns - column - 1);
      for (let i = 0; i < Math.min(rows - startRow2, startColumn2 + 1); i++) {
        secondaryDiagonalArray.push(state[startRow2 + i][startColumn2 - i]);
      }
      if (checkConsecutive(secondaryDiagonalArray)) {
        return true;
      }
    
      return false;
    }

function get_value_and_terminated(state, action) {
    if (check_winner(state, action)) {
        return [1, true];
    }
    if (get_valid_moves(state).every(value => value === 0)) {
        return [0, true];
    }
    return [0, false];
}

function get_opponent() {
    game.player = -game.player;
}

function environments(){
    const table_background = document.querySelector('.table-background');

    for (let i = 0; i < rows + 1; i++) {
        const row = document.createElement('tr');
        row.classList.add('ng-star-inserted');
        for (let j = 0; j < columns + 1; j++) {
            const cell = document.createElement('td');
            cell.classList.add('ng-star-inserted');
            cell.innerHTML= '&nbsp;';
            cell.style.color = '#2c3e50';
            cell.style.borderBottom = '1px solid #2c3e50';
            cell.style.borderImage = 'none 100% 1 0 stretch';
            cell.style.borderLeft = '1px solid #2c3e50';
            cell.style.borderRight = '1px solid #2c3e50';
            cell.style.borderTop = '1px solid #2c3e50';
            cell.style.cursor = 'auto';
            row.appendChild(cell);
        }
    table_background.appendChild(row);
    }
}

function table_board() {
    const table_board = document.querySelector('.table-board');
    const specialCells = [center, up_left, up_right, down_left, down_right].map(e => e.toString());

    for (let i = 0; i < rows; i++) {
        const row = document.createElement('tr');
        row.classList.add('ng-star-inserted');

        for (let j = 0; j < columns; j++) {
            const svg = createSvgElement('svg', { viewBox: '0 0 100 100' });
            const circle = createSvgElement('circle', { cx: '50', cy: '50', r: '50' });
            const last_move = createSvgElement('circle', { cx: '50', cy: '50', r: '7' });

            const cell = document.createElement('td');
            cell.classList.add('cell' + '-' + i + '-' + j, 'ng-star-inserted', 'clickable');

            if (specialCells.includes([i, j].toString())) {
                svg.classList.add('intersection');
                svg.appendChild(circle);
                cell.appendChild(svg);
            }
            cell.addEventListener('mouseover', function() {
                if (cell.classList.contains('clickable')) {
                    const svgElement = cell.querySelector('svg');
                if (svgElement) {
                    svg.removeChild(circle);
                    svg.classList.remove('intersection');
                    cell.removeChild(svg);
                }
        
                circle.classList.add(game.player == 1 ? 'circle-light' : 'circle-dark');
                svg.appendChild(circle);
                svg.classList.add('animated');
                cell.appendChild(svg);
                }
            });
            cell.addEventListener('mouseout', function() {
                if (cell.classList.contains('clickable')) {
                    circle.classList.remove(game.player == 1 ? 'circle-light' : 'circle-dark');
                svg.removeChild(circle);
                svg.classList.remove('animated');
                cell.removeChild(svg);

                if (specialCells.includes([i, j].toString())) {
                    svg.classList.add('intersection');
                    svg.appendChild(circle);
                    cell.appendChild(svg);
                }
                }
            });
            clicked(svg, circle, last_move, cell);
            
            row.appendChild(cell);
        }

        table_board.appendChild(row);
    }
}

function createSvgElement(type, attributes) {
    const element = document.createElementNS('http://www.w3.org/2000/svg', type);
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
    return element;
}

function clicked(svg, circle, last_move, cell) {
    cell.addEventListener('click', function() {
        parts = cell.classList[0].split('-');
        let row = parseInt(parts[1]);
        let column = parseInt(parts[2]);
        if (!cell.classList.contains('clickable')) {
            return;
        }

        const svgElement = cell.querySelector('svg');
        if (svgElement) {
            svg.removeChild(circle);
            svg.classList.remove('intersection');
            cell.removeChild(svg);
        }

        cell.classList.remove('clickable');
        circle.classList.add(game.player == 1 ? 'circle-light' : 'circle-dark');
        svg.appendChild(circle);
        svg.appendChild(last_move);
        svg.classList.add('animated');
        cell.appendChild(svg);

        if (lastMove) {
            lastMove.parentNode.removeChild(lastMove);
        }

        lastMove = last_move;
        let action = row * columns + column; 
        player(action);
    });
}