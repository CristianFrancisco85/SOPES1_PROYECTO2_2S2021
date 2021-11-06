import { TableContainer,Table, TableHead,TableRow,TableCell, TableBody, Container, TextField, Button } from "@mui/material"
import { useState } from "react"
import { useMongoData, useTopPlayers } from "../globalContext"

const Single = () => { 

    const [player, setPlayer] = useState(0)
    const [mongodbData, setMongodbData] = useMongoData()

    const filterByPlayer = (array, player) => {
        return array.filter(obj => obj.player == player)
    }
    
    return(
        <Container style={{textAlign: "center",marginTop:"4em"}} >

            <TextField id="standard-basic" label="#Player" variant="standard" onChange={(e)=>setPlayer(e.target.value)} />

            <TableContainer>
            <h2>Real Time Stats for player #{player}</h2>
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
                    {filterByPlayer(mongodbData,player).map((game, index) => {
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

            
        </Container>
    )
}   

export default Single