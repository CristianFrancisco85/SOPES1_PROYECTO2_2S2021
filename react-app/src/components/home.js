import { TableContainer,Table, TableHead,TableRow,TableCell, TableBody, Container } from "@mui/material"
import { useMongoData, useTopPlayers } from "../globalContext"

const Home = () => { 

    const [topPlayers, setTopPlayers] = useTopPlayers()
    const [mongodbData, setMongodbData] = useMongoData()

    const normalizeArray = (vector) => {
        let array = []
        for (let i = 0; i < vector.length; i += 2) {
            array.push([vector[i],vector[i+1]])
        }
        return array
    }

    const getLastTen = (array) => {
        let lastTen = []
        for (let i = array.length - 1; i >= array.length - 10; i--) {
            if(array[i]){
                lastTen.push(array[i])
            }
            
        }
        return lastTen
    }
    
    return(
        <Container style={{textAlign: "center",marginTop:"4em"}} >

            <TableContainer>
            <h2>Ultimos 10 Juegos</h2>
            <h6>from MongoDB</h6>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell align="center"><b>No.</b></TableCell>
                        <TableCell align="center"><b>Juego</b></TableCell>
                        <TableCell align="center"><b>Ganador</b></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {getLastTen(mongodbData).map((game, index) => {
                        return(
                            <TableRow key={index}>
                                <TableCell align="center">{index+1}</TableCell>
                                <TableCell align="center">{game.game}</TableCell>
                                <TableCell align="center">Jugador {game.player}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
            </TableContainer>

            <TableContainer>
            <h2>Top 10 Jugadores</h2>
            <h6>from Redis</h6>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell align="center"><b>No.</b></TableCell>
                        <TableCell align="center"><b>Jugador</b></TableCell>
                        <TableCell align="center"><b>Juegos Ganados</b></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {normalizeArray(topPlayers).map((player, index) => (
                        <TableRow key={index}>
                            <TableCell align="center">{index+1}</TableCell>
                            <TableCell align="center">Jugador {player[0]}</TableCell>
                            <TableCell align="center">{player[1]}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </TableContainer>
            
        </Container>
    )
}   

export default Home