export interface ItemsTypes {
    itemId: string,
    text: string
}

export interface UpdateNoteType extends NoteType {
    id: string
}

export interface NoteType {
    title: string,
    items: ItemsTypes[]
}
