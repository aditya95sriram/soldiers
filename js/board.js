directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

class Board {
  
  constructor(nrows, ncols) {
    this.rows = new Map();
    let fullrow = new Set();
    for (let j=-ncols; j<=ncols; j++) fullrow.add(j);
    for (let i=0; i<nrows; i++) this.rows.set(-i, new Set(fullrow));
  }
  
  // is there a soldier at row r, column c
  has(r, c) {
    return this.rows.has(r) && this.rows.get(r).has(c);
  }
  
  // return all possible moves for a soldier
  possible_moves(r, c) {
    let moves = [];
    if (!this.has(r,c)) return moves;
    for (let [dr, dc] of directions) {
      if (this.has(r+dr, c+dc) && !this.has(r+2*dr, c+2*dc))
        moves.push([dr, dc]);
    }
    return moves;
  }
  
  // remove a soldier
  remove(r, c) {
    this.rows.get(r).delete(c);
  }
  
  // place a soldier [adds a new row if needed]
  place(r, c) {
    if (this.rows.has(r)) {
      this.rows.get(r).add(c);
    } else {
      this.rows.set(r, new Set([c]));
    }
  }
  
  // performs a leapfrog move for a soldier in the given direction
  move(r, c, dr, dc) {
    this.remove(r+dr, c+dc);       // kill middle soldier
    this.remove(r, c);             // soldier hop start
    this.place(r+2*dr, c+2*dc);    // soldier hop end
  }

  // get all the soldiers on the board
  get_all() {
    let all = [];
    for (let [rowid, row] of this.rows) {
      for (let colid of row) {
        all.push([rowid, colid]);
      }
    }
    return all;
  }
  
  // print the positions of all the soldiers
  debug() {
    console.log(this.get_all().map(x => `${x}`).join("; "));
  }  
  
}