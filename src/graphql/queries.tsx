export const GET_FORECAST = `
  query getForecast($accountName: String!, $startingBalance: Int!, $dailySpending: Int!) {
    getForecast(
      accountName: $accountName
      startingBalance: $startingBalance
      dailySpending: $dailySpending
    ) {
      accountName
      startingBalance
      dailySpending
      endingDate
      firstNegativeBalance
      maxDebt
      dailyActivity {
        date
        startingBalance
        transactions {
          id
          name
          amount
          dayOfMonth
        }
        endingBalance
        accountName
      }
    }  
  }
`;


