
export interface Transferencias 
{  
    account_deb : string,
    transactionr :
    {
        transfer_type: string,
        debit_description: string,
        to_transfer_to_third_party_accounts: 
        {
            credit_description: string,
            to: 
            {
                bank_code: string,
                account: 
                {
                    number: string
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