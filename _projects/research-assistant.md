---
layout: page
title: Merger arbitrage & Valuation 
description: >
  Insights, tools, and findings from my research assistantship with Prof. Theis Jensen (Yale School of Management), 
  focused on valuation techniques in M&A—ranging from peer group construction to large-scale data extraction from SEC filings. 
  The project combines empirical finance, machine learning, and scalable Python infrastructure to improve how firms are valued in practice.
img: assets/img/m&a.jpg
importance: 1
category: work
related_publications: true

---

  <p>
    Over the past few months, I’ve had the incredible opportunity to work as a research assistant under  <strong>Professor Theis Jensen</strong> at the Yale School of Management. This experience has fundamentally shaped how I 
    think about financial research-not just as a technical challenge, but as a creative process that bridges academic theory and real-world application. I have always been interested in two aspects of financial research:
    <ol>
  <li>The idea generation for some of these most creative ideas that lead to ground-breaking work changing academia as well as industry</li>
  <li>The pipeline that puts this idea generation process into practice.</li>
</ol>
    
  </p>

  <p>
    Professor Jensen, an Assistant Professor of Finance and a brilliant researcher in empirical asset pricing, focuses 
    on using novel datasets and advanced statistical methods to rethink how we value companies. From day one, he 
    encouraged us not just to help with operational research work but to understand <em>why</em> the work matters - and 
    how it fits into the broader questions driving modern finance. 
    </p>
<p>
    With that I want to focus on the <em> what </em> we have been researching before going into the why and how.
</p>

  <h3>Tackling an Industry Blind Spot: Valuation Techniques</h3>

  <p>
    One of the most fascinating parts of our work revolved around a simple yet often overlooked question: 
    <strong>How exactly do companies get valued?</strong> While that might seem straightforward-plug numbers into a 
    DCF or use peer multiples-the reality is that many firms rely on inconsistent, manual, and often outdated methods to determine valuations. 
  </p>

  <p>
    The ultimate goal of Prof. Theis' research is aimed to scrutinize these traditional approaches and explore whether machine learning models could provide more accurate, scalable alternatives. After all, accurate valuation isn’t just an academic exercise-it’s central to M&A deals, investment decisions, and strategic planning, with trillions of dollars on the line globally.

    But that end goal is still a bit off and I was helping with the data gathering, processing and preliminary evaluation of potential techniques.
  </p>

  <h3>What I Actually Worked On</h3>

  <h4><strong>1. Replicating Peer Group Valuation Research</strong></h4>
  <p>
    I began by replicating results from the paper  <em>"Stick to the Fundamentals and Discover Your Peers"</em> (Knudsen, Kold & Plenborg, 2022 , which proposes that   using multivariate financial fundamentals-rather than broad industry labels-leads to more accurate peer groups since industry classification is crude at best. Using a 'sum of absolute rank differences' (SARD) by selecting comparable companies on the basis of the least sum rank across a range of 5 fundamental variables (ROE, Net Debt/EBIT, Size, Implied Growth, EBIT margin) and evaluating companies on 4 multiples (EV/EBIT, EV/Sales, P/B and P/E). The original paper finds that better peer group selection reduces valuation error by up to 20%. The largest difference is seen in the EV/Sale where the absolute valuation error with the SARD method is 0.254 vs 0.406 with the industry peer group.
    <p>
        Below is the overall result I was replicating from the paper:
    </p>
<div class="row justify-content-sm-center">
  <div class="col-sm-8 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/theis_research/discover_your_peers_result.png" title="Result table from Knudsen et al. (2022)" class="img-fluid rounded z-depth-1" %}
  </div>
</div>

  </p>
<p>
Overall we find similar results. I will edit this section with the method/code I used to do so at a later time.
</p>
<p>&nbsp;</p>

  <h4><strong>2. Building a Custom M&A Valuation Multiple Dataset</strong></h4>
  <p>
    To go further, we needed real-world data. This led me to a massive technical challenge: extracting historical 
    valuation data from over 10,000 M&A filings (DEFM14A and PREM14A) published by the SEC. DEFM14A" stands for Definitive Proxy Statement relating to Mergers under Schedule 14A and is the final version of the proxy statement sent to shareholders to seek approval for a merger, acquisition, or similar transactions. PREM14A stands for Preliminary Proxy Statement relating to Mergers under Schedule 14A and is just the draft version of the DEFM14A. 
      </p>
  <p>
    These documents contain crucial information about how firms were valued by investment banks-but each one is unstructured, inconsistently 
    formatted, and buried deep in legalese.
  </p>
  <p>
<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/theis_research/defm14a_preview.png" title="Example DEFM14A cover page" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    This is a cover page from a DEFM14A form requesting shareholders to vote on the merger between Insud Pharma, S.L., a Spanish company (“Insud”), and Exeltis Project, Inc. (a Delaware corporation)

</div>    
<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/theis_research/defm14a_selecred_companies_analysis.png" title="Example DEFM14A Opinion of the Financial Advisor Section " class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    This is an snippet from a DEFM14A on the financial analysis regarding the merger between Insud Pharma and Exeltis Project. It shows the selected peer group for the transaction and the implied multiples. 
</div> 
</p>  


<p>&nbsp;</p>

<h4><strong>2.1 Approach to Extracting Valuation Multiples </strong> </h4>
<p>
  Now we are going to become a bit more technical. Extracting valuation multiples from thousands of SEC filings presented two main challenges:
  (1) locating the relevant “Comparable Companies Analysis” or “Selected Comparable Companies” tables
  buried in lengthy, unstructured HTML proxy documents (DEFM14A/PREM14A), and (2) reliably parsing
  those tables - even when each filing used different formatting, column headers, or table layouts.
