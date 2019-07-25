import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

  function Square(props){
      return (
          <button
          className={props.className}
          onClick={props.onClick}
          >
          {props.value}
          </button>
      );
  }
  
  class Board extends React.Component {

    renderSquare(i) {
      return (<Square 
      value={this.props.squares[i]} 
      onClick={() => this.props.onClick(i)}
      className={(this.props.winner && this.props.winner.indexOf(i) !== -1)? 'square winner' : 'square'}
      />);
    }

    renderRow(i){
        let row = [];
            for(let j = 0; j < 3; j++){
                row.push(this.renderSquare(i*3+j));
            }
        return row;
    }

    renderGrid(){
        let grid = [];
        for(let i = 0; i < 3; i++){
            grid.push(<div className="board-row">{this.renderRow(i)}</div>);
        }
        return grid;
    }

   
    render() {
      return (
        <div>
         {this.renderGrid()}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                col: null,
                row: null,
            }],
            stepNumber: 0,
            ascending: true,
            xIsNext: true,
        };
    }

    handleClick(i){
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length-1];
        let squares = current.squares.slice();
        if(calculateWinner(squares)){
            return;
        }
        else if(squares[i] !== null){
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                col: parseInt(i/3),
                row: i%3
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step){
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    toggle(){
        this.setState({ascending: !this.state.ascending});
    }
  
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = 
            move === this.state.stepNumber ? 
            <b>Go to move # {move} </b>:
            move ?
            'Go to move #' + move :
            'Go to game start';

            return (
                <li key = {move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                    <span><b>{move ? 'Col:': ''} </b>{step.col}  <b>{move ? 'Row:': ''}</b> {step.row}</span>
                </li>
            );
        })

        let status;

        if(this.state.stepNumber !== 9 && !winner){
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        else if(winner){
            status = 'Winner: ' + current.squares[winner[0]];
        }
        else{
            status = 'Both winners'
        }

      return (
        <div className="game">
          <div className="game-board">
            <Board 
            squares = {current.squares} 
            onClick = {(i) => this.handleClick(i)}
            winner = {winner}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <button onClick={() => this.toggle()}>Toggle Order</button>
            <ol>{this.state.ascending ? moves: moves.reverse()}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );

  function calculateWinner(squares){
      const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];

      for(let i = 0; i < lines.length; i++){
          let winner = squares[lines[i][0]];
          if(winner && winner === squares[lines[i][1]] && winner === squares[lines[i][2]]){
              return lines[i];
          }
      }
      return null;
  }
  