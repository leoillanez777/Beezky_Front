import { AccountBalance } from "./AccountBalance"

export interface Account {
    branch_id: string
    label: string
    balance: AccountBalance
    not_available:AccountBalance
    net_balance:AccountBalance
    user_id: string
    product_code: string
    account_id: string
    bank_id: string
}