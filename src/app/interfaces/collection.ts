export interface Collection {
    id?:number
    user: string,
    name: string;
    date: string;
    price: number;
    parts: {
        strap_img_name: string,
        case_img_name: string,
        dial_img_name: string
    }
}