</p>
<p>
 I will walk through the main iterations and not just present the final result. My first idea was to use CrewAI to create a Crew of LLMs that see whether the extraction was successful or not by creating a Reader and Writer Agent with the tasks to read and write. We would go through the whole document looking for certain keywords and create a expanding window around those keywords until a certain string length had been reached. T
</p>
{% highlight python linenos %}

def preprocess_html(extracted_content):
    """Cleans and prepares the extracted content."""
    soup = BeautifulSoup(extracted_content, 'html.parser')
    return soup.get_text(strip=True)
    
def extract_passages(html_content, keyword_list, lines_before_and_after):
    """Extracts relevant passages containing the keyword, including lines_before_and_after lines before and after."""
    print(f'Characters before extracting: {len(html_content)}')
    lines = html_content.split('\n')
    
    # Normalize keyword for case-insensitive search
    keyword_list = [keyword.lower() for keyword in keyword_list]
    
    # Find indices of lines containing the keyword
    keyword_indices = [i for i, line in enumerate(lines) if any(keyword in line.lower() for keyword in keyword_list)]
    
    # Extract lines_before_and_after lines before and after each match
    passages = []
    for idx in keyword_indices:
        start = max(0, idx - lines_before_and_after)
        end = min(len(lines), idx + lines_before_and_after + 1)
        passage = "\n".join(lines[start:end]).strip()
        passages.append(passage)

    extracted_content = "; New passage:\n".join(passages)
    print(f'Characters after extracting: {len(extracted_content)}')

    output = preprocess_html(extracted_content)
    print(f'Characters of output: {len(output)}')
    return output

def write_dict_to_excel(data, file_name="output.xlsx"):
    with pd.ExcelWriter(file_name, engine='openpyxl') as writer:
        for key, value in data.items():
            if isinstance(value, str):
                df = pd.DataFrame({"text": [value]})
            elif isinstance(value, list):
                df = pd.DataFrame(value)
            elif isinstance(value, dict):
                df = pd.DataFrame(list(value.items()))
            else:
                raise ValueError(f"Unsupported data type for key {key}: {type(value)}")
            df.to_excel(writer, sheet_name=key[:31], index=False)  # Sheet names are limited to 31 characters

#%% Crew

# Agent: Reader
reader = Agent(
    role="Reader and relevant text passage finder",
    goal="Identify and extract text passages related to comparable valuations from an HTML file.",
    backstory=(
        "You're working on exploring comparable company analyses. Your role is to parse through a preprocessed HTML code "
        "and extract all text passages that describe or entail results of a comparable company analysis (e.g. peer groups and multiple valuations). "
        "Your work is the input for the writer agent to extract certain comparable valuation data."
    ),
    allow_delegation=False,
    verbose=False
)

# Agent: Writer
writer = Agent(
    role="Writer",
    goal="Extract DCF information from text passages and save it in an dictionary.",
    backstory=(
        "You're working on exploring comparable company valuation analyses. You analyze text passages provided by the reader agent. "
        "These passages contain information related to comparable company valuation analyses which describe how other firms that belong to peer groups in M&A transactions were valued. "
        "Your role is to process this information and create a dictionary."
    ),
    allow_delegation=False,
    verbose=False
)

# Task: Read
read = Task(
    description=(
        "1. Parse the HTML code and identify all text passages related to a comparable company valuation analysis.\n"
        "2. Retain only the relevant passages and separate them using the delimiter '; New passage:'.\n"
        "3. Ensure that the output text is clean, free of HTML tags (if not already cleaned before), and structured for further processing.\n"
        "Please keep in mind it's better to also have unimportant information in the text rather than missing any important information.\n"
        "Here is the preprocessed HTML code: {preprocessed_html_content}"
    ),
    expected_output=(
        "A string of text with all relevant comparable company valuation-related passages. Each passage is separated by '; New passage:' and "
        "each passage should be clean and formatted for easy parsing."
    ),
    agent=reader,
)

# Task: Write
write = Task(
    description=(
        "1. Read the text passages provided by the Reader agent, separated by '; New passage:'.\n"
        "2. Extract and organize the following details into a structured dictionary. If you cannot find corresponding "
        "information, please let the associated fields empty and do not make up data:\n"
        "   - `comparables_text`: A string containing the text parts related to a comparable company valuation analysis.\n"
        "   - `comparables_valuation`: A list of dictionaries, each containing information:\n"
        "       * `date`: The date on which the valuation was performed.\n"
        "       * `statistic`: Which statistic was used on the references ranges of the characteristics. Often different reference ranges (1st quartile, median, mean, 3rd quartiel) are used to estimate the valuation multiple. \n"
        "       * `numerator`: The numerator of the valuation ratio used for the comparable company valuation analysis." 
        "If the table or text says 'enterprise value as a multiple of ... ' that means that the numerator is the company characteristic mentioned next.  .\n"
        "       * `denominator`: The denominator of the valuation ratio used for the comparable company valuation analysis." 
        "If a subheadline notes for example 'enterprise value as a multiple of ... ', the denominator is the enterprise value .\n"
        '       * `multiple`: The multiple used for the valuation (e.g., "6.0x" or some %).\n'
        "       * `valuation`: If applicable, the share price that would result from the multiple before (e.g. $2.00).\n"
        "   - `comparables_peers`: A list of dictionaries containing information about all the peers used to calcualte the multiples in the comparables_valuation dictionary :\n"
        "       * `advisor`: The name of the financial advisor carrying out the analyses'\n"
        "       * `peer`: The name of the comparable companies used to calcualte the multiples.\n"
        "       * `peer_group`: Which peer group this company belongs to (e.g. semiconductor).\n"
        "3. Ensure the output dictionary is complete, consistent, and well-structured. If some information is missing it should be filled "
        "with '' if a string is expected or with NaN if a number is expected.\n"
        "Keep in mind that the reader might also include unimportant information. "
        "You should only use the information you need to create the dictionary. "
        "Further, only include important text for the 'comparables_text' page."
    ),
    expected_output=(
        "A dictionary with the following keys:\n"
        "- `comparables_text`\n"
        "- `comparables_valuation`\n"
        "- `comparables_peers`\n"
        "Each key should contain the relevant extracted information in a structured format, if available. If some information "
        "is not available, the corresponding value should be empty."
    ),
    agent=writer,
)

