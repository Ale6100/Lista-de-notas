export interface ItemsTypes {
    itemId: string,
    text: string
}

export interface UpdateNoteType extends NoteType {
    id: string
}

export interface NoteType {
    idUser: string,
    title: string,
    items: ItemsTypes[]
    timestamp: number
}
