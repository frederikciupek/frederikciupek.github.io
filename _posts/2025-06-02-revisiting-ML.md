---
layout: post
title: Revisiting Bryan Kelly's GARCH Model
date: 2025-06-02 15:09:00
description: In this post I revisit some of volatility modeling with GARCH to not forget the theory and coding associated with it. In particular I will be looking at a GARCH model and in the future revisit the DCC GARCH model.
tags: [volatility modeling, forecasting]
categories: quant-finance
featured: true
---
GARCH Modeling 


This theme implements a built-in Jekyll feature, the use of Rouge, for syntax highlighting.
It supports more than 100 languages.
This example is in Python
All you have to do is wrap your code in markdown code tags:

````markdown
```python
code code code
```
````

```python
int main(int argc, char const \*argv[])
{
    string myString;

    cout << "input a string: ";
    getline(cin, myString);
    int length = myString.length();

    char charArray = new char * [length];

    charArray = myString;
    for(int i = 0; i < length; ++i){
        cout << charArray[i] << " ";
    }

    return 0;
}
```