# Create the crew
crew = Crew(
    agents=[reader, writer],
    tasks=[read, write],
    verbose=False
)

#%% Read the HTML files
path = your/path
folder = path
files = [os.path.join(folder, file) for file in os.listdir(folder) if os.path.isfile(os.path.join(folder, file)) and file[-8:] != 'DS_Store']
print(files)

n = len(files)
i = 0
### Starting of the expanding window
for f in files:
    i += 1
    print(i, f)
    with open(f, 'r', encoding='utf-8') as file:
        html_content = file.read()
    
    j = 0
    preprocessed_html_content = ''
    while len(preprocessed_html_content) < 20000:
        j += 25
        preprocessed_html_content = extract_passages(html_content, ['Financial Analyses','comparable public companies', 'Transaction Multiples Analysis'], j)
    
    if len(preprocessed_html_content) > 300_000:
        print(f'Cannot preprocess file {f}')
        break
    else:
        print(j)
    
    # Run the Crew
    inputs={"preprocessed_html_content": preprocessed_html_content}
    result = crew.kickoff(inputs)

    # Convert output to dictionary
    data = ast.literal_eval(result.raw)
    print(data)
    # Write the dictionary to an Excel file
    document_name = f.split('/')[-1].split('.')[0]
{% endhighlight %}

This was more than suboptimal in many ways:
<table>
  <thead>
    <tr>
      <th>Problem 1</th>
      <th>Problem 2</th>
    <th>Problem 3</th>
      <th>Problem 4</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        Using the double the tokens for one file making it extremely costly and slow, also limiting us to only using GPT-4o. We want to limit the amounts of tokens we use.
      </td>
    <td>
        The expanding window has one fatal flaw: if we have multiple keywords in adjacent rows and expand around them we would be giving the same information twice. We therefore want to index each keyword found and only expand around it if 1. the size of the whole document is too big to use the entire document (which would always give superior results) and 2. If there are not overlapping windows. That means that only if the expanding index of one keyword does not include the other keyword's index we grow from there.
      </td>
      <td>
        Not differentiating between tables and raw text. As you have seen with the example above, some of the multiple valuations are in the text itself but upon further research the majority of them are in tables. But, just inputting raw HTML tables into LLMs does not work well. Information is lost, columns misunderstood, spaces set where they should not be.
      </td>
      <td>
        Since we also want to know which peer group / peer company the valuation multiple is based on, we want to add an extra column <code>peer_group</code>. But that means that for each table & paragraph that has the valuation information we need context about what peer group we are talking about. Therefore we need to extract extra information, so called <em>context</em> from around especially the table. 
      </td>
    </tr>
  </tbody>
</table>


<p>&nbsp;</p>
<h4><strong>2.2 New Iteration: Addressing the Four Key Issues</strong></h4>
<p>
  In the latest version of our pipeline, we overhauled the extraction flow to fix the four problems listed above:
</p>
<table>
  <thead>
    <tr>
      <th>Problem 1</th>
      <th>Problem 2</th>
      <th>Problem 3</th>
      <th>Problem 4</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Using double tokens per file - too costly/slow, forced GPT-4o only.</td>
      <td>Overlapping “expanding windows” around adjacent keywords duplicated data.</td>
      <td>No distinction between tables vs. raw text—tables lost structure when fed directly into the LLM.</td>
      <td>Missing a <code>peer_group</code> column - need context around each table to know which peer group a multiple belonged to.</td>
    </tr>
  </tbody>
</table>

<p>&nbsp;</p>

<p>
  Below we show how each issue has been addressed in the updated code. Wherever possible, we include the relevant snippets with comments to explain how the fix works.
</p>
<hr>

<h5>Issue 1: Token Explosion → Conditional “full doc” vs. “table + context” calls</h5>

<p>
  <strong>Fix:</strong> Before sending any LLM request, we compute the token count for:
  <ul>
    <li>The concatenated tables (as plaintext) <code>table_input</code></li>
    <li>The entire HTML (preprocessed) <code>html_string</code></li>
  </ul>
  We only pass the full document as context if 
  <code>token_length + html_string_length ≤ MAX_TOKEN</code>. Otherwise, we switch to “keyword context only.”  
  This ensures we never exceed the 20K‐token limit and drastically reduces cost.
</p>
{% highlight python %}
# Calculate token lengths
token_length = num_tokens_from_string(table_input, encoding.name)
html_string_length = num_tokens_from_string(html_string, encoding.name)

if (token_length + html_string\_length) <= MAX_TOKEN:
# Safe to send entire document + tables to the LLM
context = 'full_doc'
prompt, system = extractor(table_input, html_string, batch=True)
else:
# Too many tokens—fall back to “keyword‐only” window
context = 'keyword_context'
prompt, system = extractor(table_input, keyword_context, batch=True)

# … then format prompt/system into a chat completion request …

{% endhighlight %}

<p>
  Notice how we never blindly send the whole file. This conditional check ensures we only pay for GPT tokens when necessary, and otherwise rely on the smaller “keyword context” snippet.
</p>

<hr>

