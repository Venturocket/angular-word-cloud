describe("Word Cloud Directive", function() {

	var $compile;
	var $rootScope;
	var element;

	beforeEach(module('vr.directives.wordCloud'));

	beforeEach(inject(function(_$compile_, _$rootScope_) {
		$compile = _$compile_;
		$rootScope = _$rootScope_;
	}));

	describe('with a simple array', function() {

		beforeEach(function() {
			$rootScope.words = [ 'one', 'two', 'three' ];
			$rootScope.clicked = jasmine.createSpy('clicked');
		});

		describe('and an ngClick attribute', function() {

			beforeEach(function() {
				element = $compile("<word-cloud words='words' ng-click='clicked'></word-cloud>")($rootScope);
				$rootScope.$digest();
			});

			it('should add the elements to the dom', function() {
				expect(element).toBeTag('DIV');
				expect(element).toHaveClass('word-cloud');

				var buttons = element.find('button');
				expect(buttons.length).toBe(3);
				expect(buttons.eq(0).attr('ng-click')).toBe('clickFn(word.word)');
				expect(buttons.eq(0).attr('style')).toBe(undefined);
				expect(buttons.eq(0).find('span').text()).toBe('one');
				expect(buttons.eq(1).find('span').text()).toBe('two');
				expect(buttons.eq(2).find('span').text()).toBe('three');
			});

			it('should send the word with the click', function() {
				element.find('button').eq(0).click();
				expect($rootScope.clicked).toHaveBeenCalledWith('one');
			});

			it('should add another word to the list', function() {
				$rootScope.$apply(function() { $rootScope.words.push('four'); });
				expect(element.find('button').length).toBe(4);
				expect(element.find('button').eq(3).find('span').text()).toBe('four');
			});

			it('should remove a word from the list', function() {
				$rootScope.$apply(function() { $rootScope.words.splice(1,1); });
				expect(element.find('button').length).toBe(2);
				expect(element.find('button').eq(1).find('span').text()).toBe('three');
			});

		});

		describe('sorted in ascending order alphabetically',function() {

			beforeEach(function() {
				element = $compile("<word-cloud words='words' sort='alphaAsc'></word-cloud>")($rootScope);
				$rootScope.$digest();
			});

			it('should put them in ascending order', function() {
				var buttons = element.find('button');
				expect(buttons.eq(0).find('span').text()).toBe('one');
				expect(buttons.eq(1).find('span').text()).toBe('three');
				expect(buttons.eq(2).find('span').text()).toBe('two');
			});

		});

		describe('sorted in descending order alphabetically',function() {

			beforeEach(function() {
				element = $compile("<word-cloud words='words' sort='alphaDesc'></word-cloud>")($rootScope);
				$rootScope.$digest();
			});

			it('should put them in descending order', function() {
				var buttons = element.find('button');
				expect(buttons.eq(0).find('span').text()).toBe('two');
				expect(buttons.eq(1).find('span').text()).toBe('three');
				expect(buttons.eq(2).find('span').text()).toBe('one');
			});

		});

		describe('with some child elements', function() {

			beforeEach(function() {
				element = $compile("<word-cloud words='words'><span>hmm</span></word-cloud>")($rootScope);
				$rootScope.$digest();
			});

			it('should transclude the child elements to each button', function() {
				var buttons = element.find('button');
				expect(buttons.eq(0).children().length).toBe(2);
				expect(buttons.eq(0).children().eq(1).text()).toBe('hmm');
			});

		})

	});

	describe('with an array', function() {

		describe('using integer sizes', function() {

			beforeEach(function() {
				$rootScope.words = [ {word:'one',size:1}, {word:'two',size:3}, {word:'three',size:2} ];
			});

			describe('as an unsorted list',function() {

				beforeEach(function() {
					element = $compile("<word-cloud words='words' type='list'></word-cloud>")($rootScope);
					$rootScope.$digest();
				});

				it('should keep the words in the order they came in', function() {
					var buttons = element.find('button');
					expect(buttons.eq(0).find('span').text()).toBe('one');
					expect(buttons.eq(1).find('span').text()).toBe('two');
					expect(buttons.eq(2).find('span').text()).toBe('three');
				});

				it('should not set the size of the buttons individually', function() {
					expect(element.find('button').eq(0).css('font-size')).toBe('');
					expect(element.find('button').eq(1).css('font-size')).toBe('');
					expect(element.find('button').eq(2).css('font-size')).toBe('');
				});

			});

			describe('as a list sorted in ascending order by size',function() {

				beforeEach(function() {
					element = $compile("<word-cloud words='words' type='list' sort='asc'></word-cloud>")($rootScope);
					$rootScope.$digest();
				});

				it('should put them in ascending order', function() {
					var buttons = element.find('button');
					expect(buttons.eq(0).find('span').text()).toBe('one');
					expect(buttons.eq(1).find('span').text()).toBe('three');
					expect(buttons.eq(2).find('span').text()).toBe('two');
				});

				it('should not set the size of the buttons individually', function() {
					expect(element.find('button').eq(0).css('font-size')).toBe('');
					expect(element.find('button').eq(1).css('font-size')).toBe('');
					expect(element.find('button').eq(2).css('font-size')).toBe('');
				});

			});

			describe('as a list sorted in descending order by size',function() {

				beforeEach(function() {
					element = $compile("<word-cloud words='words' type='list' sort='desc'></word-cloud>")($rootScope);
					$rootScope.$digest();
				});

				it('should put them in descending order', function() {
					var buttons = element.find('button');
					expect(buttons.eq(0).find('span').text()).toBe('two');
					expect(buttons.eq(1).find('span').text()).toBe('three');
					expect(buttons.eq(2).find('span').text()).toBe('one');
				});

				it('should not set the size of the buttons individually', function() {
					expect(element.find('button').eq(0).css('font-size')).toBe('');
					expect(element.find('button').eq(1).css('font-size')).toBe('');
					expect(element.find('button').eq(2).css('font-size')).toBe('');
				});

			});

			describe('when the size of a word is changed',function() {

				beforeEach(function() {
					element = $compile("<word-cloud words='words' type='list' sort='desc'></word-cloud>")($rootScope);
					$rootScope.$digest();
					$rootScope.$apply(function() { $rootScope.words[0].size = 4; })
				});

				it('should put them in descending order', function() {
					var buttons = element.find('button');
					expect(buttons.eq(0).find('span').text()).toBe('one');
					expect(buttons.eq(1).find('span').text()).toBe('two');
					expect(buttons.eq(2).find('span').text()).toBe('three');
				});

			});

			describe('as an unsorted cloud',function() {

				beforeEach(function() {
					element = $compile("<word-cloud words='words' type='cloud'></word-cloud>")($rootScope);
					$rootScope.$digest();
				});

				it('should keep the words in the order they came in', function() {
					var buttons = element.find('button');
					expect(buttons.eq(0).find('span').text()).toBe('one');
					expect(buttons.eq(1).find('span').text()).toBe('two');
					expect(buttons.eq(2).find('span').text()).toBe('three');
				});

				it('should set the size of the buttons individually', function() {
					expect(element.find('button').eq(0).css('font-size')).toBe('1em');
					expect(element.find('button').eq(1).css('font-size')).toBe('3em');
					expect(element.find('button').eq(2).css('font-size')).toBe('2em');
				});

			});

			describe('as a cloud sorted in ascending order by size',function() {

				beforeEach(function() {
					element = $compile("<word-cloud words='words' type='cloud' sort='asc'></word-cloud>")($rootScope);
					$rootScope.$digest();
				});

				it('should put them in ascending order', function() {
					var buttons = element.find('button');
					expect(buttons.eq(0).find('span').text()).toBe('one');
					expect(buttons.eq(1).find('span').text()).toBe('three');
					expect(buttons.eq(2).find('span').text()).toBe('two');
				});

				it('should set the size of the buttons individually', function() {
					expect(element.find('button').eq(0).css('font-size')).toBe('1em');
					expect(element.find('button').eq(1).css('font-size')).toBe('2em');
					expect(element.find('button').eq(2).css('font-size')).toBe('3em');
				});

			});

			describe('as a cloud sorted in descending order by size',function() {

				beforeEach(function() {
					element = $compile("<word-cloud words='words' type='cloud' sort='desc'></word-cloud>")($rootScope);
					$rootScope.$digest();
				});

				it('should put them in descending order', function() {
					var buttons = element.find('button');
					expect(buttons.eq(0).find('span').text()).toBe('two');
					expect(buttons.eq(1).find('span').text()).toBe('three');
					expect(buttons.eq(2).find('span').text()).toBe('one');
				});

				it('should set the size of the buttons individually', function() {
					expect(element.find('button').eq(0).css('font-size')).toBe('3em');
					expect(element.find('button').eq(1).css('font-size')).toBe('2em');
					expect(element.find('button').eq(2).css('font-size')).toBe('1em');
				});

			});

		});

		describe('using pixel sizes', function() {

			beforeEach(function() {
				$rootScope.words = [ {word:'one',size:'15px'}, {word:'two',size:'10px'}, {word:'three',size:'20px'} ];
			});

			describe('as an unsorted list',function() {

				beforeEach(function() {
					element = $compile("<word-cloud words='words' type='list'></word-cloud>")($rootScope);
					$rootScope.$digest();
				});

				it('should keep the words in the order they came in', function() {
					var buttons = element.find('button');
					expect(buttons.eq(0).find('span').text()).toBe('one');
					expect(buttons.eq(1).find('span').text()).toBe('two');
					expect(buttons.eq(2).find('span').text()).toBe('three');
				});

				it('should not set the size of the buttons individually', function() {
					expect(element.find('button').eq(0).css('font-size')).toBe('');
					expect(element.find('button').eq(1).css('font-size')).toBe('');
					expect(element.find('button').eq(2).css('font-size')).toBe('');
				});

			});

			describe('as a list sorted in ascending order by size',function() {

				beforeEach(function() {
					element = $compile("<word-cloud words='words' type='list' sort='asc'></word-cloud>")($rootScope);
					$rootScope.$digest();
				});

				it('should put them in ascending order', function() {
					var buttons = element.find('button');
					expect(buttons.eq(0).find('span').text()).toBe('two');
					expect(buttons.eq(1).find('span').text()).toBe('one');
					expect(buttons.eq(2).find('span').text()).toBe('three');
				});

				it('should not set the size of the buttons individually', function() {
					expect(element.find('button').eq(0).css('font-size')).toBe('');
					expect(element.find('button').eq(1).css('font-size')).toBe('');
					expect(element.find('button').eq(2).css('font-size')).toBe('');
				});

			});

			describe('as a list sorted in descending order by size',function() {

				beforeEach(function() {
					element = $compile("<word-cloud words='words' type='list' sort='desc'></word-cloud>")($rootScope);
					$rootScope.$digest();
				});

				it('should put them in ascending order', function() {
					var buttons = element.find('button');
					expect(buttons.eq(0).find('span').text()).toBe('three');
					expect(buttons.eq(1).find('span').text()).toBe('one');
					expect(buttons.eq(2).find('span').text()).toBe('two');
				});

				it('should not set the size of the buttons individually', function() {
					expect(element.find('button').eq(0).css('font-size')).toBe('');
					expect(element.find('button').eq(1).css('font-size')).toBe('');
					expect(element.find('button').eq(2).css('font-size')).toBe('');
				});

			});

			describe('as an unsorted cloud',function() {

				beforeEach(function() {
					element = $compile("<word-cloud words='words' type='cloud'></word-cloud>")($rootScope);
					$rootScope.$digest();
				});

				it('should keep the words in the order they came in', function() {
					var buttons = element.find('button');
					expect(buttons.eq(0).find('span').text()).toBe('one');
					expect(buttons.eq(1).find('span').text()).toBe('two');
					expect(buttons.eq(2).find('span').text()).toBe('three');
				});

				it('should set the size of the buttons individually', function() {
					expect(element.find('button').eq(0).css('font-size')).toBe('15px');
					expect(element.find('button').eq(1).css('font-size')).toBe('10px');
					expect(element.find('button').eq(2).css('font-size')).toBe('20px');
				});

			});

			describe('as a cloud sorted in ascending order by size',function() {

				beforeEach(function() {
					element = $compile("<word-cloud words='words' type='cloud' sort='asc'></word-cloud>")($rootScope);
					$rootScope.$digest();
				});

				it('should put them in ascending order', function() {
					var buttons = element.find('button');
					expect(buttons.eq(0).find('span').text()).toBe('two');
					expect(buttons.eq(1).find('span').text()).toBe('one');
					expect(buttons.eq(2).find('span').text()).toBe('three');
				});

				it('should set the size of the buttons individually', function() {
					expect(element.find('button').eq(0).css('font-size')).toBe('10px');
					expect(element.find('button').eq(1).css('font-size')).toBe('15px');
					expect(element.find('button').eq(2).css('font-size')).toBe('20px');
				});

			});

			describe('as a cloud sorted in descending order by size',function() {

				beforeEach(function() {
					element = $compile("<word-cloud words='words' type='cloud' sort='desc'></word-cloud>")($rootScope);
					$rootScope.$digest();
				});

				it('should put them in descending order', function() {
					var buttons = element.find('button');
					expect(buttons.eq(0).find('span').text()).toBe('three');
					expect(buttons.eq(1).find('span').text()).toBe('one');
					expect(buttons.eq(2).find('span').text()).toBe('two');
				});

				it('should set the size of the buttons individually', function() {
					expect(element.find('button').eq(0).css('font-size')).toBe('20px');
					expect(element.find('button').eq(1).css('font-size')).toBe('15px');
					expect(element.find('button').eq(2).css('font-size')).toBe('10px');
				});

			});

		});

	});

});
