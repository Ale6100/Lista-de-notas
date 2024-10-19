import { createContext, Dispatch, ReactNode, SetStateAction, useMemo, useState } from "react";
import { UserInterface } from "../types/user";

interface PersonalContextValue {
    user: UserInterface | null;
    setUser: Dispatch<SetStateAction<UserInterface | null>>;
}

const defaultPersonalContextValue: PersonalContextValue = {
    user: null,
    setUser: () => {},
};

export const PersonalContext = createContext<PersonalContextValue>(defaultPersonalContextValue);

interface PersonalContextProviderProps {
    children: ReactNode;
}

const PersonalContextProvider = ({ children }: PersonalContextProviderProps) => {
    const [ user, setUser ] = useState<UserInterface | null>(null); // Estado que representa al usuario actual

    const value = useMemo(() => ({
        user,
        setUser
    }), [user, setUser]);

    return (
        <PersonalContext.Provider value={value}>
            {children}
        </PersonalContext.Provider>
    );
}

export default PersonalContextProvider;