<h5>Issue 2: Expanding Windows Overlap → Merge Intervals Instead of Duplicating</h5>
<p>
  Our original code would simply expand <em>±N</em> lines around every keyword index. If two keywords were adjacent, those windows overlapped, producing repeated text. In the new <code>extract_passages</code> we:
  <ol>
    <li>Find all line indices containing any keyword.</li>
    <li>Create an interval <code>(start, end)</code> for each index (where <code>start = index − N/2</code>, <code>end = index + N</code>).</li>
    <li>Merge any overlapping intervals into one “super‐interval.”</li>
    <li>Extract each merged interval exactly once, preventing duplication.</li>
  </ol>
</p>
{% highlight python %}
def extract_passages(html_content, keyword_list, lines_after):
    """Extracts passages containing the keyword, including lines_after lines after and int(lines_after/2) before.
       Overlapping passages are merged into a single passage."""
    lines = html_content.split('\n')
    # Normalize keywords for case-insensitive search
    keyword_list = [keyword.lower() for keyword in keyword_list]
    keyword_indices = [i for i, line in enumerate(lines) if any(keyword in line.lower() for keyword in keyword_list)]
    
    # Create intervals for each keyword occurrence
    intervals = []
    for idx in keyword_indices:
        start = max(0, idx - int(lines_after / 2))
        end = min(len(lines), idx + lines_after + 1)
        intervals.append((start, end))
    
    # Merge overlapping intervals
    if not intervals:
        return ""
    merged_intervals = [intervals[0]]
    for current_start, current_end in intervals[1:]:
        last_start, last_end = merged_intervals[-1]
        if current_start <= last_end:  # Overlapping intervals
            merged_intervals[-1] = (last_start, max(last_end, current_end))
        else:
            merged_intervals.append((current_start, current_end))
    
    # Extract passages from the merged intervals
    passages = []
    for start, end in merged_intervals:
        passage = "\n".join(lines[start:end]).strip()
        passages.append(passage)
    
    extracted_content = "; New passage:\n".join(passages)
    output = preprocess_html(extracted_content)
    return output

{% endhighlight %}

<p>
  By merging intervals, we guarantee that if keyword A’s window would have covered keyword B’s window, we only extract the overlapped lines one time.
</p>

<hr>

<h5>Issue 3: Tables vs. Raw Text → Separate Table Extraction First</h5>
<p>
  Rather than feed raw HTML into the LLM, we now explicitly parse all <code>&lt;table&gt;</code> elements first, tagging only those that pass a “data table” filter. Once we have a list of valid tables, we extract their surrounding context and concatenate them into <code>table_input</code>. If no valid tables exist, we revert to keyword-driven context extraction.
</p>
<p><strong>Key functions:</strong></p>
<ul>
  <li><code>table_contains_keywords(table)</code> checks whether a BeautifulSoup <code>&lt;table&gt;</code> has any multiple‐related keyword.</li>
  <li><code>is_data_table(df)</code> confirms that a parsed DataFrame is mostly numeric or explicitly contains “peer” language.</li>
<li><code>extract_table_context(html_string)</code> returns N lines of context before and after the table by indexing each table and taking only context from the valid keyword-data tables.</li>
  <li><code>get_valid_tables_with_context(html_string)</code> returns a list of (table‐as‐string, [context_before, context_after]) for each valid table.</li>
</ul>

{% highlight python %}

def table_contains_keywords(table):
    """Returns True if the table text contains any of the keywords (case-insensitive)."""
    table_text = table.get_text().lower()
    return any(keyword in table_text for keyword in KEYWORDS_TABLES)

def is_data_table(df, numeric_threshold=0.1, max_text_length=200):
    """
    Determines if a DataFrame is mainly data based on:
      1. Minimum ratio of numeric cells.
      2. No extremely large text blocks.
      3. If keywords like 'peer' appear.
    """
    if df.empty:
        return False

    table_text = df.to_string().lower() ##this to_string can stay
    if any(re.search(keyword, table_text, re.IGNORECASE) for keyword in [
        r"public(ly)? trading multiples",
        r"peer group",
        r"peer",
        r"multiple range",
        r"selected.*compan(?:y|ies)?",
        r'corporation',
        r'corp'
    ]):
        return True

    total_cells = df.shape[0] * df.shape[1]
    numeric_count = 0
    for col in df.columns:
        for val in df[col]:
            try:
                float(str(val).replace('x', '').replace('%', '').replace(",", "").replace('$','').strip())
                numeric_count += 1
            except ValueError:
                pass

    numeric_ratio = numeric_count / total_cells
    for col in df.columns:
        for val in df[col]:
            if isinstance(val, str) and len(val) > max_text_length:
                return False

    return numeric_ratio >= numeric_threshold

def get_valid_tables_with_context(html_string, numeric_threshold=0.05, context_rows=TABLE_CONTEXT_CHARS):
"""
    Parse all <table> tags with BeautifulSoup. For each:
    1. If `table_contains_keywords` is False, skip entirely.
    2. Otherwise, try `pd.read_html` → one or more DataFrames.
    3. Use `is_data_table` to filter out non‐data DataFrames.
    4. If valid, store both the DataFrame (as text) and its pre/post context.
    Returns:
    - valid_tables_data: list of DataFrame‐strings (e.g. "nn".join(df_list))
    - valid_tables_context: list of [context_before, context_after] pairs
    """

