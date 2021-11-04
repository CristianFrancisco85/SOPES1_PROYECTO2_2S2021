import { Grid, TableContainer,Table, TableHead,TableRow,TableCell, TableBody, Container } from "@mui/material"
import { Box } from "@mui/system"
import {Doughnut} from 'react-chartjs-2'
import { useTopGames,useTopWorkers } from "../globalContext"

const Logs = () => { 

    const [topGames, setTopGames] = useTopGames()
    const [topWorkers, setTopWorkers] = useTopWorkers();
    
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

            <Grid container spacing={2} style={{marginTop:"4em",alignContent:"center",alignItems:"center",alignSelf:"center"}}>
            
            <Box sx={{maxWidth:"20em"}}>
            <h3>Top Games</h3>
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

            <Box sx={{maxWidth:"20em"}}>
            <h3>Top Workers</h3>
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