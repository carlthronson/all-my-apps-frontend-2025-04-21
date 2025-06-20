export const GET_FORECAST = `
  query getForecast($startBalance: Int!, $cash: Int!, $prefix: String) {
    getForecast(
      startBalance: $startBalance
      cash: $cash
      prefix: $prefix
    ) {
      startingBalance
      cash
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
      }
    }  
  }
`;