def get_valid_tables_with_context(html_string, numeric_threshold=0.05, context_rows=TABLE_CONTEXT_CHARS):
    """
    Parses the HTML to find tables containing keywords. For each table, it attempts to parse
    DataFrames from it and checks if they qualify as data tables. If so, returns the table's
    string data (one or more DataFrames) and its surrounding context.
    
    Returns two lists:
        - valid_tables_data: list of table data strings.
        - valid_tables_context: list of context strings corresponding to each table.
    """
    soup = BeautifulSoup(html_string, "html.parser")
    all_tables = soup.find_all("table")
    valid_tables_data = []
    valid_tables_context = []
    count = 0
    for table in all_tables:
        count += 1
        if not table_contains_keywords(table):
            continue
        
        table_html = str(table)
        try:
            dfs = pd.read_html(io.StringIO(table_html), flavor="bs4")
            # print(dfs)
        except ValueError:
            continue
        
        valid_dfs = []
        for df in dfs:
            df = df.dropna(how="all", axis="columns").dropna(how="all", axis="rows").fillna("")
            if is_data_table(df, numeric_threshold=numeric_threshold):
                print(df)
                valid_dfs.append(df) # removed to_strig to allow for better reading of the tables
        if valid_dfs:
            valid_tables_data.append(valid_dfs)
            context_list = extract_table_context(html_string, table, context_rows, count)
            if context_list not in valid_tables_context:
                valid_tables_context.append(context_list) 
                  
    if len(valid_tables_data) == 0:
        # print("Warning: No valid data tables found in the document. Using all keyword tables")
        valid_tables_data = []
        count = 0
        for table in all_tables:
            count += 1 
            if not table_contains_keywords(table):
                continue
            table_html = str(table)
            try:
                dfs = pd.read_html(io.StringIO(table_html), flavor="bs4")
                # print(dfs)
            except ValueError:
                continue
            
            valid_dfs = []
            for df in dfs:
                df = df.dropna(how="all", axis="columns").dropna(how="all", axis="rows").fillna("")
                valid_dfs.append(df)
            if valid_dfs:
                valid_tables_data.append(valid_dfs)
                context_list = extract_table_context(html_string, table, context_rows, count)
                if context_list not in valid_tables_context:
                    valid_tables_context.append(context_list)
                
    if len(valid_tables_data) == 0:
        # print("Warning: No valid tables found in the document. Using all tables")
        valid_tables_data = []
        count = 0
        for table in all_tables:
            count += 1 
            table_html = str(table)
            try:
                dfs = pd.read_html(io.StringIO(table_html), flavor="bs4")
                # print(dfs)
            except ValueError:
                continue
            
            valid_dfs = []
            for df in dfs:
                df = df.dropna(how="all", axis="columns").dropna(how="all", axis="rows").fillna("")
                valid_dfs.append(df)
            if valid_dfs:
                valid_tables_data.append("\n\n".join(valid_dfs))
                context_list = extract_table_context(html_string, table, context_rows, count)
                if context_list not in valid_tables_context:
                    valid_tables_context.append(context_list)
    return valid_tables_data, valid_tables_context    

{% endhighlight %}

<p>
  By explicitly extracting tables first, we preserve their row/column structure. Only once we have the valid tables do we hand them (plus context) to the LLM, rather than dumping raw HTML.
</p>

<hr>

<h5>Issue 4: Adding a <code>peer_group</code> Column → Context from Table Headings</h5>
<p>
  To know which “peer group” each multiple belongs to, we:
  <ol>
    <li>Extract the table caption or the nearest heading text immediately preceding the table (e.g. “Selected Comparable Companies - Tech” or “Technology Peer Group”).</li>
    <li>Pass that heading into the LLM as part of <code>before_context</code>.</li>
    <li>In the prompt template, instruct the LLM to capture individual “peer_group” information for certain valuations based on that heading text.</li>
  </ol>

In practice, this is handled by:

  <ul>
    <li><code>extract_table_context</code> → returns <code>[context_before, context_after]</code> around each table as well as any table that is not a data table but has peer group information through certain keywords as captured in the KEYWORDS_CONTEXT list</li>
    <li>During prompt construction (<code>extractor</code>), we supply the LLM with both <code>table_data</code> and <code>before_context</code> so that “peer_group” can be parsed.</li>
  </ul>
</p>
{% highlight python %}  
KEYWORDS_CONTEXT = [
        r"selected.*compan(?:y|ies) (analysis|analyses)?",
        r"selected.*public.*compan(?:y|ies)",
        r"peer(?: group)?",
        r"public(ly)? (traded )?compan(?:y|ies)",
        r"comparable.public.*compan(?:y|ies).(analysis|analyses)",
        r"implied multiples analysis",
        r"price\s*(?:to|[\/:-])?\s*earnings"
        r"p\s*[./-]?\s*e(?:\s*ratio)?"
        r"price\s*(?:to|[\/:-])?\s*book"
        r"p\s*[./-]?\s*b(?:\s*ratio)?"
        r"ev\s*(?:to|[\/:-])?\s*ebitda"
        r"enterprise value\s*(?:to|[\/:-])?\s*ebitda"
        r"p\s*[./-]?\s*ebitda(?:\s*ratio)?"
        'earnings per share',
        'eps',
        
]

def extract_table_context(html_string, table, context_chars=1000, count=1):
    """
    Locate the <table> text inside the normalized HTML. Then:
      - Grab `context_chars` characters immediately before the table (likely contains a heading/caption).
      - Grab `context_chars` characters immediately after the table.
      - Strip all HTML tags from both.
    
    Parameters:
      - html_string: The full HTML document as a string.
      - table: A BeautifulSoup table element.
      - context_chars: Number of characters to include before and after the table.
      - count: An identifier (e.g., table number) used in labeling the context.
      
    Returns:
      A string containing the cleaned context for the table.
    """
    # Convert the table element to string.
    table_html = str(table)
    
    # Normalize both the full HTML and the table HTML to reduce formatting differences.
    norm_html = re.sub(r'\s+', ' ', html_string).strip()
    norm_table_html = re.sub(r'\s+', ' ', table_html).strip()

    # Find the table's start and end in the normalized HTML.
    start_index = norm_html.find(norm_table_html)
    if start_index == -1:
        return ""
    end_index = start_index + len(norm_table_html)
    # Extend the context by context_chars before and after the table.
    extended_start = max(0, start_index - context_chars)
    extended_end = min(len(norm_html), end_index + context_chars)
    context_before = norm_html[extended_start:start_index]
    context_after = norm_html[end_index:extended_end]
    # Remove HTML tags from the snippet using BeautifulSoup.
    clean_context_before = BeautifulSoup(context_before, "html.parser").get_text(separator=" ", strip=True)
    clean_context_after = BeautifulSoup(context_after, "html.parser").get_text(separator=" ", strip=True)
    
    return [clean_context_before, clean_context_after]


