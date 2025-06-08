---
layout: post
title: Vanna Tailwind and the Gamma-Volatility Feedback Loop
date: 2025-06-07
description: How falling implied volatility creates structural equity buying demand through option market dynamics
tags: [options, volatility, vanna, gamma, market microstructure]
categories: markets
featured: true
---
Me and many people following the market are very confused by whats going on right now. The market is up more than 15% since liberation day, volatility is down, fundamentals of international as well as nationally operating companies are down. In short we do not really understand why the market would be up. Even at its best, with all trade deals negotiated in place, the minimum tariffs are going to be somewhere around 10% which should at least SOMEWHAT depress the stock market. 

Reading Bloomberg this morning I came across an interesting article talking about the VIX that I would like to share here. 

The CBOE Volatility Index (VIX), often called the "fear index" or "Wall Street's fear gauge," is a measure of market expectations for stock market volatility over the next 30 days. It's derived from the prices of S&P 500 index options and reflects how much market turbulence investors anticipate. A higher VIX typically indicates more fear or uncertainty, while a lower VIX suggests more stability. It is a measure of average implied volatility for the S&P over the next 30 days.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
    </div>
        {% include figure.liquid loading="eager" path="/assets/img/blogs/2025-06-07/vix.png" title="VIX as of June 7th 2025" class="img-fluid rounded z-depth-1" %}
</div>
 
From our option courses we might still remember something called **implied volatility** and the relationship between option prices and volatility overall which is captured by the option greek *vega*. But here is a quick reminder:

#### What is Implied Volatility?

**Implied volatility (IV)** represents the market's forecast of a likely movement in a security's price. Rather than being observed directly, it is **backed out** of the market price of an option using an option pricing model like **Black-Scholes**.

In short, it's the volatility that makes the **model price = market price**. The market price (again in a fully rational world -  but a good enough approximation for most) with the **Black-Scholes-Merton formula**  is given by:

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

The implied volatility of an option is the $\sigma$ needed for the option price to equal the rest of the inputs which are all known. What does the option price have to do with the volatility you ask? 

Well, an option is (if delta hedged correctly) just a bet on volatility. You make money holding the option by selling the underlying when you are up and buying when the underlying moves down. This is often referred to as <a href="https://en.wikipedia.org/wiki/Convexity_(finance)"> positive convexity </a>. Whether you buy or sell an option is then just a function of you thinking that implied volatility of the option is higher/lower than it should be.

Delta in options trading is a measure of an option's price sensitivity to changes in the underlying asset's price and _delta hedging_ in option dynamics is a strategy used to make your position **insensitive** to small moves in the underlying asset.
 $$
\Delta = \frac{\partial C}{\partial S}
$$

You do this by offsetting the $\Delta$ of your options position with an opposite position in the underlying asset (usually stocks or futures). This will become important in a moment.

How volatility overall affects option prices is captured by a **Vega**. One of many option "Greeks" it measures the sensitivity of the option price to a changes in **volatility**:

$$
\text{Vega} = \frac{\partial C}{\partial \sigma}
$$

#### Why is Vega Important?

Traders often watch vega to understand how their portfolios might react to a change in  volatility. If you're holding long options in a low-volatility environment, increasing volatility can significantly boost the value of your position.

When volatility falls, option prices drop. This not only affects valuations—it also structurally changes the delta hedging flows in the market. The delta exposure is can be managed by trading the underlying (often referred to as the spot) and vega exposure by trading different options (some desks want to be vega neutral)\dots

Beyond the simple delta dynamic lies another option greek that is less often talked about: **vanna**, the sensitivity of delta to volatility changes, formally defined as $∂Δ / ∂σ$. You can read more about <a href="https://quantra.quantinsti.com/glossary/Vanna
"> vanna here.</a>.


Using a second order Taylor expansion of the option value over a short time interval, we can decompose the change of the price of the option with first order greeks (delta, vega, gamma) on the first line, and most important second order greeks on the second one: 

$$
\delta \Pi = \Theta \cdot \delta t + \Delta \cdot \delta S + \nu \cdot \delta \sigma + \rho \cdot \delta r 
+ \frac{1}{2} \Gamma \cdot \delta S^2 
+ \text{Vanna} \cdot \delta S \cdot \delta \sigma 
+ \frac{1}{2} \text{Volga} \cdot \delta \sigma^2 
+ \text{Charm} \cdot \delta S \cdot \delta t 
+ \text{residual}
$$

Thus we can see that even delta- and vega-neutral positions are sensitive to changes of spot and volatility. **Vanna** and **Volga** help measure these additional risks related to volatility.

$$
\text{Vanna} = \frac{\partial^2 P}{\partial S \partial \sigma} = \frac{\partial \nu}{\partial S} = \frac{\partial \Delta}{\partial \sigma}
$$

$$
\text{Volga} = \frac{\partial^2 P}{\partial \sigma^2} = \frac{\partial \nu}{\partial \sigma}
$$


#### How does vanna impact calls and puts?
 
- **Calls**: Vanna is positive. Long call holders are typically short the underlying for <a href="https://www.investopedia.com/terms/d/deltahedging.asp#:~:text=Delta%20hedging%20is%20a%20trading,of%20stock%20or%20ETF%20shares.
"> delta-hedging.</a>  As implied volatility drops, the option price falls. With the option price falling the option’s delta also falls, so hedgers must buy back the underlying—creating **buying pressure**.
- **Puts**: Vanna is negative. Long put holders are long the underlying to hedge. As vol drops, the delta approaches zero, so hedgers must sell—creating **selling pressure**.

