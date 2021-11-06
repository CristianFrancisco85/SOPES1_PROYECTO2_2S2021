import { Grid, TableContainer,Table, TableHead,TableRow,TableCell, TableBody, Container } from "@mui/material"
import { Box } from "@mui/system"
import {Doughnut} from 'react-chartjs-2'
import { useLogs, useMongoData, useTopGames,useTopWorkers } from "../globalContext"

const Logs = () => { 

    const [topGames, setTopGames] = useTopGames()
    const [topWorkers, setTopWorkers] = useTopWorkers()
    const [mongodbData, setMongodbData] = useMongoData()
    const [logs, setLogs] = useLogs()

    const lastTen = (array) => {
        return array.slice(Math.max(array.length - 10, 1))
    }
    
    return(
        <Container style={{textAlign: "center",marginTop:"4em"}} >

            <TableContainer sx={{ maxHeight: 600 }}>
            <h2>Datos de MongoDB</h2>
            <h6>from MongoDB</h6>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell align="center"><b>Juego</b></TableCell>
                        <TableCell align="center"><b>Ganador</b></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {mongodbData.map((game, index) => {
                        return(
                            <TableRow key={index}>
                                <TableCell align="center">{game.game}</TableCell>
                                <TableCell align="center">Jugador {game.player}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
            </TableContainer>

            <TableContainer sx={{ maxHeight: 600 }}>
            <h2>Logs de MongoDB</h2>
            <h6>from MongoDB</h6>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell align="center"><b>No.</b></TableCell>
                        <TableCell align="center"><b>Juego</b></TableCell>
                        <TableCell align="center"><b>Ganador</b></TableCell>
                        <TableCell align="center"><b>Worker</b></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {logs.map((game, index) => {
                        return(
                            <TableRow key={index}>
                                <TableCell align="center">{index}</TableCell>
                                <TableCell align="center">{game.game}</TableCell>
                                <TableCell align="center">Jugador {game.player}</TableCell>
                                <TableCell align="center">{game.worker}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
            </TableContainer>

            <Grid container spacing={2} style={{marginTop:"4em",alignContent:"center",alignItems:"center",alignSelf:"center"}}>
            
            <Grid item xs={8}>
                
            <Box sx={{maxWidth:"20em"}}>
            <h3>Top Games</h3>
            <h6>from Redis</h6>
            <Doughnut data={{
                labels: [...topGames.filter((item,index)=>index%2===0)],
                datasets: [{
                    label: 'Top HashTags',
                    data: [...topGames.filter((item,index)=>index%2!=0)],
                    backgroundColor: [
                    'rgb(227, 20, 20)',
                    'rgb(54, 162, 235)',
                    'rgb(128, 58, 181)',
                    'rgb(43, 224, 76)',
                    'rgb(242, 171, 48)'
                    ],
                    hoverOffset: 4
                }]
                }
            }>
            </Doughnut>
            </Box>

            </Grid>

            <Box sx={{maxWidth:"20em"}}>
            <h3>Top Workers</h3>
            <h6>from Redis</h6>
            <Doughnut data={{
                labels: [...topWorkers.filter((item,index)=>index%2===0)],
                datasets: [{
                    label: 'Top HashTags',
                    data: [...topWorkers.filter((item,index)=>index%2!=0)],
                    backgroundColor: [
                    'rgb(242, 171, 48)',
                    'rgb(43, 224, 76)',
                    'rgb(128, 58, 181)',
                    'rgb(54, 162, 235)',
                    'rgb(227, 20, 20)'
                    ],
                    hoverOffset: 4
                }]
                }
            }>
            </Doughnut>
            </Box>
            
            </Grid>
        </Container>
    )
}   

export default Logs