import { createContext,useContext } from 'react';

export const GlobalContext = createContext({});

export const useMongoData = () => {
    const dataGlobalState = useContext(GlobalContext)
    return dataGlobalState.MongoData
}

export const useLastGames = () => {
    const dataGlobalState = useContext(GlobalContext)
    return dataGlobalState.LastGames
}

export const useTopPlayers = () => {
    const dataGlobalState = useContext(GlobalContext)
    return dataGlobalState.TopPlayers
}

export const useLogs = () => {
    const dataGlobalState = useContext(GlobalContext)
    return dataGlobalState.Logs
}

export const useTopGames = () => {
    const dataGlobalState = useContext(GlobalContext)
    return dataGlobalState.TopGames
}

export const useTopWorkers = () => {
    const dataGlobalState = useContext(GlobalContext)
    return dataGlobalState.TopWorkers
}
