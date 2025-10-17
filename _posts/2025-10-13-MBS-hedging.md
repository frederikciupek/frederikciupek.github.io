---
layout: post
title: How Wall Street Hedges Backfire as Volatility in Rates Market Sinks (a technical breakdown)
date: 2025-10-13 10:33:00
description: In this post I am diving deeper into a phenomenon reported on by Justina Lee of Bloomberg who highlighted how hedge funds and banks are losing money due to sinking rates volatility.
tags: [options, interest rates]
categories: economics
featured: true
---

## “Volageddon” in Rates - From Equity Vanna to Rates Vega: Setting the Stage


We dove deep into stock option technicals & greeks a few months back by examining the positive feedback loop muting volatility in the broader stock market and how hedging is affecting broader indexes in <a href="https://frederikciupek.github.io/blog/2025/vanna-tailwinds/">this article</a>.

Now I want to examine a different option phenomenon that is impacted interest rate markets in the past weeks. Most people are more familiar with stock options like simple calls and puts. But another big option market is the interest rate option market. Basically, an option that allows the owner the **option** to either sell or buy an interest rate product. The underlying here are interest rate related products such as swaps or simply United State Treasury Bonds or Bills at different maturities

In particular today we will be covering a derivative products of interest rates called **swap-options**. As the name suggests its an option on a vanilla interest rate swap. In a recent article Justina Lee - a accomplished Bloomberg Quant Finance focused reporter whose Newsletter I follow religiously - <a href ='https://www.bloomberg.com/news/articles/2025-09-23/rates-volmaggedon-hits-wall-street-s-tail-hedges?accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzb3VyY2UiOiJTdWJzY3JpYmVyR2lmdGVkQXJ0aWNsZSIsImlhdCI6MTc2MDAxODU5NCwiZXhwIjoxNzYwNjIzMzk0LCJhcnRpY2xlSWQiOiJUMlU3NldHUFFROFAwMCIsImJjb25uZWN0SWQiOiIwOEFBNDE2OEJDODk0MzgzOEIzQ0IxNjBFMEY5Qzg3MyJ9.CvJcorLoIwK9NV2E1Op5_tzwsqz6V_dnVjyzXBGCI8s'> reports on 'Volamagedon'</a>. Referring to the current decline of long end implied volatilities in the rates market, she in particular reports on 10Y20Y swaptions decline in implied volatility, and with that in price, which lead to large loses in previously profitable long-vega hedges.

With losses mounting in these long-vega hedges and because implied volatility is collapsing, the selloff of long dated vega continues and its supply sharply increases. This pushes implied volatilities even lower leading to a **1negative feedback loop** similar to a gamma volatility feedback.

## The 10y20y Surface Move: What the Chart Actually Says

Below you find a time series chart of 10Y20Y Swaption Implied volatility. We can see a sharp drop in recent times and, as we know, volatility is the main driver of option prices leading to an average loss of 2.6% this month according to data from LumRisk. 

<div
class = "row">
    <div class="col-sm mt-3 mt-md-0">
    </div>
        {% include figure.liquid loading="eager" path="/assets/img/blogs/2025-10-13/-1x-1.png" title="10Y20Y Swaption" class="img-fluid rounded z-depth-1" %}
</div>

## What Is a Swaption 

Let me recap what a **swaption** is. A swaption gives the holder (long) of the swaption the option to enter into a swap contract at a predetermined point in time that. A 10Y20Y Swaption refers to a 10-year-into-20-year swaption: Option to enter into a swap expires in to 10Y and the underlying is a 20Y swap.

This contract is either a *Payer Swaption* where the holder of the swaption has the right to choose to pay fixed and receive variable coupons or a *Receiver Swaption* where the holder of the swaption has the right to choose to pay variable and receive fixed. If you do not have a directional view you can also construct a swaption straddle by holding both of these options. You profit for volatility in both directions.

## Why MBS Desks Care: You’re Short Convexity and Vega

Buyers of swaptions mostly focus on the hedging aspects of the product. Corporates with fixed-rate debt or floating-rate borrowers often buy payers to hedge against rising rates. MBS desks use the straddle swaption to hedge the negative convexity that comes with investing in mortgages. Being long MBS products means that you are actually short options on interest rates. US agency MBS are basically callable bond, with extension risk. Homeowners can prepay/refinance at par whenever it’s optimal for them - i.e. they have *optionality*.

1. Rates fall a lot: borrowers refinance. Your high-coupon cash flows are called away at par and reinvested at lower yields. Price caps/underperforms a bullet and you underperform compared to a non-callable bond.

2. Rates rise a lot: prepayments slow, the bond’s duration extends (“extension risk”). You’re stuck with below-market coupons for longer; price falls more than a bullet.


