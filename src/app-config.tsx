export const ALPHA_VANTAGE_APP_KEY: string = "KW1XDH5IWCOSX43Q";

export const ALPHA_VANTAGE_URL: string = "https://www.alphavantage.co/";

export const ALPHA_VANTAGE_PARAM_FUNCTION: (symbol: string) => string =
    (symbol: string) : string => `query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_APP_KEY}`;




