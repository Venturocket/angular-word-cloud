# angular-word-cloud
Simple (like, really simple) word cloud AngularJS directive.

## Usage
#### Markup
As an element:
```
<word-cloud
	words="{string}"
	type="{string}"
	sort="{string}"
	ng-click="{string}">
</word-cloud>
```
As an attribute:
```
<div
	word-cloud
	words="{string}"
	type="{string}"
	sort="{string}"
	ng-click="{string}">
</div>
```

#### Parameters
|Param	|Type	|Required	|Default|Details|
|-------|-------|-----------|-------|-------|
|words	|string	|yes    	|none 	|Angular expression from which to get the words. See the "Words Array" section below for details. |
|type	|string |no 		|list 	|How to format the words. See the "Cloud Types" section below for details. |
|sort	|string	|no    		|no 	|How to sort the words. See the "Sorting Options" section below for details. |
|ng-click|string|no    		|none 	|The click function for each word. The word clicked will be passed to the function. Omit the parentheses, e.g. "clickFn" not "clickFn()"  |

#### Words Array
The word cloud expects the array of words to be in one of two formats:  
Array of words: `[ 'one', 'two', 'three', ...]`  
Array of word objects: `[ { word: 'one', size: 3 }, { word: 'two', size: 2 }, { word: 'three', size: 1 }, ...]`  
The size of each word can be any valid CSS unit.

#### Cloud Types
- "cloud": The font size for each word is set by the size parameter passed with it.
- "list": The size is only used for sorting, if necessary.

#### Sorting Options
- "asc": Sort the words by size in ascending order
- "desc": Sort the words by size in descending order
- "alphaAsc": Sort the words alphabetically in ascending order
- "alphaDesc": Sort the words alphabetically in descending order
- "no" or empty: Don't sort the words

#### Notes
- Sorting by size uses the number only (not the unit), so 3em < 12px always. It's recommended to keep the same unit for all sizes to achieve reliable sorting results.
