---
layout: post
title: Vanna Tailwind and the Gamma-Volatility Feedback Loop
date: 2025-06-07
description: How falling implied volatility creates structural equity buying demand through option market dynamics
tags: [options, volatility, vanna, gamma, market microstructure]
categories: markets
featured: true
---
Me and many people following the market are very confused by whats going on right now. The market is up more than 15% since liberation day, volatility is down and we do not understand really why. Even at its best with all the trade deals in place, the minimum tariffs are going to be somewhere around 10% which should at least SOMEWHAT depress the stock market. 

Reading Bloomberg this morning I came across an interesting article talking about the VIX that I would like to share here. 
The CBOE Volatility Index (VIX), often called the "fear index" or "Wall Street's fear gauge," is a measure of market expectations for stock market volatility over the next 30 days. It's derived from the prices of S&P 500 index options and reflects how much market turbulence investors anticipate. A higher VIX typically indicates more fear or uncertainty, while a lower VIX suggests more stability. It is a measure of average implied volatility for the S&P over the next 30 days.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
    </div>
        {% include figure.liquid loading="eager" path="/assets/img/blogs/2025-06-07/vix.png" title="VIX as of June 7th 2025" class="img-fluid rounded z-depth-1" %}
</div>
 
From our option courses we might still remember something called **implied volatility** and the relationship between option prices and volatility overall captured by the option greek *vega*. But here is a quick reminder:

#### What is Implied Volatility?

**Implied volatility (IV)** represents the market's forecast of a likely movement in a security's price. Rather than being observed directly, it is **backed out** of the market price of an option using an option pricing model like **Black-Scholes**.

In short, it's the volatility that makes the **model price = market price**. The market price (again in a fully rational world, otherwise only a VERY good approximation) with the **Black-Scholes-Merton formula** which is given by:

$
C = S_0 \cdot N(d_1) - K e^{-rT} \cdot N(d_2)
$

Where:

- $ C $ = Call option price  
- $ S_0 $ = Current stock price  
- $ K $ = Strike price  
- $ r $ = Risk-free interest rate  
- $ T $ = Time to expiration (in years)  
- $ \sigma $ = Volatility of the underlying asset  
- $ N(\cdot) $ = Cumulative distribution function of the standard normal distribution

And:

$$
d_1 = \frac{\ln(S_0 / K) + (r + \frac{\sigma^2}{2})T}{\sigma \sqrt{T}}, \quad
d_2 = d_1 - \sigma \sqrt{T}
$$

The implied volatility of an option is the $\sigma$ needed for the price to equal the rest of the inputs which are all known. What does the option price have to do with the volatility though? Well, an option is (if you delta hedge it correctly) just a bet on volatility since you make money holding the option by selling the underlying when you are up and buying when the underlying moves down. This is often referred to as <a href="https://en.wikipedia.org/wiki/Convexity_(finance)"> positive convexity </a>. Whether you buy or sell an option is then just a function of you thinking that implied volatility of the option is higher/lower than it should be.

How volatility overall affects option prices is captured by a **Vega**. One of many option "Greeks" it measures the sensitivity of the option price to a changes in **volatility**:

$$
\text{Vega} = \frac{\partial C}{\partial \sigma}
$$

#### Why is Vega Important?

Traders often watch vega to understand how their portfolios might react to a change in implied volatility. If you're holding long options in a low-volatility environment, increasing IV can significantly boost the value of your position.

When implied volatility falls, option prices drop. This not only affects valuations—it also structurally now changes the delta hedging flows in the market. 

At the heart of this dynamic lies another option greek less often talked about **vanna**, the sensitivity of delta to volatility changes, formally defined as $∂Δ / ∂σ$. You can read more about <a href="https://quantra.quantinsti.com/glossary/Vanna
"> vanna here.</a> It is an extension of the vega measure so to speak.

How does vanna impact calls and puts?

- **Calls**: Vanna is positive. Long call holders are typically short the underlying for <a href="https://www.investopedia.com/terms/d/deltahedging.asp#:~:text=Delta%20hedging%20is%20a%20trading,of%20stock%20or%20ETF%20shares.
"> delta-hedging.</a>  As implied volatility drops, the option price falls. With the option price falling the option’s delta also falls, so hedgers must buy back the underlying—creating **buying pressure**.
- **Puts**: Vanna is negative. Long put holders are long the underlying to hedge. As vol drops, the delta approaches zero, so hedgers must sell—creating **selling pressure**.

But here’s the twist: most dealers are short puts, because clients seek downside protection. So, the **signs flip** and they are mostly long vanna. 

- Dealers short puts = short the underlying for delta-neutrality = positive vanna (As vol drops, the delta increases, pushing it up from negative to 0)

When implied volatility increases their deltas are rising and they must short more futures to hedge. This puts downward pressure on stock prices – inversely when implied volatility falls, equities rise

So summarizing, as implied volatility drops, the delta of those short puts shrinks → **dealers cover their shorts** → **buying pressure on equities**.

