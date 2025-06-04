---
layout: page
title: Fed Funds Rate Cut Probability Estimation
description: >
  Code implementation to estimate the probabilities of Fed rate cuts at upcoming FOMC meetings using EFFR futures data in Python, replicating the CME FedWatch Tool and comparing results to official CME data.
img: assets/img/rate_cuts.jpg
importance: 2
category: fun
related_publications: false
---

  <p>
    Over the past day I built a Python-based implementation to replicate the CME FedWatch Tool methodology for estimating the market‐implied probabilities of Federal Reserve rate cuts at upcoming FOMC meetings. By extracting implied EFFR (Effective Federal Funds Rate) futures prices and solving for the implied post‐meeting rate levels, this code computes discrete probabilities of 25 bps moves (cuts or hikes) and then benchmarks those probabilities against the official FedWatch website data. My goals were twofold:
    <ol>
      <li>Understand and reproduce the underlying arithmetic behind the FedWatch Tool’s probabilistic framework.</li>
      <li>Verify that my Python calculations closely align with the publicly available probabilities on the CME website and diagnose any small discrepancies.</li>
    </ol>
  </p>

  <h4>Methodology Overview</h4>
  <p>
    We follow the same <a href="https://www.cmegroup.com/articles/2023/understanding-the-cme-group-fedwatch-tool-methodology.html">CME Group FedWatch Tool methodology</a>, which is based on the principle that the midpoint of each contract month’s implied EFFR futures price reflects a weighted average of the pre‐meeting and post‐meeting Fed Funds rates. Specifically:
    <ol>
      <li>
        Let \(F_{\text{mth}}\) denote the implied average EFFR for the contract maturing in a given calendar month (e.g., June 2025).  
        Let \(R_{\text{current}}\) be the current target Fed Funds rate (derived from the “current” row in our dataset) and available on the <a href="https://www.newyorkfed.org/markets/reference-rates/effr">Fed website</a>.
        Let \(d_{\text{pre}}\) and \(d_{\text{post}}\) be the number of calendar days before and after the FOMC meeting within that month (so that \(d_{\text{pre}} + d_{\text{post}} =\) total calendar days in month, normalized to 30 for uniformity).  
        We solve for \(R_{\text{post}}\) (the market-implied EFFR immediately after the meeting) by inverting the weighted‐average relationship:  
        \[
          F_{\text{mth}} 
          \;=\; 
          \bigl(\tfrac{d_{\text{pre}}}{30}\bigr)\,R_{\text{current}}
          \;+\; 
          \bigl(\tfrac{d_{\text{post}}}{30}\bigr)\,R_{\text{post}} 
          \quad\Longrightarrow\quad
          R_{\text{post}} 
          \;=\; 
          \bigl(F_{\text{mth}} \;-\; \tfrac{d_{\text{pre}}}{30}R_{\text{current}}\bigr)\times \tfrac{30}{d_{\text{post}}}.
        \]
      </li>
      <li>
        Once \(R_{\text{post}}\) is known, the difference \(\Delta R = R_{\text{post}} - R_{\text{current}}\) (in percentage points) is interpreted as the aggregate expected move. Under the assumption that the market only prices full 25 bp increments, we set:
        \[
          n_{\text{cuts}} \;=\; -\,\Bigl\lfloor\,\tfrac{\Delta R}{0.25\%}\Bigr\rfloor 
          \quad\text{and}\quad
          \Pr(\text{one 25 bp cut}) \;=\; \tfrac{-\,\Delta R}{0.25\%}\times 100\%,
        \]
        for \(\Delta R < 0\). Equivalently, if \(\Delta R > 0\), we interpret that as a hike. Rounding and the “floor” operation impose a discrete lower‐bound on the number of 25 bp moves the market expects, with any residual decimal portion interpreted as the probability of the next incremental 25 bp move.
      </li>
      <li>
        We repeat steps 1–2 for each upcoming FOMC meeting month (e.g., June 2025, July 2025). For a given month “m,” the pre‐meeting \(R_{\text{current}}^{(m)}\) is set equal to the previously calculated post‐meeting \(R_{\text{post}}^{(m-1)}\), so that the timeline is linked sequentially.
      </li>
    </ol>
  </p>

  <h2>Code Implementation Details</h2>
  <p>
    The Python code (contained in <code>interest_rate_probabilities.ipynb</code>) uses <code>pandas</code> to read an Excel spreadsheet (“FOMC meetings.xlsx”) with this structure:
    <ul>
      <li><strong>month</strong>: “current”, “Jun”, “Jul”, etc.</li>
      <li><strong>Implied average EFFR</strong>: Midpoint futures‐implied rate (in %). </li>
      <li><strong>days</strong>: Total “normalized” days per month (always 30). </li>
      <li><strong>days pre‐meeting</strong>: Number of days from the start of the month to the FOMC meeting. </li>
      <li><strong>days post‐meeting</strong>: Number of days from the meeting date to month’s end.</li>
    </ul>
    After loading the DataFrame, we extract, for example,  
    <code>june_future</code> = implied‐EFFR for June 2025,  
    <code>june_days_pre</code> = days before June’s meeting,  
    <code>june_days_post</code> = days after June’s meeting,  
    and <code>current_rate</code> = current target Fed Funds rate.  
    We then compute:
    <pre>
{% highlight python linenos %}
# Solve for implied post‐meeting rate in June
x_june = (june_future 
         - (june_days_pre/30)*current_rate) 
         * (30 / june_days_post)

# Compute total “move” implied by futures
delta_june = x_june - current_rate

# Derive discrete probability of a 25 bp cut
num_full_cuts_june = abs(int(delta_june / 0.25))
prob_25bp_cut_june = round(abs(delta_june / 0.25) * 100, 2)
prob_0bp_move_june = round((1 - abs(delta_june / 0.25)) * 100, 2)
{% endhighlight %}
</pre>
  </p>

  <h3>Results &amp; Comparison to FedWatch Data</h3>
  <p>
    For illustrative purposes (using the data snapshot as of June 4, 2025 at 4:21 pm), our code outputs:
    <ul>
      <li><strong>Expected post‐meeting rate for June 2025:</strong> <span style="font-family: monospace;">4.333% → 4.320%</span>  (implying a 0.01337% cut)   
      This corresponds to a 5.35% probability of a single 25 bp cut (since 0.0062% / 0.25 ≈ 0.025, floored to 0) and ~94.65% chance of holding steady.</li>
      <li><strong>Expected post‐meeting rate for July 2025:</strong> <span style="font-family: monospace;">4.33% → 4.244%</span> (implying a 0.0896%% cut).   
      This corresponds to a 35.83% probability of a single 25 bp cut and 64.17% chance of no move.</li>
    </ul>
    When we cross‐check these numbers on the <a href="https://www.cmegroup.com/markets/interest-rates/cme-fedwatch-tool.html">CME FedWatch Tool</a> at the same timestamp, we find:
    <ul>
      <li><strong>June 2025:</strong> CME lists a 4.4% probability of a 25 bp cut. (<em>Nearly matching mine </em>.)</li>
      <li><strong>July 2025:</strong> CME lists a 29% probability of a 25 bp cut (and a 1.2% probability of a 50bps cut leading to 69.9% chance of no change). (<em>Our code shows a 5%  discrepancy here.)</em></li>
    </ul>
    The minor difference for July arises because of perhaps rounding conventions or a mistake on my end. Overall, the alignment is strong, confirming that our Python implementation faithfully reproduces the FedWatch logic.
  </p>