ddef extractor(input_table, input_string, batch=False) -> Prompt:
    """
    Extracts relevant financial data from the input table and string using OpenAI's API.
    The function is designed to be called in batch mode or individually.
    
    Parameters:
        - input_table: The table data as a string.
        - input_string: The surrounding context as a string.
        - batch: Boolean indicating if the function is called in batch mode.
    """

    
    #   - `comparables_text`: A string containing all text parts related to a comparable company valuation analysis.
    #   In most cases, this will be a few paragraphs about the overall valuation technique with comparable companies. Do not include discounted cash flow analysis text.
    #    If applicable, include descriptions of the calculated multiples and comparable companies in addition to all the other info.
    #     'comparables_text': 'text', 

    prompt = """
    ### Task Instructions
    1. Read the tables that were preprocessed from an HTML file and the input string.
    2. Identify which table contains comparable company multiples and the peer group companies
    3. Extract and organize the following details into a structured dictionary. If you cannot find certain data, please leave the values empty and don't make data up:
    - `comparables_valuation` (list of structured dictionaries containing one key-value pair each)
            Each dictionary in the list must including:
        - **`advisor`**: The name of the financial advisor performing the analysis
        - **`date`** : The date of the multiple valuation (if present).
        - **`statistic`**: The statistic used on the reference ranges of the characteristics (e.g.,'Min', 'Max', 'High', 'Low', 'Mean', 'Median', '1st Quartile', '3rd Quartile') - include al available.
        - **'group'**: Group/Name of the company that the multiple stems from. (e.g. 'peer group A', 'Semiconductor peer group' etc.). If the multiples    based on the company being assessed is present also include it with the company name as the value.
        - ** `numerator`** : The numerator of the valuation ratio (e.g., 'Share Price', 'Earnings of a specific year', 'EPS', 'Market Value').
        - ** `denominator`** : The denominator of the valuation ratio (e.g., 'Share Price', 'Earnings of a specific year', 'EPS', 'Market Value').
        - ** `multiple`** : The multiple used for the valuation (e.g., '6.0' or some %%).
        - **`valuation`** : The resulting share price or value, if stated.
            The valuation value can be a range (e.g., 'between $10 and $20') or a single value (e.g., '$15.00').
            If you can't find a valuation value or multiple, please write "N/A" in the respective field but makre sure to use ALL the information from the tables and context.
            If you cannot find a value for an advisor or the date, go into the input string and find the closest date or advisor name through context or leave it empty if you still don't know.
            Often, multiple tables are used for different peer group. Its important to capture all peer groups because sometimes more than ONE advisor gives a comparable company analysis with different peer groups and different valuations
            Please make sure to account for that in the with the advisor column.  
            *DO NOT* include information from past transaction tables & information, only comparable companies/public companies analysis - this is very important. Use context from the input string and or headings to get the right table.
            Make sure to include all multiples to other financial ratios that are given in the tables. Every row corresponds to a new multiple. If you cannot find a multiple, write "N/A" in the respective field.
            Example output:
            data = [
            {"advisor": "Goldman Sachs", "date": "6/28/2007", "statistic": "median", "group":"semiconductor peer group", numerator": "share price", "denominator": "2007E Earnings GAAP", "multiple": "14.8", "valuation": "$60.00"},
            {"advisor": "Goldman Sachs", "date": "6/28/2007", "statistic": "mean", "group":"peer group", "numerator": "share price", "denominator": "2007E Earnings GAAP", "multiple": "13", "valuation": "$60.00"},
            {"advisor": "Goldman Sachs", "date": "6/28/2007", "statistic": "mean", "group":"peer group", "numerator": "share price", "denominator": "Book Value", "multiple": "7.0", "valuation": "$70.00"},
            {"advisor": "Morgan Stanley", "date": "6/28/2007", "statistic": "median", "group":"peer group", "numerator": "2008E EPS", "denominator": "2007E EPS", "multiple": "9%%", "valuation": "$65.00"},
            {"advisor": "Barkleys", "date": "6/28/2007", "statistic": "median","group":"SELF", "numerator": "Enterprise value", "denominator": " 2009E Distributable Cash Flow", "multiple": "38", "valuation": "NA"}
            ]
            Sort the dictionaries in the list by item and by date.

    - `comparables_peers` (list of dictionaries):
            Each dictionary in the list must include:
            - **` `advisor`**`: The name of the financial advisor performing the analysis
            - **` `peer`**`: The name of each comparable company used in the analysis.
            - **` `peer_group`**`: Which peer group the company belongs to (if stated).
            This data will often be shown as 'Selected Comparable Companies' or something similar. 
            Sometimes more than ONE advisor gives a comparable company analysis. Use the Input HTML as context to find out which advisor creates which peer group (somtimes this info is ONLY in the input string so be careful).
    4. Ensure the output dictionary is complete, consistent, and well-structured. Please add nothing else but give just the dictionary.
    5. Provide the output as a valid Python dictionary with the keys 
        - 'comparables_valuation'
        - 'comparables_peers'
       - Do not add any extra text or summary.

    Example output:
    ```python
{
  "comparables_valuation": [
    {"advisor": "Goldman Sachs", "date": "6/28/2007", "statistic": "median", "group": "semiconductor peer group", "numerator": "share price", "denominator": "2007E Earnings GAAP", "multiple": "14.8", "valuation": "$60.00"},
    {"advisor": "Goldman Sachs", "date": "6/28/2007", "statistic": "mean", "group": "peer group", "numerator": "share price", "denominator": "2007E Earnings GAAP", "multiple": "13", "valuation": "$60.00"}
    // ... additional entries ...
  ],
  "comparables_peers": [
    {"advisor": "Goldman Sachs", "peer": "Apple", "peer_group": "semiconductor"}
    // ... additional entries ...
  ]
}
  """  +  f"""
        Here are the tables, but only take data from comparable company tables and not past transaction tables (will be in the headers of the table normallly)
        '''
        {input_table}
        '''
        """  + f""" 
        \n 
        Here is the input string that was extracted from the HTML file:
        \n
        '''
        {input_string}
        '''
        """
    system = """
    You're an excellent information extractor from tables and SEC filings .
    
    You're gathering financial projections and therefore extract information from markdown tables.
    These tables contain financial multiple analysis.
    Your role is to process these projections and store the data in a dictionary with a certain structure.
    
    Your goal is to create it a dictionary that contains the relevant projections. Please only output the dictionary and no extra text.'
    """
    #print(prompt)
    if not batch:
        return call_gpt_api(system_message = system, user_message = prompt, model=param_model, temperature=param_temperature)
    else:
        return prompt, system

