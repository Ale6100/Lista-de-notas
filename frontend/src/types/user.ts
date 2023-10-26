export interface UserInterface {
    _id: string;
    username: string;
    orderCategories: "alphabetic" | "reverse alphabetic" | "more items" | "less items" | "date" | "reverse date";
}