But here’s the twist: most dealers are short puts, because clients seek downside protection. So, the **signs flip** and they are mostly long vanna. 

- Dealers short puts = short the underlying for delta-neutrality = positive vanna. As vol drops, the delta increases, pushing it up from negative towards 0.

When implied volatility decreases their deltas are falling and they must buy  futures to hedge out that change. This puts upward pressure on stock prices – inversely when implied volatility rises, equities fall.

> So summarizing, as implied volatility drops, the delta of those short puts shrinks → **dealers cover their shorts** → **buying pressure on equities**.

This is what’s referred to as the **“vanna tailwind.”**. Especially into the weekends traders do not want want to carry risk since the market is closed and they cannot hedge during that time. This leads to a recurring bid under markets as dealers buy to hedge their net short put exposure. This is pushing equities higher worse fundamentals. 

 <a href="https://systematicindividualinvestor.com/2020/11/05/how-to-vanna/">There are numerous</a> examples of vanna tailwinds in recent time. For example, on the day after the 2020 U.S. election, stocks ripped higher not because the outcome suddenly looked rosy, but because an extreme “protection‐buying” feedback loop unwound: in the run-up, portfolio managers had bought vast quantities of near-dated S&P 500 puts, forcing dealers to sell futures and spike the VIX; once even a slight thaw in fear arrived (be it softer put demand, an improving outlook, or fading volatility‐short positioning), dealers—long Vanna and sitting on huge short-gamma books—saw their deltas rise as implied volatility fell and were compelled to buy futures to hedge, collapsing volatility and propelling stocks upward. And so, despite an outcome that was less than desirable from the market’s perspective, stocks roared higher as market makers scrambled to buy back hedges and more & more traders jumped onto the train, igniting a post-election market rally.



#### Gamma and Mean-Reversion

This vanna effect doesn’t act alone. 

We just talked about the fact that dealers are typically **short gamma**, particularly from selling puts as fat-tail insurance to their clients. Gamma ($Γ$) captures how delta shifts as the underlying price changes:
$$
\text{Γ} = \frac{\partial Δ}{\partial S}
$$
But in the current market we find something interesting: dealers' net gamma position are positive. Retail and Systematic strategies have <a href="https://www.cboe.com/insights/posts/spx-0-dte-options-jump-to-61-share-on-retail-resurgence/">introduced a surge in so called "zero days to expiry" options (0DTE)</a>. often packaged in at-the-money straddles/strangles. Dealers take the opposite side of these and end up long very high gamma options. Because the options are ATM (i.e. Forward = Spot, $F=S$) the gamma is nearly at its maximum for these 0DTE options. Since dealers are holding many of these 0DTE, making a market for retail investors, it is not surprising that if we net every expiry and strike together the street's book is apparently carrying **positive gamma**.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
    </div>
        {% include figure.liquid loading="eager" path="/assets/img/blogs/2025-06-07/gamma.png" title="Gamma versus Strike" class="img-fluid rounded z-depth-1" %}
</div>
<a href="https://www.cboe.com/insights/posts/spx-0-dte-options-jump-to-61-share-on-retail-resurgence/">Data shows </a> that 0DTE options represented over 61% of total SPX volume in May—a record high and a 9-point rise from April. Retail participation fueled this growth: after a dip in April, 0DTE trading by retail investors climbed to 54% of SPX 0DTE volume, up from 47% the previous month.


**Positive gamma positions** (e.g. long straddles or clients buying gamma synthetically) mean that as the underlying moves up or down, the option’s delta moves in the direction of the move. Since we want to delta-hedge these position we need to trade **against** the Δ change shown by the Γ:
- On a rally, the net delta drifts more positive, so you sell stock to flatten out.

- On a drop, the net delta drifts more negative, so you buy stock to flatten out.

To remain delta neutral the dealer must dynamically delta hedge their positioning. Let us take the example of a long call option again:

Dealers are long these 0DTE the contracts, have a positive delta exposure which they need to neutralize by selling the underlying (delta hedging) and are net long gamma (positive convexity). When the market rallies, the dealer’s positive gamma book need to sell the underlying stock to bring their net delta exposure back to zero. When the market falls, they do the opposite: buy stock to offset the new short-delta.

Because the dealer is selling into strength and buying into weakness, these hedging flows _dampen price moves_ through counter cyclical trading. These dealers injects liquidity into the market that suppresses realized volatility of the index, which in turn reduces implied volatility since there are less anticipated movements in the market, in turn lowering the VIX.

A lower VIX brings us back to the **vanna tailwinds** mentioned above depressing option values through Vega in a positive feedback loop depressing the VIX even further. 

#### Structural Implications: Vol-Control & Risk Parity

There is another affect that might be increasing risky assets (especially the S&P) as a result of the volatility crash. The recent global decline in volatility also activated **volatility targeting funds**:

- These funds aim to maintain a constant portfolio volatility.
- As volatility drops, they must **increase leverage** to hit their target vol so they **buy futures, ETFs, equities**.
- This boosts upward momentum initiated by vanna and gamma flows and amplifies them

However, this leverage buildup has a dark side: when vol spikes again, these same models will **de-lever**, selling the assets they just bought. This could make future drawdowns sharper.

This is just one way we can think about how the volatility crash since Liberation Day might have impacted risky assets and - while maybe not inflated - led to large gains in equities. Since derivatives are already a market bigger than the underlying themselves it might stand to reason that the effect is not negligible. When volatility spikes, we might see a sharpe decline resulting from volatility control fund and risk parity funds.
