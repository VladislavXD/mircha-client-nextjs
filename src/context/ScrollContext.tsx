import { createContext, useContext, RefObject } from "react"

export const ScrollContext = createContext<RefObject<HTMLDivElement | null>>({ current: null })

export const useScrollRef = () => useContext(ScrollContext)
