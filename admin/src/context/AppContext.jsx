import { createContext } from "react"

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL  // ← add this

    const currencySymbol = '$'

    const calculateAge = (dob) => {
        if (!dob || dob === 'Not Specified') return 'N/A'
        const today = new Date()
        const birthDate = new Date(dob)
        if (isNaN(birthDate)) return 'N/A'
        let age = today.getFullYear() - birthDate.getFullYear()
        return age
    }

    const value = {
        backendUrl,         
        currencySymbol,
        calculateAge,
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider