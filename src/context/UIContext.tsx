import { RefObject, createContext, useContext, useRef } from "react"

interface UIContextType {
  scrollRef: RefObject<HTMLDivElement | null>
}

const UIContext = createContext<UIContextType>({
  scrollRef: { current: null }
})


export function UIProvider({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <UIContext.Provider value={{ scrollRef }}>
      {children}
    </UIContext.Provider>
  )
}
  
export const useUI = () => useContext(UIContext)