This is what’s referred to as the **“vanna tailwind.”**. Especially into the weekends traders do not want want to carry risk since the market is closed and they cant hedge during that time. This leads to a recurring bid under markets as dealers buy to hedge their net short put exposure. This is pushing equities higher worse fundamentals. 

 <a href="https://systematicindividualinvestor.com/2020/11/05/how-to-vanna/">There are numerous</a> examples of vanna tailwinds in recent time. For example, on the day after the 2020 U.S. election, stocks ripped higher not because the outcome suddenly looked rosy, but because an extreme “protection‐buying” feedback loop unwound: in the run-up, portfolio managers had bought vast quantities of near-dated S&P 500 puts, forcing dealers to sell futures and spike the VIX; once even a slight thaw in fear arrived (be it softer put demand, an improving outlook, or fading volatility‐short positioning), dealers—long Vanna and sitting on huge short-gamma books—saw their deltas rise as implied volatility fell and were compelled to buy futures to hedge, collapsing volatility and propelling stocks upward. And so, despite an outcome that was less than desirable from the market’s perspective, stocks roared higher as market makers scrambled to buy back hedges and more & more traders jumped onto the train, igniting a post-election market rally.





#### Gamma and Mean-Reversion

This vanna effect doesn’t act alone. 
We just talked about the fact that dealers are typically **short gamma**, particularly from selling puts as fat-tail insurance to their clients. Gamma ($Γ$) captures how delta shifts as the underlying price changes:
$$
\text{Γ} = \frac{\partial Δ}{\partial S}
$$
But right now in the current market we find something interesting: dealers' net gamma position are positive. Retail and Systematic strategies have <a href="https://www.cboe.com/insights/posts/spx-0-dte-options-jump-to-61-share-on-retail-resurgence/">introduced a surge in so called "zero days to expiry" options (0DTE)</a>. often packaged in at-the-money straddles/strangles. Dealers take the opposite side of these and end up long very high gamma options. Because the options are ATM (i.e. Forward = Spot, $F=S$) the gamma is nearly at its maximum for these 0DTE options. Holding many of these 0DTE it is not surprising that if we net every expiry and strike together the street's book is apparently carrying positive gamma.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
    </div>
        {% include figure.liquid loading="eager" path="/assets/img/blogs/2025-06-07/gamma.png" title="Gamma versus Strike" class="img-fluid rounded z-depth-1" %}
</div>
<a href="https://www.cboe.com/insights/posts/spx-0-dte-options-jump-to-61-share-on-retail-resurgence/">Data shows </a> that 0DTE options represented over 61% of total SPX volume in May—a record high and a 9-point rise from April. Retail participation fueled this growth: after a dip in April, 0DTE trading by retail investors climbed to 54% of SPX 0DTE volume, up from 47% the previous month.

That means that they are net long a positive gamma position. The table below shows the exposure for all long/short call/put combinations. All long positions have positive $Γ$, i.e. positive **convexity** while the shorts have negative convexity.
| Position       | Δ-Exposure | Γ-Exposure |
| -------------- | ---------- | ---------- |
| **Long Call**  | Positive   | Positive   |
| **Long Put**   | Negative   | Positive   |
| **Short Call** | Negative   | Negative   |
| **Short Put**  | Positive   | Negative   |

**Positive gamma positions** (e.g. long straddles or clients buying gamma synthetically) mean that as the underlying moves up or down, the option’s delta moves in the direction of the move. Since we want to delta-hedge these position we need to trade **against** the Δ change shown by the Γ:
- On a rally, the net delta drifts more positive, so you sell stock to flatten out.

- On a drop, the net delta drifts more negative, so you buy stock to flatten out.

To remain delta neutral the dealer must dynamically delta hedge their positioning. Let us take the example of a long call option again:

Dealers are long these 0DTE the contracts, have a positive delta exposure which they need to neutralize by selling the underlying (delta hedging) and are net long gamma (positive convexity). When the market rallies, the dealer’s positive gamma book need to sell the underlying stock to bring their net delta exposure back to zero. When the market falls, they do the opposite: buy stock to offset the new short-delta.

Because the dealer is selling into strength and buying into weakness, these hedging flows _dampen price moves_ through counter cyclical trading. These dealers injects liquidity not the market that suppress realized volatility of the index (often called ‘mean reverting behavior’) which in turn reduces implied volatility since there are less expected movements in the market, in turn lowering the VIX.
A lower VIX brings us back to the vanna tailwinds mentioned above depressing option values through Vega in a positive feedback loop depressing the VIX even further. 

#### Structural Implications: Vol-Control & Risk Parity

There is another affect that might be increasing risky assets (especially the S&P) as a result of the volatility crash. The recent global decline in volatility also activated **volatility targeting funds**:

- These funds aim to maintain a constant portfolio volatility.
- As vol drops, they must **increase leverage** to hit their target vol so they **buy futures, ETFs, equities**.
- This boosts upward momentum initiated by vanna and gamma flows and amplifies them

However, this leverage buildup has a dark side: when vol spikes again, these same models will **de-lever**, selling the assets they just bought. This could make future drawdowns sharper.

This is just one way we can think about how the volatility crash since Liberation Day might have impacted risky assets and - while maybe not inflated - led to large gains in equities. Since derivatives are already a market bigger than the underlying themselves it might stand to reason that the effect is not negligible. When volatility spikes, we might see a sharpe decline resulting from volatility control fund and risk parity funds.
