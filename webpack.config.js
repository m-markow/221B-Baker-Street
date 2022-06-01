module.exports = {
    entry: {
        board: './src/Board.js',
        player: './src/Player.js',
        clue: './src/Clue.js',
        game: './src/Game.js',
        forbiddenPositions: './src/data_tools/ForbiddenPositions.js',
        mapPartsManagement: './src/data_tools/MapPartsManagement.js'
    },
    output: {
        filename: './src/221b.bundle.js'
    }
};