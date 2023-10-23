import React, { createContext, useState } from "react";
import { UserInterface } from "../types/user";

interface PersonalContextValue {
    user: UserInterface | null;
    setUser: React.Dispatch<React.SetStateAction<UserInterface | null>>;
}

export const PersonalContext = createContext<PersonalContextValue | undefined>(undefined);

interface PersonalContextProviderProps {
    children: React.ReactNode;
}

const PersonalContextProvider = ({ children }: PersonalContextProviderProps) => {
    const [ user, setUser ] = useState<UserInterface | null>(null); // Estado que representa al usuario actual

    return (
        <PersonalContext.Provider value={{ user, setUser }}>
            {children}
        </PersonalContext.Provider>
    );
}

export default PersonalContextProvider;
