import { Paper, TableContainer,Table, TableHead,TableRow,TableCell, TableBody, Container } from "@mui/material"
import { useTopPlayers } from "../globalContext"

const Home = () => { 

    const [topPlayers, setTopPlayers] = useTopPlayers()

    const normalizeArray = (vector) => {
        let array = []
        for (let i = 0; i < vector.length; i += 2) {
            array.push([vector[i],vector[i+1]])
        }
        return array
    }
    
    return(
        <Container style={{textAlign: "center",marginTop:"4em"}} >

            <TableContainer>
            <h2>Ultimos 10 Juegos</h2>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align="center">No.</TableCell>
                        <TableCell align="center">Juego</TableCell>
                        <TableCell align="center">Ganador</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell align="center">1</TableCell>
                        <TableCell align="center">Juego 1</TableCell>
                        <TableCell align="center">Jugador 1</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            </TableContainer>

            <TableContainer>
            <h2>Top 10 Jugadores</h2>
            <Table >
                <TableHead>
                    <TableRow>
                        <TableCell align="center">Jugador</TableCell>
                        <TableCell align="center">Juegos Ganados</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {normalizeArray(topPlayers).map((player, index) => (
                        <TableRow key={index}>
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