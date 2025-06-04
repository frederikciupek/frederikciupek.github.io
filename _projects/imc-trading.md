---
layout: page
title: IMC Prosperity Algo-Trading Competition Journey
description: >
  A round-by-round breakdown of our team’s participation in the IMC Prosperity algorithmic trading competition, including the evolving marketplace rules, algorithmic strategy adaptations, and performance trajectory.
img: assets/img/imc.jpg
importance: 2
category: fun
---

<p>
  Over two weeks in the spring semester, three friends of mine from the Asset Management Program and I decided to take part in the <strong>IMC Prosperity 3</strong> algo-trading competition. Me and two others focused on the algorithmic trading portion while the 4th focused his attention on the game theory heavy manual trading portion. This write-up walks through each of the five rounds, highlighting what new instruments or rules were introduced, how our code evolved to address them, and how our rankings shifted as we balanced schoolwork and recruiting pressures.
</p>
<p>
(<a href="https://prosperity.imc.com/">IMC Prosperity 3</a>) was a global trading competition that spanned five rounds over fifteen days, drawing over 12,000 teams from around the world. Participants built and refined algorithmic strategies to maximize profits across a simulated marketplace, tackling real‐world challenges like market making, statistical arbitrage, scalping, and locational arbitrage.
</p>

<p>
The event took on a gamified “island” theme: each team managed an island economy that traded various fictional goods - <strong>Kelp</strong>, <strong>Squid Ink</strong>, <strong>Picnic Baskets</strong> (an ETF analog), and <strong>Volcanic Rock Vouchers</strong> (an options analog) - using <strong>SeaShells</strong> as the in‐game currency. Round 1 began with just three products; by the final round, the universe had expanded to fifteen distinct instruments.
</p>

<p>
Before each round, teams uploaded their latest algorithm, which then ran head‐to‐head against a marketplace of automated bots. Competitors dissected bot behavior—identifying predictable quoting or trading patterns - and analyzed price series both within individual products and across related instruments (for example, monitoring ETF–constituent spreads). Performance in that simulated session generated PnL, which determined each team’s rank on the <a href="https://prosperity.imc.com/leaderboard">global leaderboard</a>.
</p>

<p>
Alongside the algorithmic contest, there was a manual trading challenge in every round. Although manual PnL accounted for only a small percentage of total points, it added an entertaining layer—often involving decision‐making under uncertainty, game‐theoretic tactics, or news‐driven trades.
</p>

<p>
For complete details on the algorithms, market rules, and environment, see the <a href="https://imc-prosperity.notion.site/Prosperity-3-Wiki-19ee8453a09380529731c4e6fb697ea4">Prosperity 3 Wiki</a>.
</p>

<href>
<h4><strong>Background</strong><h4>

<p>Unlike many participants in this competition, our team was completely new to algorithmic trading and did not do any prep which made the next two weeks extremely stressful as we had to catch up. In the Asset Management Program at Yale SOM, we mostly focus on quantitative factor strategies that exploit previously uncovered structures in the market, such as the betting against beta factor or momentum factors. We use machine learning algorithms like trees (boosted and bagging) or Natural Language Processing to parse news/websites. In short, what we are used to is one 1. a good amount of data (despite finance having a data problem, as noted by <a href="https://www.bryankellyacademic.org/">Machine Learning Professor Bryan Kelly</a>) to infer future returns and 2. a much longer time horizon for the investments.</p>
<p> We never had to think about making a market and rather whether the market that was made for us is good or not. However, in this competition, we were limited to using no machine learning tools by design. Additionally, the programming was a bit different from what we were used to. In the competition, we were asked to create a trading algorithm class in Python, which would then operate autonomously on the island exchange.
</p>
<p>
The trading algorithm followed a predefined format: a <code>Trader</code> class with a single <code>run</code> method encapsulating all trading logic. Once uploaded, the algorithm was executed in a simulation environment consisting of numerous iterations. During each iteration, the `run` method was invoked with a <code>TradingState</code> object, which provided details about trades since the last iteration, including the algorithm's own trades and those between other market participants. Crucially, the <code>TradingState</code> also contained a per-product overview of outstanding buy and sell orders (quotes) from bots. Based on this information, the algorithm could send orders to match existing quotes or leave unmatched quantities as outstanding quotes for bots to potentially trade on in subsequent iterations. Below you can see a bare-bone example of a Trader class
</p>
{% highlight python linenos %}
from datamodel import OrderDepth, UserId, TradingState, Order
from typing import List
import string

class Trader:
    
    def run(self, state: TradingState):
        print("traderData: " + state.traderData)
        print("Observations: " + str(state.observations))

				# Orders to be placed on exchange matching engine
        result = {}
        for product in state.order_depths:
            order_depth: OrderDepth = state.order_depths[product]
            orders: List[Order] = []
            acceptable_price = 10  # Participant should calculate this value
            print("Acceptable price : " + str(acceptable_price))
            print("Buy Order depth : " + str(len(order_depth.buy_orders)) + ", Sell order depth : " + str(len(order_depth.sell_orders)))
    
            if len(order_depth.sell_orders) != 0:
                best_ask, best_ask_amount = list(order_depth.sell_orders.items())[0]
                if int(best_ask) < acceptable_price:
                    print("BUY", str(-best_ask_amount) + "x", best_ask)
                    orders.append(Order(product, best_ask, -best_ask_amount))
    
            if len(order_depth.buy_orders) != 0:
                best_bid, best_bid_amount = list(order_depth.buy_orders.items())[0]
                if int(best_bid) > acceptable_price:
                    print("SELL", str(best_bid_amount) + "x", best_bid)
                    orders.append(Order(product, best_bid, -best_bid_amount))
            
            result[product] = orders
    
		    # String value holding Trader state data required. 
				# It will be delivered as TradingState.traderData on next execution.
        traderData = "SAMPLE" 
        
				# Sample conversion request. Check more details below. 
        conversions = 1
        return result, conversions, traderData
{% endhighlight %}

<p>
Every trade impacted the algorithm's position in a product, which could be long, short, or neutral. Position limits restricted the absolute long or short positions an algorithm could hold in each product. If the algorithm's orders exceeded these limits, they were automatically canceled by the exchange. This added a layer of complexity, requiring careful management of positions and order quantities to maximize profits while adhering to constraints.
</p>


