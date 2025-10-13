---
layout: post
title: How Wall Street Hedges Backfire as Volatility in Rates Market Sinks (a technical breakdown)
date: 2025-10-13 10:33:00
description: In this post I am diving deeper into a phenomenon reported on by Justina Lee of Bloomberg who highlighed how hedge funds and banks are losing money due to sinking rates volatility.
tags: [options, interest rates]
categories: economics
featured: true
---
We dove deep into stock option technicals & greeks a few months back by examining the positive feedback loop muting volatility in the broader stock market and how hedging is affecting broader indexes in <a href="https://frederikciupek.github.io/blog/2025/vanna-tailwinds/">this article</a>.

Now I want to examine a different option phenomenon that is impacted interest rate markets in the past weeks. Most people are more familiar with stock options like simple calls and puts. But another big option market is the interest rate option market. Bascially, an option that allows the owner the **option** to either sell or buy an interest rate product. The underlying here are interest rate related securities such as United State Treasury Bonds or Bills at different maturities. 

In particular today we will be covering a derivative prdocuts of interest rates called swap-options. As the name suggests its an option on swaps. In a recent article Justina Lee - a accomplished Bloomberg Quant Finance focused reporter whose Newsletter I follow religiously - reports on 'Volamagedon'. Referring to the current decline of volatility in the rates market she in particular reports on 10Y20Y swaptions decline in implied volatility and with that in price. 

Below you find a time series chart of 10Y20Y Swaption Implied volatility. We can see a sharpe drop in recent times and, as we know, volatilty is the main driver of option prices leading to an average loss of 2.6% this month according to data from LumRisk. 

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
    </div>
        {% include figure.liquid loading="eager" path="/assets/img/blogs/2025-10-13/-1x-1.png" title="10Y20Y Swaption" class="img-fluid rounded z-depth-1" %}
</div>


Let me recap what a **swaption** is. A swaption gives the holder (long) of the swaption the option to enter into a swap contract at a predetermined point in time that. This contract is either a *Payer Swaption* where the holder of the swaption has the right to choose to pay fixed and receive variable coupons or a *Receiver Swaption* where the holder of the swaption has the right to choose to pay varialbe and receive fixed. If you do not have a directional view you can also contruct a straddle by holding both of these options. You profit for volatility in both directions. 

Buyers of swaptions mostly focus on the hedging aspects of the product. Corporates with fixed-rate debt or floating-rate borrowers often buy payers to hedge against rising rates. MBS desks use the straddle swaption to hedge the negative convexity that comes with investing in mortgages. Being long MBS products means that you are actually short options on interest rates. US agency MBS are basically callable bond. Homeowners can prepay/refinance at par whenever it’s optimal for them:

1. Rates fall a lot: borrowers refinance. Your high-coupon cash flows are called away at par and reinvested at lower yields. Price caps/underperforms a bullet and you underperform compared to a non-callable bond.

2. Rates rise a lot: prepayments slow, the bond’s duration extends (“extension risk”). You’re stuck with below-market coupons for longer; price falls more than a bullet.


As mentioned, as an mortrgage investor you are **short** these options to the homeowner with exposure to the volatility of the interest rate moves. Intuitively, this means that MBS investors are short volatility (vega). The homeowners/borrower's option flattens the upside when yields fall and steepens the downside when yields rise. Hence: short convexity.

> Because you’re short optionality/convexity, MBS typically offer an OAS (option-adjusted spread) over bullets. The “theta” you earn for being short the embedded straddle. In volatile environments, that compensation can be overwhelmed by gamma (convexcity) losses with big rate moves.


MBS desks do not want to be short this convexity however. So they need to 1. hedge gamma (convexcity) 2. for long-dates interest rate vehicles. A swaption is a very good vehicle for that. But, there are others liek caps or floors so why focus on swaptions?


Long maturity (10Y20Y for example) swaptions were very advantageous for this because of their flat to positive carry potential:
- The volatility surface for interest rates were downward sloping in maturity. This means short term implied volatility was higher than long-dated implied vol.
- If we buy a long dated swaption like the 10Y20Y and time passes, the options remaining time to expiry shortens: 10Y20Y becomes a 9Y20Y, then a 8Y20Y and so on.
- So, if the shape of the surface does not change, the options 'rolls down' the curve towards higher implied vol buckets. This pushes the implied vol of the option up just because time passed. 

$$
\Delta P \approx
\underbrace{\mathrm{Vega}\times \Delta\sigma_{\text{rolldown}}}_{\text{vol rolldown carry}}
-\underbrace{\Theta}_{\text{time decay}}
+\underbrace{\tfrac{1}{2}\Gamma\,(\Delta r)^2}_{\text{convexity/gamma}}
+\cdots
$$


- When ∂σ/∂T < 0 (short-dated vol > long-dated), then as time passes Δσ_rolldown > 0, so Vega × Δσ_rolldown is positive.
- That positive vega-carry can offset or even exceed the ususal negative theta of a long position. 


Because of the flat-to-positive carry potential many hedge funds and banks use these long-dated swaptions to tail risk hedge potential interest rate moves.

The aritcle mentioned that long-end implied vols fell a lot. Due to less macro fear expectations of Fed cuts and the Trump always chickens out (TACO) movement, investors unwound hedges which pushed the implied volatility lower. When the volatility falls outright the price of the option falls outright, overwhelming the rolldown (carry) tailwind of theta.