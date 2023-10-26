export interface ItemsTypes {
    itemId: string,
    text: string
}

export interface NoteType {
    _id: string
    title: string,
    items: ItemsTypes[],
    timestamp: number
}