{% endhighlight %}

<hr>

<h4>Summary of the New Pipeline Flow</h4>
<ol>
  <li>
    <strong>Read HTML file</strong> → <code>html_string = open(...).read()</code>
  </li>
  <li>
    <strong>Extract all valid tables first</strong> with 
    <code>get_valid_tables_with_context(html_string)</code>.  
    This returns:
    <ul>
      <li><code>valid_tables_data</code> (list of DataFrame text)</li>
      <li><code>valid_tables_context</code> (list of [before, after] context strings)</li>
    </ul>
  </li>
  <li>
    <strong>Concatenate tables + context</strong> into <code>table_input</code> (join each “before + table_data + after”).
  </li>
  <li>
    <strong>Token check:</strong>  
    <code>token_length = num_tokens(table_input)</code> &amp; <code>html_string_length = num_tokens(html_string)</code>.  
    If <code>token_length + html_string_length ≤ MAX_TOKEN</code>, call LLM with both; else call with only <code>table_input + keyword_context</code>.
  </li>
  <li>
    <strong>LLM prompt</strong> uses both:
    <ul>
      <li><code>input_table</code> (all valid tables as plaintext)</li>
      <li><code>input_string</code> (merged contexts, which contain “peer_group” headings)</li>
    </ul>
    In the system prompt, instruct the model to extract “peer_group,” “advisor,” “date,” etc.
  </li>
  <li>
    <strong>Collect LLM output</strong> (JSON dictionaries). Write them to <code>batch_file</code> as JSONL for offline parsing.
  </li>
</ol>

<p>
  With these changes, we:
  <ul>
    <li>
      <strong>Eliminated redundant expansions</strong> (Issue 2) by merging intervals in <code>extract_passages</code>.
    </li>
    <li>
      <strong>Distinguished tables vs. raw text</strong> (Issue 3) by filtering via <code>is_data_table</code>.
    </li>
    <li>
      <strong>Captured “peer_group”</strong> (Issue 4) by pulling the heading into <code>context_string</code> and prompting the LLM.
    </li>
    <li>
      <strong>Reduced costs</strong> (Issue 1) by skipping the full‐document approach when token limits would be exceeded.
    </li>
  </ul>
  The result is a far more accurate, lower‐cost pipeline that reliably extracts peer‐group multiples from diverse SEC filings. The full code for calling these functions would then look like this:

</p>