As mentioned, as a mortgage investor you are **short** these options to the homeowner with exposure to the volatility of the interest rate moves. Intuitively, this means that MBS investors are short volatility (vega). The homeowners/borrower's option flattens the upside when yields fall and steepens the downside when yields rise. Hence: short convexity.

> Because you’re short optionality/convexity, MBS typically offer an OAS (option-adjusted spread) over bullets (=normal bonds) which is the **“theta”** you earn for being short the embedded straddle. In volatile environments, that compensation can be overwhelmed by gamma (convexity) losses with big rate moves.


However, MBS desks do not want to be fully exposed to this short convexity. So they need to 1. hedge gamma (convexity) 2. for long-dates interest rate vehicles. So how can we hedge gamma for interest rate changes?

In the graph below you can see how MBS are hedged with treasuries for example to reduce the gamma (convexity) in response to yield changes.

<div
class = "row">
    <div class="col-sm mt-3 mt-md-0">
    </div>
        {% include figure.liquid loading="eager" path="/assets/img/blogs/2025-10-13/Hedging mbs with treasuries.jpeg" title="Hedging MBS Gamma with Treasuries" class="img-fluid rounded z-depth-1" %}
</div>


The graph shows clearly that the hedging on MBS gamma works fairly well for small changes in yields. Small changes in interest rate will not significantly affect the exercise likelihood of the MBA refinancing option or increase extension risk so a delta one product (no optionality product) like US Treasuries (USTs) are a good enough hedge to interest rate changes that still allows the MBS desk to rake in the spread. 
## How to hedge MBS Negative Convexity
 However, since the treasury hedge is only a tangential hedge with higher yield changes being not hedged by US Treasuries (UST), how do we hedge the real problem with MBS - MBS spreads being non-stable for large interest rate changes (strong negative convexity). Remember how I pointed out that the MBS spread is UST + compensation for being short the call? If spreads were stable, one could hedge the interest rate exposure with USTs. If rates fell and USTs rallied, the short UST hedge would offset the MBS price move, and vice-versa. If you’ve ever sold covered calls and tried to delta-hedge them, this should feel familiar. An MBS is like being short a call on your bond (the borrower’s prepayment option). Hedging it with USTs is like hedging a covered-call book with the underlying stock:

- For small moves, the delta hedge works fine and you pocket the carry/theta (the MBS spread ↔ the covered-call premium) but for bigger moves, the short-gamma costs you a lot. When rates rally, the “call” gets closer to the money (prepay likelihood jumps): you have to sell duration (sell USTs/receive less) into the rally—just like selling more stock as the short call goes in-the-money—locking in losses.

- When rates sell off, extension risk is the mirror image: you must buy duration into the selloff—like buying stock as your short call goes out-of-the-money.

- On top of that, vega matters: mortgage vol and spreads can gap wider, so the delta hedge (USTs) no longer suffices—just as a covered-call seller is exposed when implied vol jumps even if the stock hasn’t moved much.
 
 
 
 
So, with gaps widening because of this optionality, we are left with a lot of **basis risk**. 

>Simply put, since MBS securities are products with optionality that are short vega, and treasuries are delta one products, you cannot hedge large rate moves. 

## Why are swap-options the preferred hedge?

A swaption is a very good vehicle for such gamma hedge since you can reduce the short negative convex position by holding the option to enter the swaption straddle. But, there are others like caps or floors so why focus on swaptions to hedge the tail risk of big interest rate moves? 

Long maturity (10Y20Y for example) swaptions were very advantageous for tail risk hedging because of their flat to positive carry potential in certain interest rate volatility surface environments.  
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

Note: This is only an approximation. In reality the price change is also impacted by vanna/volga mechanics that impact implied volatilities as rates move and a certain annuity drift  



- When ∂σ/∂T < 0 (short-dated vol > long-dated), then as time passes Δσ_rolldown > 0, so Vega × Δσ_rolldown is positive.
- That positive vega-carry can offset or even exceed the usual negative theta of a long position. 


Because of the flat-to-positive carry potential many hedge funds and banks use these long-dated swaptions to tail risk hedge potential interest rate moves.

The article mentioned that long-end implied vols fell a lot. Due to less macro fear expectations of Fed cuts and the Trump always chickens out (TACO) movement, investors unwound hedges which pushed the implied volatility lower. When the volatility falls outright the price of the option falls outright, overwhelming the rolldown (carry) tailwind of theta.

## Concluding...
Coming back to genesis of this post - the Volamagedon event with the new-found knowledge we have of swaptions we can say the following:

The losses came from a synchronized implied-vol compression in the long end, plus vega supply from hedge unwinds. That overwhelmed positive rolldown and left long-dated vega books with negative carry.