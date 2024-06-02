
export interface TransferOwnaccounts 
{  
    account_deb : string,
    transactionr :
    {
        transfer_type: string,
        debit_description: string,
        to_transfer_to_own_accounts: 
        {
            credit_description: string,
            to: 
            {
                bank_code: string,
                account: 
                {
                    number: string
                    iban:string
                }
            },
            value: 
            {
            currency: string,
            amount: number
            }
        }
    }
}