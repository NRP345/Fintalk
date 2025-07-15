# Angel One SmartAPI Integration Guide for FinTalk

## Step 1: Create Angel One Account & Get API Access

### Account Setup
1. Visit [Angel One Developer Portal](https://smartapi.angelbroking.com/)
2. Sign up for a developer account
3. Complete KYC verification if required
4. Create a new app in the developer console

### API Credentials
You'll receive:
- **API Key**: Your application identifier
- **Username**: Your Angel One client code
- **Password**: Your Angel One password
- **TOTP**: Time-based OTP from your authenticator app

## Step 2: Environment Variables Setup

Add these variables to your environment:

```bash
# Angel One SmartAPI Configuration
ANGEL_ONE_API_KEY=your_api_key_here
ANGEL_ONE_USERNAME=your_client_code
ANGEL_ONE_PASSWORD=your_password
ANGEL_ONE_TOTP=your_totp_secret
```

## Step 3: Update Stock Service

Replace your current Alpha Vantage calls with Angel One:

```typescript
// In server/routes.ts - Add Angel One endpoints

app.get('/api/stocks/angel/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const stockData = await angelOneService.getEnhancedStockData(symbol);
    
    if (!stockData) {
      return res.status(404).json({ error: 'Stock not found' });
    }
    
    res.json(stockData);
  } catch (error) {
    console.error('Angel One stock fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

app.post('/api/stocks/angel/batch', async (req, res) => {
  try {
    const { symbols } = req.body;
    if (!Array.isArray(symbols)) {
      return res.status(400).json({ error: 'Symbols must be an array' });
    }
    
    const batchData = await angelOneService.getEnhancedStockBatch(symbols);
    res.json(batchData);
  } catch (error) {
    console.error('Angel One batch fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch batch stock data' });
  }
});

app.get('/api/stocks/angel/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const searchResults = await angelOneService.searchStocks(query);
    res.json(searchResults);
  } catch (error) {
    console.error('Angel One search error:', error);
    res.status(500).json({ error: 'Failed to search stocks' });
  }
});
```

## Step 4: Frontend Integration

Update your stock data fetching:

```typescript
// In client/src/hooks/use-stock-data.ts

export const useAngelOneStock = (symbol: string) => {
  return useQuery({
    queryKey: ['/api/stocks/angel', symbol],
    queryFn: async () => {
      const response = await fetch(`/api/stocks/angel/${symbol}`);
      if (!response.ok) throw new Error('Failed to fetch stock');
      return response.json();
    },
    staleTime: 30000, // 30 seconds
    enabled: !!symbol
  });
};

export const useAngelOneSearch = (query: string) => {
  return useQuery({
    queryKey: ['/api/stocks/angel/search', query],
    queryFn: async () => {
      const response = await fetch(`/api/stocks/angel/search/${query}`);
      if (!response.ok) throw new Error('Search failed');
      return response.json();
    },
    enabled: query.length > 2
  });
};
```

## Step 5: Pricing & Limits

### Angel One SmartAPI Pricing
- **Free Tier**: 100 API calls per day
- **Basic Plan**: ₹20/day (5,000 calls)
- **Pro Plan**: ₹500/month (unlimited calls)
- **Enterprise**: Custom pricing

### Rate Limits
- 1 request per second for free tier
- 3 requests per second for paid plans
- Login session valid for 8 hours

## Step 6: Implementation Benefits

### Advantages over Alpha Vantage
- **Indian Market Focus**: Complete NSE/BSE coverage
- **Real-time Data**: Live market feeds
- **Lower Latency**: Servers in India
- **Better Pricing**: More cost-effective for Indian stocks
- **Additional Features**: Order placement capabilities

### Data Quality
- Direct exchange feeds
- Millisecond precision timestamps
- Complete market depth
- Corporate actions included

## Step 7: Migration Strategy

### Phase 1: Parallel Implementation
- Keep Alpha Vantage as fallback
- Test Angel One integration
- Compare data quality

### Phase 2: Gradual Switch
- Use Angel One for Indian stocks
- Alpha Vantage for international stocks
- Monitor performance metrics

### Phase 3: Full Migration
- Complete switch to Angel One
- Remove Alpha Vantage dependency
- Optimize for Indian market data

## Step 8: Error Handling

```typescript
// Enhanced error handling for Angel One
try {
  const stockData = await angelOneService.getEnhancedStockData(symbol);
  return stockData;
} catch (error) {
  // Fallback to Alpha Vantage if Angel One fails
  console.warn('Angel One failed, falling back to Alpha Vantage');
  return await stockService.getEnhancedStockData(symbol);
}
```

## Step 9: Security Considerations

### API Key Protection
- Store credentials securely in environment variables
- Never expose API keys in frontend code
- Implement rate limiting on your endpoints
- Log API usage for monitoring

### Authentication Flow
- Angel One requires login before API calls
- JWT tokens expire after 8 hours
- Implement automatic token refresh
- Handle authentication failures gracefully

## Step 10: Testing

### Test Cases
1. **Login Flow**: Verify authentication works
2. **Stock Search**: Test search functionality
3. **Price Fetching**: Validate real-time prices
4. **Batch Operations**: Test multiple stock requests
5. **Error Scenarios**: Handle API failures
6. **Rate Limiting**: Respect API limits

### Sample Test Data
- **Popular Stocks**: RELIANCE, TCS, INFY, HDFCBANK
- **Exchanges**: NSE, BSE
- **Search Queries**: "HDFC", "Reliance", "TCS"

This integration will significantly improve your FinTalk platform's Indian market data accuracy and performance.