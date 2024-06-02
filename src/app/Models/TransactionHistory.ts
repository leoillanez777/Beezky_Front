import { TransactionDetail } from "./TransactionDetail";



export interface TransactionHistory {
    page_number:number,
    page_size:number,
    total_pages:number,
    total_records:number,
    content: TransactionDetail[]
    

}