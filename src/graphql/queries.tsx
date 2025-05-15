export const GET_FORECAST = `
  query getForecast($startBalance: Int!, $cash: Int!) {
    getForecast(
      startBalance: $startBalance
      cash: $cash
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


