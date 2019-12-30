let canvas, board;

const CANVAS_SCALE=4;
const GRID_SCALEX=6, GRID_SCALEY=-6, GRID_OFFSETX=200, GRID_OFFSETY=200;
const SOLDIER_RADIUS=3;

let boardSize = parseInt(Math.min(window.innerHeight*0.75,window.innerWidth*0.5));
const BACKGROUND_COLOR = 'rgba(190,190,190,0.1)', 
      DEFAULT_COLOR = 'white', SELECT_COLOR = 'orange', LOCKED_COLOR = 'red',
      JUMP_COLOR = 'rgba(18,208,56,0.2)', KILL_COLOR = 'rgba(200,200,200,1)';

// game state variables
let selectR = 0, selectC = 0;
let jumpR, jumpC;
let selectLocked;

// general utility functions
function isDefined(x) {
  return typeof(x) !== "undefined";
}

// draw soldier coin/token at row r and column c
function draw_soldier(r, c) {
  ellipse(c*GRID_SCALEX, r*GRID_SCALEY, SOLDIER_RADIUS);
}

// check if the mouse is close to a soldier
function check_soldier(r, c) {
  let cx = c*GRID_SCALEX, cy = r*GRID_SCALEY;
  let mx = (mouseX-GRID_OFFSETX)/CANVAS_SCALE,
      my = (mouseY-GRID_OFFSETY)/CANVAS_SCALE;
  return (mx - cx)**2 + (my - cy)**2 <= 2*SOLDIER_RADIUS**2;
}

function getInput(name) {
  return parseInt(document.getElementsByName(name)[0].value);
}

function init() {
  let nrows = getInput("nrows"), ncols = getInput("ncols");
  board = new Board(nrows, ncols);
  canvas.elt.focus();
}

function setup() {
  canvas = createCanvas(boardSize,boardSize);
  canvas.parent('sketch');
  init();
}

function draw() {
  background(190, 190, 190, 20);
  translate(GRID_OFFSETX, GRID_OFFSETY);
  scale(CANVAS_SCALE);
  fill(DEFAULT_COLOR);
  for (let [r,c] of board.get_all()) {
    draw_soldier(r,c);
  }
  if (selectLocked) {
    fill(LOCKED_COLOR);
    draw_soldier(selectR, selectC);
    if (isDefined(jumpR) && isDefined(jumpC)) {
      fill(KILL_COLOR);
      draw_soldier(selectR + jumpR, selectC + jumpC);
      stroke(150);
      fill(JUMP_COLOR);
      draw_soldier(selectR + 2*jumpR, selectC + 2*jumpC);
      stroke(0);
    }
  } else {
    fill(SELECT_COLOR);
    draw_soldier(selectR, selectC);
  }
}

function mouseMoved() {
  cursor(ARROW);
  jumpR = jumpC = undefined;
  if (!selectLocked) {
    for (let [r,c] of board.get_all()) {
      if (check_soldier(r,c)) {
        selectR = r;
        selectC = c;
        cursor(HAND);
        break;
      }
    }
  } else {
    for (let [dr, dc] of board.possible_moves(selectR, selectC)) {
      let jr = selectR + 2*dr, jc = selectC + 2*dc;
      if (check_soldier(jr, jc) || check_soldier(jr-dr, jc-dc)) {
        jumpR = dr;
        jumpC = dc;
        cursor(HAND);
        break;
      }
    }
  }
}

function mouseClicked() {
  if (selectLocked && isDefined(jumpR) && isDefined(jumpC)) {
      board.move(selectR, selectC, jumpR, jumpC);
      selectR += 2*jumpR;
      selectC += 2*jumpC;
      jumpR = jumpC = undefined;
  }
  selectLocked = !selectLocked;
}