```python
# Open the output JSONL batch file for writing
with open(batch_file, "w") as f_out:
    # Compute half the length of preprocessed files (for potential sub‐sampling)
    length_halved = int(len(preprocessed_files_data) / 2)

    # Instead of iterating over all preprocessed files, here we use a single test file for demonstration
    for f in range(1):
        # Override f with the test file path
        f = test
        try:
            # Extract the document name (filename without extension)
            document_name = f.split('/')[-1].split('.')[0]

            # Derive document_type and year from the parent directory name (e.g., "DEFM14A_2021")
            document_type, year = f.split('/')[-2].split('_')

            # Determine the file extension (e.g., "html", "txt", or "htm")
            file_type = f.split('.')[-1]

            # Construct the path to the preprocessed version by replacing folder and extension
            g = (
                f.replace('0-raw-data/DEFM14A', '1-relevant-data/valuations')
                .replace('.htm', '.html')
                .replace('.txt', '.html')
            )
            print(g, f)

            # Check if the preprocessed file exists
            if os.path.exists(g):
                print('Preprocessed Available')
                f = g  # Use the preprocessed version from this point
                preprocessed_version = 'Available'
            else:
                print('Preprocessed Not Available')
                # Skip this file if we cannot find a preprocessed version
                continue

            # Read the entire HTML content of the preprocessed file
            html_string = open(f, 'r', encoding='utf-8').read()

            # Define keywords for extracting “keyword context” (adding the year as well)
            relative_keywords = KEYWORDS_CONTEXT + [year]

            # 1.) Extract keyword context from non‐table portions of the HTML
            keyword_context = extract_keyword_context(
                html_string, KEYWORDS_CONTEXT, KEYWORD_CONTEXT_ROWS
            )
            if len(keyword_context) != 0:
                print(len(keyword_context))

            # 2.) Parse all valid tables and their surrounding context from the HTML
            valid_tables_data, valid_tables_context = get_valid_tables_with_context(
                html_string,
                numeric_threshold=0.05,
                context_rows=TABLE_CONTEXT_CHARS
            )
            print('Valid Tables:', valid_tables_data)

            # 3.) Build `table_input` by concatenating each table’s text + its before/after context
            table_input_parts = []
            for table_data, table_context in zip(valid_tables_data, valid_tables_context):
                # If context exists, pull out “before” and “after” snippets; otherwise, empty string
                before_context = table_context[0] if table_context and len(table_context) > 0 else ""
                after_context = table_context[1] if table_context and len(table_context) > 1 else ""
                # Combine them with newlines to form one chunk per table
                table_input_parts.append(before_context + "\n\n" + table_data + "\n\n" + after_context)

            # Join all table chunks into a single string
            table_input = "\n\n".join(table_input_parts)
            print(table_input)

            # Preprocess the HTML to plain text (strip tags, reduce whitespace)
            html_string = preprocess_html(html_string)

            # Compute token counts for each component
            token_length = num_tokens_from_string(table_input, encoding.name)
            context_length = num_tokens_from_string(keyword_context, encoding.name)
            html_string_length = num_tokens_from_string(html_string, encoding.name)
            # (Debug prints removed; rely on calculated values below)

            # 4.) Decide which context to send to the LLM based on token budget
            if len(table_input) > 0:
                tables_found = 'tables_found'
                # If total tokens (tables + full HTML) fits under MAX_TOKEN, send full context
                if (token_length + html_string_length) <= MAX_TOKEN:
                    context = 'full_doc'
                    prompt, system = extractor(table_input, html_string, batch=True)

                    # Construct a JSONL request for the LLM
                    json_obj = {
                        "custom_id": f"{document_name}-{document_type}-{year}-{context}-{file_type}-{tables_found}",
                        "method": "POST",
                        "url": "/v1/chat/completions",
                        "body": {
                            "model": param_model,
                            "temperature": param_temperature,
                            "messages": [
                                {"role": "system", "content": system},
                                {"role": "user",   "content": prompt}
                            ]
                        }
                    }
                    # Write the JSON object as one line in the output file
                    f_out.write(json.dumps(json_obj) + "\n")

                else:
                    # Token budget exceeded: fall back to “table + keyword context” only
                    context = 'keyword_context'
                    prompt, system = extractor(table_input, keyword_context, batch=True)

                    json_obj = {
                        "custom_id": f"{document_name}-{document_type}-{year}-{context}-{file_type}-{tables_found}",
                        "method": "POST",
                        "url": "/v1/chat/completions",
                        "body": {
                            "model": param_model,
                            "temperature": param_temperature,
                            "messages": [
                                {"role": "system", "content": system},
                                {"role": "user",   "content": prompt}
                            ]
                        }
                    }
                    f_out.write(json.dumps(json_obj) + "\n")

            else:
                # No valid tables found: handle “no_tables_found” case
                tables_found = 'no_tables_found'
                # If full HTML fits under MAX_TOKEN, use full_doc
                if html_string_length <= MAX_TOKEN:
                    context = 'full_doc'
                    prompt, system = extractor('', html_string, batch=True)

                    json_obj = {
                        "custom_id": f"{document_name}-{document_type}-{year}-{context}-{file_type}-{tables_found}",
                        "method": "POST",
                        "url": "/v1/chat/completions",
                        "body": {
                            "model": param_model,
                            "temperature": param_temperature,
                            "messages": [
                                {"role": "system", "content": system},
                                {"role": "user",   "content": prompt}
                            ]
                        }
                    }
                    f_out.write(json.dumps(json_obj) + "\n")

                else:
                    # Too large: use only keyword context
                    context = 'keyword_context'
                    prompt, system = extractor('', keyword_context, batch=True)

                    json_obj = {
                        "custom_id": f"{document_name}-{document_type}-{year}-{context}-{file_type}-{tables_found}",
                        "method": "POST",
                        "url": "/v1/chat/completions",
                        "body": {
                            "model": param_model,
                            "temperature": param_temperature,
                            "messages": [
                                {"role": "system", "content": system},
                                {"role": "user",   "content": prompt}
                            ]
                        }
                    }
                    f_out.write(json.dumps(json_obj) + "\n")

        except Exception as e:
            # If any error occurs during processing, print the filename & error message
            print(f"Error processing file {f}: {e}")
```

<h3>Results: Ordered Excel/JSON files for all</h3>
The final results looks something like this for every company by transforming the json file from the batch request into individual excel files which are then sample checked for accuracy.
<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/theis_research/example_val.png" title="Comparable Valuation result example statement" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    This figure illustrates an example of the output from the comparable valuation analysis, showcasing the valuation multiples derived from peer group comparisons.
</div>
<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/theis_research/example_peers.png" title="Comparable Peers result example statement" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    This figure highlights an example of the peer group analysis, detailing the selected comparable companies used in the valuation process.
</div>
We then merge these results based on the file name present in each excel/json file to a meta-data dataset that has the company being evaluated and the discounted cash flow (DCF) information one of my colleques extracted. 




  <h3>Conclusion and Relfection: From Business Major to Research-Driven Quant</h3>

  <p>
    This experience wasn’t just technical-it was transformative. I’ve learned how ideas turn into publishable research, 
    how collaboration drives innovation, and how intellectual generosity (thanks to Prof. Jensen and my incredible 
    teammates) creates an environment where you genuinely want to do your best work.
  </p>

  <p>
    I’ve sharpened my Python and data engineering skills, learned to work with messy real-world data, use LLMs to work with such data, and gained an 
    intuitive grasp of valuation logic that no textbook could offer. Most importantly, I’ve become certain of one thing: 
    <strong>I want to keep doing this.</strong> I want to continue similar ideas as side-projects
  </p>

  <hr>
  <p>
    If you're curious about the technical side of the project, or if you want to collaborate on related research, feel 
    free to reach out. I'm always happy to talk data, finance, and ideas.
  </p>

